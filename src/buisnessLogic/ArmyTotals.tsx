import { IUnit } from "../model/armyComposition/Unit";
import { CreateEmptyUnit } from  "../constants/InitialValues"
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from '../model/BattleConfiguration';
import { DieSet, DieToInt, DieTypes, GetMaximumDieSetValue, GetMedianDieSetValue } from "../utils/DieUtilities";

//Current logic:
//An army adds all fire, shock, morale and health values. It takes the highest maneuver value. It Averages Morale and Organization. 
//Morale mentioned twice, we are using the second intepretation.
export function CalculateTotalArmyStats(units:IUnit[], configuration:IBattleConfiguration):IUnit{
    const armyStats = CreateEmptyUnit();
    //armyStats.Title = "Total";
    if(units.length == 0) return armyStats;
    armyStats.Maneuver = {dieCount:0, dieType: DieTypes.None};
    units.forEach(u => {
        armyStats.Maneuver = DieSelector(configuration, armyStats.Maneuver, u.Maneuver);
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


function DieSelector(configuration:IBattleConfiguration, a:DieSet, b:DieSet):DieSet{
    if(configuration.DieSelectionMode == DieSelectionModeValues.Median){
        return GetMedianDieSetValue(a) < GetMedianDieSetValue(b) ? b : a;
    }
    else if(configuration.DieSelectionMode == DieSelectionModeValues.Max){
        return GetMaximumDieSetValue(a) < GetMaximumDieSetValue(b) ? b : a;
    }
    //Fallback to median.
    return GetMedianDieSetValue(a) < GetMedianDieSetValue(b) ? b : a;
}