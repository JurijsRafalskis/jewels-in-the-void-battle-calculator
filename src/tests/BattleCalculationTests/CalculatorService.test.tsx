import { expect, test } from 'vitest'
import { GetDefaultAttackerComposition, GetDefaultDefenderComposition, GetDefaultConfig, GenerateRandomSetOfUnits } from "../../configuration/InitialValues";
import { SimulateExtremeCasesOfBattles, SimulateSetOfBattles, SimulateSimpleGauntletOfBattles, SimulateSingleBattle } from '../../buisnessLogic/CalculatorService';
import { IArmy } from '../../model/armyComposition/Army';
import { MultiSimulationLog } from '../../buisnessLogic/BattleLogs/MultiSimulationLogInstance';
import { ExtremeCaseLogInstance } from '../../buisnessLogic/BattleLogs/ExtremeCaseLogInstance';
import { IArmyStack } from '../../model/armyComposition/ArmyStack';
import { BattleRole } from '../../model/BattleStructure';

const interrationCount = 1000;

test("Singular fight should run", () =>{
    let config = GetDefaultConfig();
    let attacker = GetDefaultAttackerComposition();
    let defender = GetDefaultDefenderComposition();
    let logs = SimulateSingleBattle(attacker, defender, config);
    expect(logs.length).toBeGreaterThan(0);
});

test("Random singular fights should run", () => {
    let config = GetDefaultConfig();
    for(let i = 0; i < interrationCount; i++){
        let attacker:IArmy = { units: GenerateRandomSetOfUnits()};
        let defender:IArmy = { units: GenerateRandomSetOfUnits()};
        let logs = SimulateSingleBattle(attacker, defender, config);
        expect(logs.length).toBeGreaterThan(0);
    }
});

test("Multi fight smulation should run", () =>{
    let config = {
        ...GetDefaultConfig(),
        PostSimulatedHistory: false
    };
    let attacker = GetDefaultAttackerComposition();
    let defender = GetDefaultDefenderComposition();
    let [setResult, setEdgeCases] = SimulateSetOfBattles(attacker, defender, config);
    let result = setResult as MultiSimulationLog;
    expect(result).toBeTruthy();
    let [attackerResult, defenderResult] = result.GetHealthData();
    expect(attackerResult).toBeTruthy();
    expect(defenderResult).toBeTruthy();
    let edgeCases = setEdgeCases as ExtremeCaseLogInstance;
    expect(edgeCases).toBeTruthy();
});

test("Simple gauntlet smulation should run", async () =>{
    let config = {
        ...GetDefaultConfig(),
        PostSimulatedHistory: false
    };
    let mainCombatant = GetDefaultAttackerComposition();
    let opossition:IArmyStack = {activeArmy: GetDefaultDefenderComposition(), stack:[GetDefaultDefenderComposition(), GetDefaultDefenderComposition()]} ;
    let [attackerSetResult, attackerSetEdgeCases] = await SimulateSimpleGauntletOfBattles(mainCombatant, opossition, config, BattleRole.Attacker);
    expect(attackerSetResult).toBeTruthy();
    expect(attackerSetEdgeCases).toBeTruthy();
    let [defenderSetResult, defenderSetEdgeCases] = await SimulateSimpleGauntletOfBattles(mainCombatant, opossition, config, BattleRole.Defender);
    expect(defenderSetResult).toBeTruthy();
    expect(defenderSetEdgeCases).toBeTruthy();
});


test("Multi gauntlet smulation should run", () =>{
    //TODO - implement tests when complex simulation is ready/
});