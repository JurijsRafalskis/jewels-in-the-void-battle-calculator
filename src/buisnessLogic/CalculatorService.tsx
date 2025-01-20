import { IArmy } from "../model/armyComposition/Army";
import { IArmyStack } from "../model/armyComposition/ArmyStack";
import { IBattleConfiguration, IRollingModesConfig, RollMode } from "../model/BattleConfiguration";
import { BattleResult, BattleRole } from "../model/BattleStructure";
import { CalculateTotalArmyStats, PostBattleRevitalizationOfUnit } from "./ArmyTotals";
import { BattleCalculator } from "./BattleCalculator";
import { ExtremeCaseLogInstance } from "./BattleLogs/ExtremeCaseLogInstance";
import { ILogInstance } from "./BattleLogs/GenericLogInstance";
import { MultiSimulationLog } from "./BattleLogs/MultiSimulationLogInstance";

const MinMode:IRollingModesConfig = {
    DamageRollMode: RollMode.Min,
    ManeuverRollMode: RollMode.Min
}

const MaxMode:IRollingModesConfig = {
    DamageRollMode: RollMode.Max,
    ManeuverRollMode: RollMode.Max
}

export function SimulateSingleBattle(attacker:IArmy, defender:IArmy, configuration:IBattleConfiguration):ILogInstance[]{
    const calculator = new BattleCalculator(attacker, defender, configuration);
    let context = calculator.execute();
    return context.log;
}

export function SimulateSetOfBattles(attacker:IArmy, defender:IArmy, configuration:IBattleConfiguration):ILogInstance[]{
    const aggregatedLog = new MultiSimulationLog(configuration);
    for (var i = 0; i < configuration.SimulatedIterationsCount; i++) {
        const calculator = new BattleCalculator(attacker, defender, configuration);
        const result = calculator.execute();
        aggregatedLog.RegisterResult(result);
    }
    const extremeLogs = SimulateExtremeCasesOfBattles(attacker,defender, configuration);
    const additionalLogs = !configuration.PostSimulatedHistory ? [] : aggregatedLog.GetExtraLogs();
    return [aggregatedLog, extremeLogs, ...additionalLogs];
}

export function SimulateExtremeCasesOfBattles(attacker:IArmy, defender:IArmy, configuration:IBattleConfiguration):ExtremeCaseLogInstance{
    const result = new ExtremeCaseLogInstance();
    let copyConfig = structuredClone(configuration);
    copyConfig.AttackerRollMode = MinMode;
    copyConfig.DefenderRollMode = MaxMode;
    let calculator = new BattleCalculator(attacker, defender, configuration);
    let context = calculator.execute();

    if(context.battleResult == BattleResult.DefendersVictory) result.isDefenderCapableOfVictory = true;
    if(context.attackerCurrentState.Health == 0) result.canAttackerBeDestroyed = true;

    copyConfig.AttackerRollMode = MaxMode;
    copyConfig.DefenderRollMode = MinMode;

    calculator = new BattleCalculator(attacker, defender, configuration);
    context = calculator.execute();

    if(context.battleResult == BattleResult.AttackersVictory) result.isAttackerCapableOfVictory = true;
    if(context.defenderCurrentState.Health == 0) result.canDefenderBeDestroyed = true;
    return result;
}

export function SimulateGauntletOfBattles(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ILogInstance[]{
    throw new Error("SimulateGauntletOfBattles is not yet implemented.");


    let result:ILogInstance[] = [];
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);
    let currentMainCombatant = structuredClone(initialCombatant);
    let fullOpposition = [opposition.activeArmy, ...opposition.stack];
    for(let index in fullOpposition){
        const [attacker, defender] =  SelectPositionsByRole(currentMainCombatant, CalculateTotalArmyStats(fullOpposition[index], configuration), mainCombatantRole);
        const aggregatedLog = new MultiSimulationLog(configuration);
        for (var i = 0; i < configuration.SimulatedIterationsCount; i++) {
            const calculator = new BattleCalculator(attacker, defender, configuration);
            const result = calculator.execute();
            aggregatedLog.RegisterResult(result);
        }
        const combatHealthStatistics = aggregatedLog.GetHealthData();
        const mainCombatantHealthStatistics = SelectPositionsByRole(combatHealthStatistics[0], combatHealthStatistics[1], mainCombatantRole);
    }

    return result;
}

export function SimulateDubleStackBattles(attacker:IArmyStack, defender:IArmyStack, configuration:IBattleConfiguration):ILogInstance[]{
    let result:ILogInstance[] = [];


    return result;
}


export function SimulateSingleGauntlet(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ILogInstance[]{
    let result:ILogInstance[] = [];
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);
    let currentMainCombatant = structuredClone(initialCombatant);
    let fullOpposition = [opposition.activeArmy, ...opposition.stack];
    for(let index in fullOpposition){
        const [attacker, defender] =  SelectPositionsByRole(currentMainCombatant, CalculateTotalArmyStats(fullOpposition[index], configuration), mainCombatantRole);
        const calculator = new BattleCalculator(attacker, defender, configuration);
        const singleBattleResult = calculator.execute();
        result = result.concat(singleBattleResult.log);
        const mainCombatantPostFactumStats = mainCombatantRole == BattleRole.Attacker ? singleBattleResult.attackerCurrentState : singleBattleResult.defenderCurrentState;
        currentMainCombatant = PostBattleRevitalizationOfUnit(initialCombatant, mainCombatantPostFactumStats);
        if(currentMainCombatant.Health == 0) return result;
    }

    return result;
}

function SelectPositionsByRole<T>(main:T, opposition:T, mainCombatantRole:BattleRole):T[]{
    if(mainCombatantRole == BattleRole.Attacker) return [main, opposition];
    else return [opposition, main];
}