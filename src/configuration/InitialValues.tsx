import { IArmy } from "../model/armyComposition/Army";
import { IBattleFieldModifier } from "../model/armyComposition/BattleFieldModifier";
import { Hero } from "../model/armyComposition/Hero";
import { BonusDamagePhase } from "../model/armyComposition/Traits/BonusDamagePhase";
import { PreBattleOrganizationImpactPhase } from "../model/armyComposition/Traits/PreBattleOrganizationImpactPhase";
import { ITrait } from "../model/armyComposition/Traits/Trait";
import { IUnit } from "../model/armyComposition/Unit";
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues, RollMode } from "../model/BattleConfiguration";
import { PrepareUnit } from "../utils/GenericUtilities";
import { RadiantLance, HundredWings } from "./InitialHeroValues";
import { SlayersOfFleshUnit, DiggerSwarm, PinionsOfGod, MycellumVanguard, InfestedMob, GaswaspFlight, CantusGuardians } from "./InitialUnitValues";

export interface PresetConfig {
    presetTitle:string
    presetStackCreation():IArmy
}

export function GetPresetConfigs():PresetConfig[]{
    return [
        {
            presetTitle: "The Roaring Symphony",
            presetStackCreation: () => { return {
                    units: [
                        PrepareUnit({...SlayersOfFleshUnit, Organization : 100}),
                        PrepareUnit({...PinionsOfGod, Organization : 100 }),
                        PrepareUnit(CantusGuardians)
                    ]
                }
            }
        }        
    ];
}

export function GetDefaultAttackerComposition(): IArmy {
    return GetPresetConfigs()[0].presetStackCreation();
}

export function GetDefaultDefenderComposition(): IArmy {
    return { units:[
        PrepareUnit(DiggerSwarm),
        PrepareUnit(DiggerSwarm)
    ]};
}

export function GetAllExistingUnits(): IUnit[] {
    return [
        PrepareUnit(SlayersOfFleshUnit),
        PrepareUnit(PinionsOfGod),
        PrepareUnit(DiggerSwarm),
        PrepareUnit(MycellumVanguard),
        PrepareUnit(InfestedMob),
        PrepareUnit(GaswaspFlight),
        PrepareUnit(CantusGuardians)
    ];
}

export function GetAllParadaisoUnits(): IUnit[]{
    return [
        PrepareUnit(SlayersOfFleshUnit),
        PrepareUnit(PinionsOfGod),
        PrepareUnit(CantusGuardians)
    ];
}

export function GetAllFungalUnits(): IUnit[]{
    return [
        PrepareUnit(DiggerSwarm),
        PrepareUnit(MycellumVanguard),
        PrepareUnit(InfestedMob),
        PrepareUnit(GaswaspFlight)
    ];
}

export function GenerateRandomSetOfUnits(count:number = 4): IUnit[]{
    const result:IUnit[] = [];
    const existingUnits = GetAllExistingUnits();
    for(let i = 0; i < count; i++){
        let randomIndex = Math.floor(Math.random() * existingUnits.length);
        result.push(PrepareUnit(existingUnits[randomIndex]));
    }
    return result;
}


export function GetDefaultConfig(): IBattleConfiguration {
    return {
        SimulatedIterationsCount: 1000,
        MoraleCalculationMode: MoraleCalculationModeValues.Sum,
        PostSimulatedHistory: false,
        DieSelectionMode: DieSelectionModeValues.Median,
        AttackersBattleFieldModifiers:GetDefaultBattleFieldModifier(),
        DefenderBattleFieldModifiers: GetDefaultBattleFieldModifier(),
        GlobalBattlefieldModifiers: GetDefaultBattleFieldModifier(),
        AttackerRollMode: {
            DamageRollMode: RollMode.Normal,
            ManeuverRollMode: RollMode.Normal
        },
        DefenderRollMode: {
            DamageRollMode: RollMode.Normal,
            ManeuverRollMode: RollMode.Normal
        }
    };
}

export function GetDefaultBattleFieldModifier():IBattleFieldModifier{
    return {
        HealthBonus: 0,
        ManeuverRollBonus: 0,
        ManeuverStaticBonus: 0,
        OrganizationBonus: 0,
        FireBonus: {
            Defensive: 0,
            Offensive: 0
        },
        ShockBonus: {
            Defensive: 0,
            Offensive: 0
        }
    };
}

export function GetHeroList():Hero[]{
    const result:Hero[] = [
        RadiantLance(),
        HundredWings()
    ];

    return result;
}

export function GetTraitList():ITrait[]{
    const result:ITrait[] = [
        new BonusDamagePhase(),
        new PreBattleOrganizationImpactPhase()
    ];

    return result;
}