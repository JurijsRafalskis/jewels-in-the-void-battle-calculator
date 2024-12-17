export enum MoraleCalculationModeValues {
    Sum = 0,
    Average = 1
}

export interface IBattleConfiguration {
    SimulatedIterationsCount:number;
    MoraleCalculationMode:MoraleCalculationModeValues
}