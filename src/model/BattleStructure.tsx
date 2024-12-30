import { ILogInstance, LogInstance } from "../buisnessLogic/BattleLogs/GenericLogInstance";
import { IUnit } from "./armyComposition/Unit";
import { IBattleConfiguration } from "./BattleConfiguration";

export enum BattleResult {
    InProgress,
    AttackersVictory,
    DefendersVictory,
    Stalemate,
    MutualDestruction
}

export function GetBattleResultLabel(result:BattleResult){
    //Can't really use switch with enums without a lot of additional work, using ifs.
    if(result == BattleResult.AttackersVictory) return "Attacker's victory";
    if(result == BattleResult.DefendersVictory) return "Defender's victory";
    if(result == BattleResult.Stalemate) return "Stalemate";
    if(result == BattleResult.MutualDestruction) return "Mutual destruction";
    return "Unknown";
}

export enum VictoryType{
    Undecided,
    Morale,
    Destruction
}

export function GetVictoryLabel(result:VictoryType){
    //Can't really use switch with enums without a lot of additional work, using ifs.
    if(result == VictoryType.Destruction) return "Opposition's destruction";
    if(result == VictoryType.Morale) return "Morale";
    return "Unknown";
}

export enum BattleContactPhase {
    Fire,
    Shock
}

export enum BattleRole {
    Attacker,
    Defender
}

export interface IBattleContext {
    turn:number;
    log:ILogInstance[]
    attackerCurrentState:IUnit;
    defenderCurrentState:IUnit;
    currentAttackersManeuverRollBonus:number;
    currentDefendersManeuverRollBonus:number;
    battleResult:BattleResult;
    victoryType:VictoryType;
}

export interface BattleStep {
    priority:number,
    stepFunction:(context:IBattleContext, config:IBattleConfiguration) => IBattleContext;
}