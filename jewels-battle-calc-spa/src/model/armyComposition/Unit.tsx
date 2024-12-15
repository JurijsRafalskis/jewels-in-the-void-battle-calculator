export interface IUnit{
 Title:string;
 Health:number;
 Morale:number;
 Organisation:number;
 Maneuver:number;
 FireBonus:IBattleBonusStats;
 ShockBonus:IBattleBonusStats;
 Metadata:IAdditionalUnitMetadata;
};

export interface IBattleBonusStats{
    Offensive:number;
    Defensive:number;
}

export interface IAdditionalUnitMetadata {}
