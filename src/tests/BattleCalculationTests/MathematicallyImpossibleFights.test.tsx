import { expect, test } from 'vitest'
import { BattleCalculator } from '../../buisnessLogic/BattleCalculator'
import { DiggerSwarm, PinionsOfGod, SlayersOfFleshUnit } from '../../configuration/InitialUnitValues';
import { IArmy } from '../../model/armyComposition/Army';
import { PrepareUnit } from '../../utils/GenericUtilities';
import { GetDefaultConfig } from '../../configuration/InitialValues'
import { BattleResult } from '../../model/BattleStructure';

let simualtionCount = 10000;

//TODO - change to usage of the perfect/worst possible rolls flags.

test("Tests mathematical impossibility of default Slayers losing to default Swarm.", () => {
    let attacker: IArmy = {
        units: [PrepareUnit(SlayersOfFleshUnit)]
    };

    let defender: IArmy = {
        units: [PrepareUnit(DiggerSwarm)]
    };

    let config = GetDefaultConfig();

    for(let i = 0; i < simualtionCount; i++){
        let calculator = new BattleCalculator(attacker, defender, config);
        let result = calculator.execute();
        expect(result.battleResult).not.toBe(BattleResult.DefendersVictory);
        expect(result.battleResult).not.toBe(BattleResult.MutualDestruction);
    }
});

test("Test mathematical impossibility of default Slayers and Default Pinions losing to double default swarm", () =>{
    let attacker: IArmy = {
        units: [
            PrepareUnit(SlayersOfFleshUnit),
            PrepareUnit(PinionsOfGod)
        ]
    };

    let defender: IArmy = {
        units: [
            PrepareUnit(DiggerSwarm),
            PrepareUnit(DiggerSwarm)
        ]
    };

    let config = GetDefaultConfig();

    for(let i = 0; i < simualtionCount; i++){
        let calculator = new BattleCalculator(attacker, defender, config);
        let result = calculator.execute();
        expect(result.battleResult).not.toBe(BattleResult.DefendersVictory);
        expect(result.battleResult).not.toBe(BattleResult.MutualDestruction);
    }
});