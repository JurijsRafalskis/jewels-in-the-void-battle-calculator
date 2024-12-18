import { IBattleBonusStats, IUnit } from "../model/armyComposition/Unit";
import { IBattleConfiguration } from "../model/BattleConfiguration";
import { BattleStep, IBattleContext, BattleResult, VictoryType, GetBattleResultLabel, GetVictoryLabel, BattleContactPhase, BattleRole } from "../model/BattleStructure";
import { DieTypes, Roll, RollResult } from "../utils/DieUtilities";
import { CalculateTotalArmyStats } from "./ArmyTotals";
import { BattlePhaseLogInstance, EndOfBattleLogInstance, InitiativePhaseLogInstance, MoralePhaseLogInstance, StartOfBattleLogInstance } from "./BattleLogs/LogInstances";

export class BattleCalculator {
    #attackers: IUnit[];
    #defenders: IUnit[];
    #config: IBattleConfiguration;
    #AttackerAggregation: IUnit;
    #DefenderAggregation: IUnit;
    #battleSteps: BattleStep[] = [
        {
            priority: 100,
            stepFunction: initiative
        },
        {
            priority: 200,
            stepFunction: firePhase
        },
        {
            priority: 300,
            stepFunction: shockPhase
        }
        ,
        {
            priority: 400,
            stepFunction: moralePhase
        }
    ];

    constructor(attackers: IUnit[], defenders: IUnit[], config: IBattleConfiguration) {
        this.#attackers = attackers;
        this.#defenders = defenders;
        this.#config = config;
        this.#AttackerAggregation = CalculateTotalArmyStats(this.#attackers, this.#config);
        this.#DefenderAggregation = CalculateTotalArmyStats(this.#defenders, this.#config);
    }


    public registerExtraStep(step: BattleStep) {
        this.#battleSteps.push(step);
        this.#battleSteps.sort((a, b) => a.priority - b.priority);
    }

    public execute(): IBattleContext {
        let context: IBattleContext = {
            log: [],
            attackerCurrentState: structuredClone(this.#AttackerAggregation),
            defenderCurrentState: structuredClone(this.#DefenderAggregation),
            currentAttackersManeuverRollBonus: 0,
            currentDefendersManeuverRollBonus: 0,
            battleResult: BattleResult.InProgress,
            victoryType: VictoryType.Undecided
        }

        context.log.push(new StartOfBattleLogInstance(context));

        while (context.battleResult == BattleResult.InProgress) {
            for (let index in this.#battleSteps) {
                context = this.#battleSteps[index].stepFunction(context, this.#config);
                if (context.battleResult != BattleResult.InProgress) break;
            }
        }

        context.log.push(new EndOfBattleLogInstance(context));
        return context;
    }
}

function initiative(context: IBattleContext, config: IBattleConfiguration): IBattleContext {
    let attackerRoll = Roll(context.attackerCurrentState.Maneuver);
    let defenderRoll = Roll(context.defenderCurrentState.Maneuver);
    context.currentAttackersManeuverRollBonus = Math.round(Math.max(attackerRoll.total - defenderRoll.total, 0));
    context.currentDefendersManeuverRollBonus = Math.round(Math.max(defenderRoll.total - attackerRoll.total, 0));
    context.log.push(
        new InitiativePhaseLogInstance(
            context,
            attackerRoll,
            defenderRoll)
    );
    return context;
}

function firePhase(context: IBattleContext, config: IBattleConfiguration): IBattleContext {
    return damagePhase(context, config, BattleContactPhase.Fire);
}

function shockPhase(context: IBattleContext, config: IBattleConfiguration): IBattleContext {
    return damagePhase(context, config, BattleContactPhase.Shock);
}

function moralePhase(context: IBattleContext, config: IBattleConfiguration): IBattleContext {
    context.attackerCurrentState.Morale = Math.max(context.attackerCurrentState.Morale - 1, 0);
    context.defenderCurrentState.Morale = Math.max(context.defenderCurrentState.Morale - 1, 0);
    context.log.push(new MoralePhaseLogInstance(context));
    if (context.defenderCurrentState.Morale == 0) {
        if (context.attackerCurrentState.Morale == 0) {
            context.battleResult = BattleResult.Stalemate;
            context.victoryType = VictoryType.Undecided;
        }
        else {
            context.battleResult = BattleResult.AttackersVictory;
            context.victoryType = VictoryType.Morale;
        }
    }
    else if (context.attackerCurrentState.Morale == 0) {
        context.battleResult = BattleResult.DefendersVictory;
        context.victoryType = VictoryType.Morale;
    }

    return context;
}

function damagePhase(context: IBattleContext, config: IBattleConfiguration, contactPhase: BattleContactPhase) {
    let phaseBonusSelector: (unit: IUnit) => IBattleBonusStats = contactPhase == BattleContactPhase.Fire ? (u => u.FireBonus) : (u => u.ShockBonus);
    let attackerDamgeRoll = Roll(1, DieTypes.d10);
    let attackersAttack = Math.round((context.attackerCurrentState.Organisation / 100.0) * (attackerDamgeRoll.total + phaseBonusSelector(context.attackerCurrentState).Offensive));
    let attackersDamage = attackersAttack - context.currentDefendersManeuverRollBonus;
    context.defenderCurrentState.Health = Math.max(context.defenderCurrentState.Health - attackersDamage, 0);
    let defenderDamageRoll = Roll(1, DieTypes.d10);
    let defenderAttack = Math.round((context.defenderCurrentState.Organisation / 100.0) * (defenderDamageRoll.total + phaseBonusSelector(context.defenderCurrentState).Offensive));
    let defendersDamage = defenderAttack - context.currentAttackersManeuverRollBonus;
    context.attackerCurrentState.Health = Math.max(context.attackerCurrentState.Health - defendersDamage, 0);
    let lostMoraleFlag = attackersDamage > defendersDamage || (attackersDamage == defendersDamage && context.attackerCurrentState.Organisation > context.defenderCurrentState.Organisation);
    if (lostMoraleFlag) {
        context.defenderCurrentState.Morale = Math.max(context.defenderCurrentState.Morale - 1, 0);
    }
    else {
        context.attackerCurrentState.Morale = Math.max(context.attackerCurrentState.Morale - 1, 0);
    }

    context.log.push(new BattlePhaseLogInstance(
        context,
        contactPhase,
        {roll:attackerDamgeRoll, totalAttack:attackersAttack, totalDamage:attackersDamage},
        {roll:defenderDamageRoll, totalAttack:defenderAttack, totalDamage:defendersDamage},
        lostMoraleFlag ? BattleRole.Defender : BattleRole.Attacker
    ));

    if (context.defenderCurrentState.Health == 0) {
        if (context.attackerCurrentState.Health == 0) {
            context.battleResult = BattleResult.MutualDestruction;
            context.victoryType = VictoryType.Destruction;
        }
        else {
            context.battleResult = BattleResult.AttackersVictory;
            context.victoryType = VictoryType.Destruction;
        }
    }
    else if (context.attackerCurrentState.Health == 0) {
        context.battleResult = BattleResult.DefendersVictory;
        context.victoryType = VictoryType.Destruction;
    }

    function FormatDamageLog(roll: RollResult, totalAttack: number, totalDamageDealt: number, currentUnit: IUnit) {
        return `roll ${roll.total}, total attack ${totalAttack}, total damage ${totalDamageDealt}, remaining HP ${currentUnit.Health}, remaining morale: ${currentUnit.Morale}.`;
    }
    return context;
}