import { IArmy } from "../model/armyComposition/Army";
import { IBattleFieldModifier } from "../model/armyComposition/BattleFieldModifier";
import { Hero } from "../model/armyComposition/Hero";
import { IUnit } from "../model/armyComposition/Unit";
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from "../model/BattleConfiguration";
import { AppendKeyToUnit, PrepareUnit } from "../utils/GenericUtilities";

export const CreateEmptyUnit = function () {
    let EmptyUnit: IUnit = {
        Title: "",
        Health: 0,
        Organization: 0,
        Morale: 0,
        Maneuver: 0,
        ManeuverStaticBonus: 0,
        FireBonus: {
            Offensive: 0,
            Defensive: 0
        },
        ShockBonus: {
            Offensive: 0,
            Defensive: 0
        }
    }
    return AppendKeyToUnit(EmptyUnit);
}

export const SlayersOfFleshUnit: IUnit = {
    Title: "Slayers of Flesh",
    Health: 40,
    Organization: 90,
    Morale: 4,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    FireBonus: {
        Offensive: 1,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 2,
        Defensive: 1
    }
};

export const PinionsOfGodTest: IUnit = {
    Title: "Pinion of God (speculative)",
    Health: 20,
    Organization: 90,
    Morale: 3,
    Maneuver: 6,
    ManeuverStaticBonus: 0,
    FireBonus: {
        Offensive: 2,
        Defensive: 2
    },
    ShockBonus: {
        Offensive: 0,
        Defensive: 0
    }
};

export const DiggerSwarm: IUnit = {
    Title: "Digger Swarm",
    Health: 15,
    Organization: 80,
    Morale: 2,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 0
    }
};

export const MycellumVanguard: IUnit = {
    Title: "Mycellum Vanguard",
    Health: 20,
    Organization: 100,
    Morale: 4,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    FireBonus: {
        Offensive: 1,
        Defensive: 1
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 2
    }
};

export const InfestedMob: IUnit = {
    Title: "Infested Mob",
    Health: 40,
    Organization: 70,
    Morale: 8,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 1
    }
};

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


export function BlankHero():Hero{
    let hero = new Hero();    
    return hero;
}

export function GetHeroList():Hero[]{
    const result:Hero[] = [
        RadiantLance(),
        HundredWings()
    ];

    return result;
}

export function RadiantLance():Hero{
    const hero = new Hero();    
    hero.Title = "Radiant Lance, Cry out at Dusk";
    hero.ManeuverRollBonus = 2;
    hero.FireBonus = {
        Offensive: 6,
        Defensive: 6
    }
    return hero;
}

export function HundredWings():Hero{
    const hero = new Hero();    
    hero.Title = "Hundred Wings, Soar High in Burning Sky";
    hero.ManeuverRollBonus = 6;
    hero.FireBonus = {
        Offensive: 2,
        Defensive: 2
    }
    return hero;
}