import { IArmy } from "../model/armyComposition/Army";
import { IBattleFieldModifier } from "../model/armyComposition/BattleFieldModifier";
import { Hero } from "../model/armyComposition/Hero";
import { BonusDamagePhase } from "../model/armyComposition/Traits/BonusDamagePhase";
import { ITrait } from "../model/armyComposition/Traits/Trait";
import { IUnit } from "../model/armyComposition/Unit";
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from "../model/BattleConfiguration";
import { PrepareUnit } from "../utils/GenericUtilities";
import { RadiantLance, HundredWings } from "./InitialHeroValues";
import { SlayersOfFleshUnit, DiggerSwarm, PinionsOfGodTest, MycellumVanguard, InfestedMob } from "./InitialUnitValues";

export function GetDefaultAttackerComposition(): IArmy {
    return { units:[PrepareUnit(SlayersOfFleshUnit)]};
}

export function GetDefaultDefenderComposition(): IArmy {
    return { units:[PrepareUnit(DiggerSwarm)]};
}

export function GetAllExistingUnits(): IUnit[] {
    return [
        PrepareUnit(SlayersOfFleshUnit),
        PrepareUnit(PinionsOfGodTest),
        PrepareUnit(DiggerSwarm),
        PrepareUnit(MycellumVanguard),
        PrepareUnit(InfestedMob)
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
        SimulatedIterationsCount: 100,
        MoraleCalculationMode: MoraleCalculationModeValues.Sum,
        PostSimulatedHistory: false,
        DieSelectionMode: DieSelectionModeValues.Median,
        AttackersBattleFieldModifiers:GetDefaultBattleFieldModifier(),
        DefenderBattleFieldModifiers: GetDefaultBattleFieldModifier(),
        GlobalBattlefieldModifiers: GetDefaultBattleFieldModifier()
    };
}

export function GetDefaultBattleFieldModifier():IBattleFieldModifier{
    return {
        ManeuverRollBonus: 0,
        ManeuverStaticBonus: 0,
        OrganisationBonus: 0,
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
        new BonusDamagePhase()
    ];

    return result;
}