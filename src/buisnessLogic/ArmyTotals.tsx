import { IUnit } from "../model/armyComposition/Unit";
import { CreateEmptyUnit } from  "../constants/InitialValues"
import { IBattleConfiguration, MoraleCalculationModeValues } from '../model/BattleConfiguration';

//Current logic:
//An army adds all fire, shock, morale and health values. It takes the highest maneuver value. It Averages Morale and Organization. 
//Morale mentioned twice, we are using the second intepretation.
export function CalculateTotalArmyStats(units:IUnit[], configuration:IBattleConfiguration):IUnit{
    const armyStats = CreateEmptyUnit();
    armyStats.Title = "Total";
    if(units.length == 0) return armyStats;
    armyStats.Maneuver = Number.MIN_SAFE_INTEGER;
    units.forEach(u => {
        armyStats.Maneuver = armyStats.Maneuver < u.Maneuver ? u.Maneuver : armyStats.Maneuver;
        armyStats.Morale += u.Morale;
        armyStats.Health += u.Health;
        armyStats.Organisation += u.Organisation;
        armyStats.FireBonus.Offensive += u.FireBonus.Offensive;
        armyStats.FireBonus.Defensive += u.FireBonus.Defensive;
        armyStats.ShockBonus.Offensive += u.ShockBonus.Offensive;
        armyStats.ShockBonus.Defensive += u.ShockBonus.Defensive;
    });
    if(configuration.MoraleCalculationMode == MoraleCalculationModeValues.Average){
        armyStats.Morale = Math.round(armyStats.Morale / units.length);
    }
    armyStats.Organisation = Math.round(armyStats.Organisation / units.length);
    return armyStats;
}