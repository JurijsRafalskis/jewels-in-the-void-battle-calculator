import { DieSet as DiceSet } from "../../utils/DieUtilities";
import { ITrait } from "./Traits/Trait";

export interface IUnit extends IDamageBonusStats {
    Title: string;
    Health: number;
    Morale: number;
    Organization: number;
    Maneuver: number;
    ManeuverStaticBonus : number;
    Traits:ITrait[];
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
