import { IUnit } from "../model/armyComposition/Unit";
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from '../model/BattleConfiguration';
import { DieSet, DieToInt, DieType, GetMaximumDieSetValue, GetMedianDieSetValue } from "../utils/DieUtilities";
import { IArmy } from "../model/armyComposition/Army";
import { CreateEmptyUnit } from "../configuration/InitialUnitValues";
import { Hero } from "../model/armyComposition/Hero";
import { StringKeyedDictionary } from "../structures/Dictionaries";
import { CloneUnit } from "../utils/UnitUtils";

//Current logic:
//An army adds all fire, shock, morale and health values. It takes the highest maneuver value. It Averages Morale and Organization. 
//Morale mentioned twice, we are using the second intepretation.
export function CalculateTotalArmyStats(army:IArmy, configuration:IBattleConfiguration, setTemporaryArmyName:boolean = false):IUnit{
    const armyStats = CreateEmptyUnit();
    if(setTemporaryArmyName) {
        armyStats.Title = GenerateDescriptiveArmyName(army);
    }
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
        armyStats.Traits = [...armyStats.Traits, ...u.Traits];
    });
    if(configuration.MoraleCalculationMode == MoraleCalculationModeValues.Average){
        armyStats.Morale = Math.round(armyStats.Morale / army.units.length);
    }
    armyStats.Organization = Math.round(armyStats.Organization / army.units.length);

    if(army.hero){
        armyStats.Maneuver += army.hero.ManeuverRollBonus;
        armyStats.ManeuverStaticBonus += army.hero.ManeuverStaticBonus;
        armyStats.Organization += army.hero.OrganizationBonus;
        armyStats.FireBonus.Offensive += army.hero.FireBonus.Offensive;
        armyStats.FireBonus.Defensive += army.hero.FireBonus.Defensive;
        armyStats.ShockBonus.Offensive += army.hero.ShockBonus.Offensive;
        armyStats.ShockBonus.Defensive += army.hero.ShockBonus.Defensive;
        armyStats.Traits = [...army.hero.Traits, ...armyStats.Traits];
    }

    return armyStats;
}

export function GenerateDescriptiveArmyName(army:IArmy):string {
    if(army.hero) return "Lead by " + army.hero.Title;
    if(army.units.length == 0) return "";
    if(army.units.length == 1) return army.units[0].Title;

    let dictionary:StringKeyedDictionary<number> = {}; 
    let sortedUnits = [...army.units].sort((a,b) =>  b.Health - a.Health);
    sortedUnits.forEach(unit => {
        if(!dictionary[unit.Title]){
            dictionary[unit.Title] = 1;
        }
        else{
            dictionary[unit.Title]++;
        }
    });

    let length = Object.keys(dictionary).length;
    if(length == 1) return `${sortedUnits[0].Title} ${sortedUnits.length}x`;
    let greatestNumber = 0;
    let greatestTitle = "";

    for(let index in dictionary){
        if(dictionary[index] > greatestNumber){
            greatestNumber = dictionary[index];
            greatestTitle = index;
        }
    }

    return `${greatestTitle} ${greatestNumber}x and auxilaries.`;
}


//Health is retained, morale is restored, organization climbs up.
export function PostBattleRevitalizationOfUnit(initialValues:IUnit, currentValues:IUnit, increaseOrganization:boolean = true):IUnit{
    let result = CloneUnit(initialValues);
    result.Health = currentValues.Health;
    result.Organization = currentValues.Organization;
    if(increaseOrganization){
        if(result.Organization < 100 && result.Health / initialValues.Health > 0.25){
            result.Organization += 5;
        }
        else if(result.Organization < 125 && result.Health / initialValues.Health > 0.5){
            result.Organization += 5
        }
        //Add war turn additions here.
    }

    return result;
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