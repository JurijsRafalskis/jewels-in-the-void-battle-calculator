import { IArmy } from "../model/armyComposition/Army";
import { IBattleBonusStats, IDamageBonusStats, IUnit } from "../model/armyComposition/Unit";
import { IBattleConfiguration, RollMode } from "../model/BattleConfiguration";
import { BattleStep, IBattleContext, BattleResult, VictoryType, GetBattleResultLabel, GetVictoryLabel, BattleContactPhase, BattleRole } from "../model/BattleStructure";
import { DieSet, DieType, GetMaximumDieSetValue, GetMinimumDieSetValue, Roll, RollMaximumDieSetValue, RollMinimumDieSetValue, RollResult } from "../utils/DieUtilities";
import { CloneUnit } from "../utils/UnitUtils";
import { CalculateTotalArmyStats } from "./ArmyTotals";
import { BattlePhaseLogInstance, EndOfBattleLogInstance, ManeuvrePhaseLogInstance, MoralePhaseLogInstance, PreBattleConditionsLogInstance, StartOfBattleLogInstance } from "./BattleLogs/LogInstances";

export const ManeuvrePhasePriority = 100;
export const FirePhasePriority = 200;
export const ShockPhasePriority = 300;
export const MoralPhasePriority = 400;

export class BattleCalculator {
    #attackersInitialState: IArmy | IUnit;
    #defendersInitialState: IArmy | IUnit;
    #config: IBattleConfiguration;
    #AttackerAggregation: IUnit;
    #DefenderAggregation: IUnit;
    #battleSteps: BattleStep[] = [
        {
            priority: ManeuvrePhasePriority,
            stepFunction: maneuvre
        },
        {
            priority: FirePhasePriority,
            stepFunction: firePhase
        },
        {
            priority: ShockPhasePriority,
            stepFunction: shockPhase
        }
        ,
        {
            priority: MoralPhasePriority,
            stepFunction: moralePhase
        }
    ];

    constructor(attackers: IArmy | IUnit, defenders: IArmy | IUnit, config: IBattleConfiguration) {
        this.#attackersInitialState = attackers;
        this.#defendersInitialState = defenders;
        this.#config = config;
        this.#AttackerAggregation = "units" in this.#attackersInitialState ? CalculateTotalArmyStats(this.#attackersInitialState as IArmy, this.#config) : CloneUnit(this.#attackersInitialState as IUnit);
        this.#DefenderAggregation = "units" in this.#defendersInitialState ? CalculateTotalArmyStats(this.#defendersInitialState as IArmy, this.#config): CloneUnit(this.#defendersInitialState as IUnit);;
    }


    public registerExtraStep(step: BattleStep) {
        this.#battleSteps.push(step);
        this.#battleSteps.sort((a, b) => a.priority - b.priority);
    }

    public execute(): IBattleContext {
        let context: IBattleContext = GenerateDefaultBattleContext(this.#config, this.#AttackerAggregation, this.#DefenderAggregation);

        context.log.push(new PreBattleConditionsLogInstance(context));

        this.#AttackerAggregation.Traits.forEach(t =>{
            t.registerBattleModifications(this, context, BattleRole.Attacker);
        });

        this.#DefenderAggregation.Traits.forEach(t =>{
            t.registerBattleModifications(this, context, BattleRole.Defender);
        });

        context.attackerCurrentState.Health += this.#config.AttackersBattleFieldModifiers.HealthBonus + this.#config.GlobalBattlefieldModifiers.HealthBonus;
        context.defenderCurrentState.Health += this.#config.DefenderBattleFieldModifiers.HealthBonus + this.#config.GlobalBattlefieldModifiers.HealthBonus;

        context.log.push(new StartOfBattleLogInstance(context));

        while (context.battleResult == BattleResult.InProgress) {
            for (let index in this.#battleSteps) {
                context = this.#battleSteps[index].stepFunction(context, this.#config);
                if (context.battleResult != BattleResult.InProgress) break;
            }
            context.turn++;
        }

        context.log.push(new EndOfBattleLogInstance(context));
        return context;
    }
}

function GenerateDefaultBattleContext(config:IBattleConfiguration, attacker:IUnit, defender:IUnit):IBattleContext{
    return {
        turn:1,
        attackerCurrentState: CloneUnit(attacker),
        defenderCurrentState: CloneUnit(defender),
        log: [],
        currentAttackersManeuverRollBonus: 0,
        currentDefendersManeuverRollBonus: 0,
        battleResult: BattleResult.InProgress,
        victoryType: VictoryType.Undecided,
        attackersDamageDie: [{
            diceCount : 1,
            dieType : DieType.d10
        }],
        defendersDamageDie: [{
            diceCount : 1,
            dieType : DieType.d10
        }],
        attackerDamageDieFunction: selectRollFunction(config.AttackerRollMode.DamageRollMode),
        attackerManeuvreDieFunction: selectRollFunction(config.AttackerRollMode.ManeuverRollMode),
        defenderDamageDieFunction: selectRollFunction(config.DefenderRollMode.DamageRollMode),
        defenderManeuvreDieFunction: selectRollFunction(config.DefenderRollMode.ManeuverRollMode),
        metadata: {}
    }
}

function selectRollFunction(mode:RollMode):(dieSet:DieSet[])=>RollResult {
    if(mode == RollMode.Max) return (set) => RollMaximumDieSetValue(set);
    if(mode == RollMode.Min) return (set) => RollMinimumDieSetValue(set);
    return Roll;
}

function maneuvre(context: IBattleContext, config: IBattleConfiguration): IBattleContext {
    let attackerRoll = context.attackerManeuvreDieFunction([
        {
            diceCount: 1,
            dieType: DieType.Custom,
            dieCustomValue: context.attackerCurrentState.Maneuver + config.AttackersBattleFieldModifiers.ManeuverRollBonus + config.GlobalBattlefieldModifiers.ManeuverRollBonus
        }
    ]);
    let defenderRoll = context.defenderManeuvreDieFunction([
        {
            diceCount: 1,
            dieType: DieType.Custom,
            dieCustomValue: context.defenderCurrentState.Maneuver + config.DefenderBattleFieldModifiers.ManeuverRollBonus + config.GlobalBattlefieldModifiers.ManeuverRollBonus
        }
    ]);
    context.currentAttackersManeuverRollBonus = Math.round(
        Math.max(
            attackerRoll.total - defenderRoll.total + context.attackerCurrentState.ManeuverStaticBonus - context.defenderCurrentState.ManeuverStaticBonus + config.AttackersBattleFieldModifiers.ManeuverStaticBonus - config.DefenderBattleFieldModifiers.ManeuverStaticBonus + config.GlobalBattlefieldModifiers.ManeuverStaticBonus,
            0)
    );
    context.currentDefendersManeuverRollBonus = Math.round(
        Math.max(
            defenderRoll.total - attackerRoll.total + context.defenderCurrentState.ManeuverStaticBonus - context.attackerCurrentState.ManeuverStaticBonus - config.AttackersBattleFieldModifiers.ManeuverStaticBonus + config.DefenderBattleFieldModifiers.ManeuverStaticBonus + config.GlobalBattlefieldModifiers.ManeuverStaticBonus,
            0)
    );
    context.log.push(
        new ManeuvrePhaseLogInstance(
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
    let phaseBonusSelector: (unit: IDamageBonusStats) => IBattleBonusStats = contactPhase == BattleContactPhase.Fire ? (u => u.FireBonus) : (u => u.ShockBonus);
    let attackerDamgeRoll = context.attackerDamageDieFunction(context.attackersDamageDie);
    let attackersAttack = Math.max(Math.round(
        ((context.attackerCurrentState.Organization + config.AttackersBattleFieldModifiers.OrganizationBonus + config.GlobalBattlefieldModifiers.OrganizationBonus) / 100.0) *
        (attackerDamgeRoll.total + phaseBonusSelector(context.attackerCurrentState).Offensive + phaseBonusSelector(config.AttackersBattleFieldModifiers).Offensive + phaseBonusSelector(config.GlobalBattlefieldModifiers).Offensive)
    ),0 );
    let attackersDamage = Math.max(attackersAttack - context.currentDefendersManeuverRollBonus,0);
    context.defenderCurrentState.Health = Math.max(context.defenderCurrentState.Health - attackersDamage, 0);
    let defenderDamageRoll = context.defenderDamageDieFunction(context.defendersDamageDie);
    let defenderAttack = Math.max(Math.round(
        ((context.defenderCurrentState.Organization + config.DefenderBattleFieldModifiers.OrganizationBonus + config.GlobalBattlefieldModifiers.OrganizationBonus) / 100.0) *
        (defenderDamageRoll.total + phaseBonusSelector(context.defenderCurrentState).Defensive + phaseBonusSelector(config.DefenderBattleFieldModifiers).Defensive + phaseBonusSelector(config.GlobalBattlefieldModifiers).Defensive)
    ), 0);
    let defendersDamage = Math.max(defenderAttack - context.currentAttackersManeuverRollBonus,0);
    context.attackerCurrentState.Health = Math.max(context.attackerCurrentState.Health - defendersDamage, 0);
    let lostMoraleFlag = attackersDamage > defendersDamage || (attackersDamage == defendersDamage && context.attackerCurrentState.Organization > context.defenderCurrentState.Organization);
    if (lostMoraleFlag) {
        context.defenderCurrentState.Morale = Math.max(context.defenderCurrentState.Morale - 1, 0);
    }
    else {
        context.attackerCurrentState.Morale = Math.max(context.attackerCurrentState.Morale - 1, 0);
    }

    context.log.push(new BattlePhaseLogInstance(
        context,
        contactPhase,
        { roll: attackerDamgeRoll, totalAttack: attackersAttack, totalDamage: attackersDamage },
        { roll: defenderDamageRoll, totalAttack: defenderAttack, totalDamage: defendersDamage },
        lostMoraleFlag ? BattleRole.Defender : BattleRole.Attacker
    ));

    DamagePhaseResolution(context);

    return context;
}

export function DamagePhaseResolution(context:IBattleContext){
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
}