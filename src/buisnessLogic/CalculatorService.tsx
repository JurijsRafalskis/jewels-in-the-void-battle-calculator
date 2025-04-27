import { IArmy } from "../model/armyComposition/Army";
import { IArmyStack } from "../model/armyComposition/ArmyStack";
import { IBattleConfiguration, IRollingModesConfig, RollMode } from "../model/BattleConfiguration";
import { BattleResult, BattleRole, IBattleContext } from "../model/BattleStructure";
import { CloneUnit } from "../utils/UnitUtils";
import { CalculateTotalArmyStats, PostBattleRevitalizationOfUnit } from "./ArmyTotals";
import { BattleCalculator } from "./BattleCalculator";
import { ExtremeCaseLogInstance } from "./BattleLogs/ExtremeCaseLogInstance";
import { ILogInstance } from "./BattleLogs/GenericLogInstance";
import { MultiSimulationLog } from "./BattleLogs/MultiSimulationLogInstance";
import { MultiStackSimulationLog } from "./BattleLogs/MultiStackSimulationInstance";

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

export async function SimulateSingleGauntlet(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ILogInstance[]{
    let result:ILogInstance[] = [];
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);
    let currentMainCombatant = CloneUnit(initialCombatant);
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


export async function SimulateSimpleGauntletOfBattles(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ILogInstance[]{
    let resultingLogs:ILogInstance[] = [];
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);
    let fullOpposition = [opposition.activeArmy, ...opposition.stack].map(o => CalculateTotalArmyStats(o, configuration, true));
    const aggregatedLog = new MultiStackSimulationLog(configuration, fullOpposition, mainCombatantRole, initialCombatant);
    for (let simulationItteration = 0; simulationItteration < configuration.SimulatedIterationsCount; simulationItteration++) {
        let currentMainCombatant = CloneUnit(initialCombatant);
        const contexts:IBattleContext[] = [];
        for(let oppositionIndex = 0; oppositionIndex < fullOpposition.length; oppositionIndex++){
            const [attacker, defender] =  SelectPositionsByRole(currentMainCombatant, fullOpposition[oppositionIndex], mainCombatantRole);
            const calculator = new BattleCalculator(attacker, defender, configuration);
            const singleBattleResult = calculator.execute();
            contexts.push(singleBattleResult);
            if(configuration.PostSimulatedHistory) resultingLogs = resultingLogs.concat(singleBattleResult.log);
            const mainCombatantPostFactumStats = mainCombatantRole == BattleRole.Attacker ? singleBattleResult.attackerCurrentState : singleBattleResult.defenderCurrentState;
            currentMainCombatant = PostBattleRevitalizationOfUnit(
                initialCombatant, 
                mainCombatantPostFactumStats,
                (mainCombatantRole == BattleRole.Attacker && singleBattleResult.battleResult == BattleResult.AttackersVictory) || (mainCombatantRole == BattleRole.Defender && singleBattleResult.battleResult == BattleResult.DefendersVictory)
            );
            if(currentMainCombatant.Health == 0) break;
        }
        aggregatedLog.RegisterResult(contexts);
    }

    let extremeLogs = SimulateExtremeCasesForGauntlet(mainCombatant, opposition, configuration, mainCombatantRole);
    return [aggregatedLog, extremeLogs, ...resultingLogs];
}


export async function SimulateComplexGauntletOfBattles(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ILogInstance[]{
    //throw new Error("SimulateGauntletOfBattles is not yet implemented.");

    let result:ILogInstance[] = [];
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);
    let currentMainCombatant = CloneUnit(initialCombatant);
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

export async function SimulateDoubleStackBattles(attacker:IArmyStack, defender:IArmyStack, configuration:IBattleConfiguration):ILogInstance[]{
    throw new Error("SimulateDoubleStackBattles is not yet implemented.");
    let result:ILogInstance[] = [];

    return result;
}


export function SelectPositionsByRole<T>(main:T, opposition:T, mainCombatantRole:BattleRole):T[]{
    if(mainCombatantRole == BattleRole.Attacker) return [main, opposition];
    else return [opposition, main];
}


export function SimulateExtremeCasesOfBattles(attacker:IArmy, defender:IArmy, configuration:IBattleConfiguration):ExtremeCaseLogInstance{
    const result = new ExtremeCaseLogInstance();
    let copyConfig = structuredClone(configuration);
    copyConfig.AttackerRollMode = MinMode;
    copyConfig.DefenderRollMode = MaxMode;
    let calculator = new BattleCalculator(attacker, defender, configuration);
    let context = calculator.execute();


    result.isDefenderCapableOfVictory = context.battleResult == BattleResult.DefendersVictory;
    result.canAttackerBeDestroyed = context.attackerCurrentState.Health == 0; //Not always true...

    copyConfig.AttackerRollMode = MaxMode;
    copyConfig.DefenderRollMode = MinMode;

    calculator = new BattleCalculator(attacker, defender, configuration);
    context = calculator.execute();

    result.isAttackerCapableOfVictory = context.battleResult == BattleResult.AttackersVictory;
    result.canDefenderBeDestroyed = context.defenderCurrentState.Health == 0; //Not always true...
    return result;
}

export function SimulateExtremeCasesForGauntlet(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole):ExtremeCaseLogInstance{
    const result = new ExtremeCaseLogInstance();
    let copyConfigs:IBattleConfiguration[] = [
        {
            ...structuredClone(configuration),
            AttackerRollMode: MinMode,
            DefenderRollMode: MaxMode
        },
        {
            ...structuredClone(configuration),
            AttackerRollMode: MaxMode,
            DefenderRollMode: MinMode
        }
    ];

    let fullOpposition = [opposition.activeArmy, ...opposition.stack].map(o => CalculateTotalArmyStats(o, configuration, true));
    let initialCombatant = CalculateTotalArmyStats(mainCombatant, configuration);

    copyConfigs.forEach((copiedConfig, configIndex) => {
        let currentMainCombatant = CloneUnit(initialCombatant);
        let latestContext;
        for(let oppositionIndex = 0; oppositionIndex < fullOpposition.length; oppositionIndex++){
            const [attacker, defender] =  SelectPositionsByRole(currentMainCombatant, fullOpposition[oppositionIndex], mainCombatantRole);
            const calculator = new BattleCalculator(attacker, defender, copiedConfig);
            latestContext = calculator.execute();
            const mainCombatantPostFactumStats = mainCombatantRole == BattleRole.Attacker ? latestContext.attackerCurrentState : latestContext.defenderCurrentState;
            currentMainCombatant = PostBattleRevitalizationOfUnit(
                initialCombatant, 
                mainCombatantPostFactumStats,
                (mainCombatantRole == BattleRole.Attacker && latestContext.battleResult == BattleResult.AttackersVictory) || (mainCombatantRole == BattleRole.Defender && latestContext.battleResult == BattleResult.DefendersVictory)
            );
            if(currentMainCombatant.Health == 0) break;
        }

        //This ignores morale influenced loss.
        if(configIndex == 0) {
            if(mainCombatantRole == BattleRole.Attacker){
                result.canAttackerBeDestroyed = currentMainCombatant.Health == 0;
            }
            else{
                result.canDefenderBeDestroyed = currentMainCombatant.Health == 0;
            }
        }
        else {
            if(mainCombatantRole == BattleRole.Attacker){
                result.isAttackerCapableOfVictory = currentMainCombatant.Health > 0
            }
            else{
                result.isDefenderCapableOfVictory = currentMainCombatant.Health > 0
            }
        }
    });

    return result;
}
