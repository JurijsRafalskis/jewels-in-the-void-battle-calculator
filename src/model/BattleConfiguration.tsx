import { IBattleFieldModifier } from "./armyComposition/BattleFieldModifier";

export enum MoraleCalculationModeValues {
    Sum = 0,
    Average = 1
}

export enum DieSelectionModeValues{
    Max,
    Median
}

export enum RollMode {
    Normal,
    Min,
    Max
}

export interface IRollingModesConfig {
    DamageRollMode: RollMode;
    ManeuverRollMode: RollMode;
}

export interface IBattleConfiguration {
    SimulatedIterationsCount:number;
    PostSimulatedHistory:boolean;
    MoraleCalculationMode:MoraleCalculationModeValues;
    DieSelectionMode:DieSelectionModeValues;
    GlobalBattlefieldModifiers:IBattleFieldModifier;
    AttackersBattleFieldModifiers:IBattleFieldModifier;
    DefenderBattleFieldModifiers:IBattleFieldModifier;
    AttackerRollMode:IRollingModesConfig;
    DefenderRollMode:IRollingModesConfig;
}