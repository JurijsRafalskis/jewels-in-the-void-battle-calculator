import { expect, test } from 'vitest'
import { BattleCalculator } from '../buisnessLogic/BattleCalculator'
import { DiggerSwarm, SlayersOfFleshUnit } from '../configuration/InitialUnitValues';
import { IArmy } from '../model/armyComposition/Army';
import { PrepareUnit } from '../utils/GenericUtilities';
import { GetDefaultConfig } from '../configuration/InitialValues'
import { BattleResult } from '../model/BattleStructure';

test("Tests mathematical impossibility of default Slayers losing to default Swarm.", () => {
    let attacker: IArmy = {
        units: [PrepareUnit(SlayersOfFleshUnit)]
    };

    let defender: IArmy = {
        units: [PrepareUnit(DiggerSwarm)]
    };

    let config = GetDefaultConfig();

    for(let i = 0; i < 1000; i++){
        let calculator = new BattleCalculator(attacker, defender, config);
        let result = calculator.execute();
        expect(result.battleResult).not.toBe(BattleResult.DefendersVictory);
        expect(result.battleResult).not.toBe(BattleResult.MutualDestruction);
    }
});