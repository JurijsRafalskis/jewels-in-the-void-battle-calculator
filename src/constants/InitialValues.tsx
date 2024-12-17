import { IUnit } from "../model/armyComposition/Unit";
import { IBattleConfiguration, MoraleCalculationModeValues } from "../model/BattleConfiguration";

export const CreateEmptyUnit = function(){
    const EmptyUnit: IUnit = {
        Title:"",
        Health: 0,
        Organisation: 0,
        Morale:0,
        Maneuver:0,
        FireBonus: {
            Offensive: 0,
            Defensive: 0
        },
        ShockBonus:{
            Offensive: 0,
            Defensive: 0
        }
    }
    return EmptyUnit;
}

export const SlayersOfFleshUnit: IUnit = {
    Title:"Slayers of Flesh",
    Health: 40,
    Organisation: 90,
    Morale:4,
    Maneuver:0,
    FireBonus: {
        Offensive: 1,
        Defensive: 0
    },
    ShockBonus:{
        Offensive: 2,
        Defensive: 1
    }
};

export const DiggerSwarm: IUnit = {
    Title:"Digger Swarm",
    Health: 15,
    Organisation: 80,
    Morale:2,
    Maneuver:0,
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus:{
        Offensive: 1,
        Defensive: 0
    }
};

export const MycellumVanguard: IUnit = {
    Title:"Mycellum Vanguard",
    Health: 20,
    Organisation: 100,
    Morale:4,
    Maneuver:0,
    FireBonus: {
        Offensive: 1,
        Defensive: 1
    },
    ShockBonus:{
        Offensive: 1,
        Defensive: 2
    }
};

export const InfestedMob: IUnit = {
    Title:"Infested Mob",
    Health: 40,
    Organisation: 70,
    Morale:8,
    Maneuver:0,
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus:{
        Offensive: 1,
        Defensive: 1
    }
};

export function GetDefaultAttackerComposition(): IUnit[] {
    return [structuredClone(SlayersOfFleshUnit)];
}

export function GetDefaultDefenderComposition() : IUnit[]{
    return[structuredClone(DiggerSwarm)];
}

export function GetAllExistingUnits(): IUnit[]{
    return [
        structuredClone(SlayersOfFleshUnit),
        structuredClone(DiggerSwarm),
        structuredClone(MycellumVanguard),
        structuredClone(InfestedMob)
    ];
}

    
export function GetDefaultConfig() : IBattleConfiguration {
    return {
        SimulatedIterationsCount : 100,
        MoraleCalculationMode : MoraleCalculationModeValues.Sum
    };
}