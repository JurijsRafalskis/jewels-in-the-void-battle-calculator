import { IUnit } from "../model/armyComposition/Unit";
import { IBattleConfiguration } from "../model/BattleConfiguration";

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
}

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
}

export const DefaultAttackerComposition : IUnit[] = [
    SlayersOfFleshUnit
]

export const DefaultDefenderComposition : IUnit[] = [
    DiggerSwarm
]

export const DefaultConfig : IBattleConfiguration = {
    SimulatedItterationsCount : 100
}