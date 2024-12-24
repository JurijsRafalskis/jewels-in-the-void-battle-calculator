import { IUnit } from "../model/armyComposition/Unit";
import { CreateEmptyUnit } from  "../configuration/InitialValues"
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from '../model/BattleConfiguration';
import { DieSet, DieToInt, DieType, GetMaximumDieSetValue, GetMedianDieSetValue } from "../utils/DieUtilities";
import { IArmy } from "../model/armyComposition/Army";

//Current logic:
//An army adds all fire, shock, morale and health values. It takes the highest maneuver value. It Averages Morale and Organization. 
//Morale mentioned twice, we are using the second intepretation.
export function CalculateTotalArmyStats(army:IArmy, configuration:IBattleConfiguration):IUnit{
    const armyStats = CreateEmptyUnit();
    //armyStats.Title = "Total";
    if(army.units.length == 0) return armyStats;
    armyStats.Maneuver = 0;
    army.units.forEach(u => {
        //manuever bonus only exists for generals and battle field conditions for now.
        armyStats.Maneuver = armyStats.Maneuver < u.Maneuver ? u.Maneuver : armyStats.Maneuver;
        armyStats.Morale += u.Morale;
        armyStats.Health += u.Health;
        armyStats.Organization += u.Organization;
        armyStats.FireBonus.Offensive += u.FireBonus.Offensive;
        armyStats.FireBonus.Defensive += u.FireBonus.Defensive;
        armyStats.ShockBonus.Offensive += u.ShockBonus.Offensive;
        armyStats.ShockBonus.Defensive += u.ShockBonus.Defensive;
    });
    if(configuration.MoraleCalculationMode == MoraleCalculationModeValues.Average){
        armyStats.Morale = Math.round(armyStats.Morale / army.units.length);
    }
    armyStats.Organization = Math.round(armyStats.Organization / army.units.length);

    if(army.hero){
        armyStats.Maneuver += army.hero.ManeuverRollBonus;
        armyStats.ManeuverStaticBonus += army.hero.ManeuverStaticBonus;
        armyStats.Organization += army.hero.OrganisationBonus;
        armyStats.FireBonus.Offensive += army.hero.FireBonus.Offensive;
        armyStats.FireBonus.Defensive += army.hero.FireBonus.Defensive;
        armyStats.ShockBonus.Offensive += army.hero.ShockBonus.Offensive;
        armyStats.ShockBonus.Defensive += army.hero.ShockBonus.Defensive;
    }

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