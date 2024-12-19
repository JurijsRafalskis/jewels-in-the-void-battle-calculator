import { DieSet as DiceSet } from "../../utils/DieUtilities";

export interface IUnit extends IDamageBonusStats {
    Title: string;
    Health: number;
    Morale: number;
    Organisation: number;
    Maneuver: DiceSet;
    Metadata?: IAdditionalUnitMetadata;
};

export interface IDamageBonusStats {
    FireBonus: IBattleBonusStats;
    ShockBonus: IBattleBonusStats;
}

export interface IBattleBonusStats {
    Offensive: number;
    Defensive: number;
}

export interface IAdditionalUnitMetadata { 
    Key?:string;
}
