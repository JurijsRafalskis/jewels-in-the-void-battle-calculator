import { IUnit } from "../model/armyComposition/Unit";
import { AppendKeyToUnit } from "../utils/GenericUtilities";

export const CreateEmptyUnit = function () {
    let EmptyUnit: IUnit = {
        Title: "",
        Health: 0,
        Organization: 0,
        Morale: 0,
        Maneuver: 0,
        ManeuverStaticBonus: 0,
        Traits:[],
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
    Traits:[],
    FireBonus: {
        Offensive: 1,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 2,
        Defensive: 1
    }
};

export const PinionsOfGod: IUnit = {
    Title: "Pinions of God",
    Health: 10,
    Organization: 90,
    Morale: 3,
    Maneuver: 6,
    ManeuverStaticBonus: 0,
    Traits:[],
    FireBonus: {
        Offensive: 2,
        Defensive: 1
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 0
    }
};

export const CantusGuardians: IUnit = {
    Title: "Cantus Guardians",
    Health: 15,
    Organization: 80,
    Morale: 3,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    Traits:[],
    FireBonus: {
        Offensive: 0,
        Defensive: 1
    },
    ShockBonus: {
        Offensive: 0,
        Defensive: 1
    }
};

export const DiggerSwarm: IUnit = {
    Title: "Digger Swarm",
    Health: 15,
    Organization: 80,
    Morale: 2,
    Maneuver: 0,
    ManeuverStaticBonus: 0,
    Traits:[],
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
    Traits:[],
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
    Traits:[],
    FireBonus: {
        Offensive: 0,
        Defensive: 0
    },
    ShockBonus: {
        Offensive: 1,
        Defensive: 1
    }
};

export const GaswaspFlight: IUnit = {
    Title: "Gaswasp Flight",
    Health: 15,
    Organization: 100,
    Morale: 5,
    Maneuver: 4,
    ManeuverStaticBonus: 0,
    Traits:[],
    FireBonus: {
        Offensive: 0,
        Defensive: 1
    },
    ShockBonus: {
        Offensive: 0,
        Defensive: 2
    }
};