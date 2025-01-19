import { IArmy } from "../model/armyComposition/Army";
import { IBattleConfiguration } from "../model/BattleConfiguration";
import { BattleCalculator } from "./BattleCalculator";
import { ILogInstance } from "./BattleLogs/GenericLogInstance";
import { MultiSimulationLog } from "./BattleLogs/MultiSimulationLogInstance";

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
      const additionalLogs = !configuration.PostSimulatedHistory ? [] : aggregatedLog.GetExtraLogs();
      return [aggregatedLog, ...additionalLogs];
}