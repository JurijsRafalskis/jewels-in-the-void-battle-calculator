export enum MoraleCalculationModeValues {
    Sum = 0,
    Average = 1
}

export enum DieSelectionModeValues{
    Max,
    Median
}

export interface IBattleConfiguration {
    SimulatedIterationsCount:number;
    PostSimulatedHistory:boolean;
    MoraleCalculationMode:MoraleCalculationModeValues
    DieSelectionMode:DieSelectionModeValues
}