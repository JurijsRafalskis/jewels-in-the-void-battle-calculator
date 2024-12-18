import { DieSet } from "../../utils/DieUtilities";

export interface IUnit {
    Title: string;
    Health: number;
    Morale: number;
    Organisation: number;
    Maneuver: DieSet;
    FireBonus: IBattleBonusStats;
    ShockBonus: IBattleBonusStats;
    Metadata?: IAdditionalUnitMetadata;
};

export interface IBattleBonusStats {
    Offensive: number;
    Defensive: number;
}

export interface IAdditionalUnitMetadata { 
    Key?:string;
}
