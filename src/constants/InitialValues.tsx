import { IUnit } from "../model/armyComposition/Unit";
import { DieSelectionModeValues, IBattleConfiguration, MoraleCalculationModeValues } from "../model/BattleConfiguration";
import { DieType } from "../utils/DieUtilities";
import { AppendKeyToUnit } from "../utils/GenericUtilities";

export const CreateEmptyUnit = function () {
    let EmptyUnit: IUnit = {
        Title: "",
        Health: 0,
        Organisation: 0,
        Morale: 0,
        Maneuver: 0,
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
    Organisation: 90,
    Morale: 4,
    Maneuver: 0,
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
    Organisation: 90,
    Morale: 3,
    Maneuver: 6,
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
    Organisation: 80,
    Morale: 2,
    Maneuver: 0,
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
    Organisation: 100,
    Morale: 4,
    Maneuver: 0,
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
    Organisation: 70,
    Morale: 8,
    Maneuver: 0,
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 1
    }
};

export function GetDefaultAttackerComposition(): IUnit[] {
    return [PrepareUnit(SlayersOfFleshUnit)];
}

export function GetDefaultDefenderComposition(): IUnit[] {
    return [PrepareUnit(DiggerSwarm)];
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


export function GetDefaultConfig(): IBattleConfiguration {
    return {
        SimulatedIterationsCount: 100,
        MoraleCalculationMode: MoraleCalculationModeValues.Sum,
        PostSimulatedHistory: false,
        DieSelectionMode: DieSelectionModeValues.Median,
        AttackersBattleFieldModifiers:{
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
        },
        DefenderBattleFieldModifiers: {
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
        },
        GlobalBattlefieldModifiers: {
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
        }
    };
}

export function PrepareUnit(unit: IUnit): IUnit {
    return AppendKeyToUnit(structuredClone(unit));
}