import { Box, Typography } from "@mui/material";
import { BattleContactPhase, BattleResult, BattleRole, GetBattleResultLabel, GetVictoryLabel, IBattleContext, VictoryType } from "../../model/BattleStructure";
import { ILogInstance, LogInstance } from "./GenericLogInstance";
import { RollResult } from "../../utils/DieUtilities";
import { IUnit } from "../../model/armyComposition/Unit";
import UnitHover from "../../components/UnitHover";
import { GenerateKey } from "../../utils/GenericUtilities";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { IBattleConfiguration } from "../../model/BattleConfiguration";

export class InitiativePhaseLogInstance extends LogInstance {
    protected attackersRoll: RollResult;
    protected defendersRoll: RollResult;
    protected attackersTotalBonus:number;
    protected defendersTotalBonus:number;
    constructor(context: IBattleContext, attackersRoll: RollResult, defendersRoll: RollResult) {
        super(context);
        this.attackersRoll = attackersRoll;
        this.defendersRoll = defendersRoll;
        this.attackersTotalBonus = context.currentAttackersManeuverRollBonus;
        this.defendersTotalBonus = context.currentDefendersManeuverRollBonus;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
                <Box sx={{ fontWeight: 'bold' }}>Executing initative phase:</Box>
                <Box>
                    {`Attacker's maneuver roll is ${this.attackersRoll.total}${this.attackersRoll.total != this.attackersTotalBonus ? ` and total bonus is ${this.attackersTotalBonus}` : ""}, defender's ${this.defendersRoll.total}${this.defendersRoll.total != this.defendersTotalBonus ? ` and total bonus is ${this.defendersTotalBonus}` : ""}.`}
                    </Box>
            </Box>
    }
}

export class BattlePhaseLogInstance extends LogInstance {
    protected contactPhase: BattleContactPhase;
    protected attackerNumbers: UnitBattlePhaseCalculations;
    protected defenderNumbers: UnitBattlePhaseCalculations;
    protected moraleLost: BattleRole;
    constructor(context: IBattleContext, contactPhase: BattleContactPhase, attackerNumbers: UnitBattlePhaseCalculations, defenderNumbers: UnitBattlePhaseCalculations, moraleLost: BattleRole) {
        super(context);
        this.contactPhase = contactPhase;
        this.attackerNumbers = attackerNumbers;
        this.defenderNumbers = defenderNumbers;
        this.moraleLost = moraleLost;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box><Box component="span" sx={{ fontWeight: 'bold' }}>{`Executing "${BattleContactPhase[this.contactPhase]}" phase: `}</Box></Box>
            <Box>{`Attacker's `}{this.FormatDamageLog(this.attackerNumbers, this.attacker)}</Box>
            <Box>{`Defender's `}{this.FormatDamageLog(this.defenderNumbers, this.defender)}</Box>
            <Box>{`${BattleRole[this.moraleLost]} lost morale this phase.`}</Box>
        </Box>
    }

    private FormatDamageLog(data: UnitBattlePhaseCalculations, currentUnit: IUnit): JSX.Element {
        return <Box component={"span"}>
            {`roll ${data.roll.total}, total attack ${data.totalAttack}, total damage ${data.totalDamage}. `}    
            <UnitHover unit={currentUnit}><FlashOnIcon fontSize={"inherit"}/></UnitHover>      
        </Box>
    }
}

export interface UnitBattlePhaseCalculations {
    roll: RollResult,
    totalAttack: number;
    totalDamage: number;
}

export class MoralePhaseLogInstance extends LogInstance {
    constructor(context: IBattleContext) {
        super(context);
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box sx={{ fontWeight: 'bold' }}>Executing morale phase:</Box>
            <Box>{`Attacker's current morale ${this.attacker.Morale}, defender's current morale ${this.defender.Morale}`}</Box>
        </Box>
    }
}

export class EndOfBattleLogInstance extends LogInstance {
    protected battleResult: BattleResult;
    protected victoryType: VictoryType;
    constructor(context: IBattleContext) {
        super(context);
        this.battleResult = context.battleResult;
        this.victoryType = context.victoryType;
    }

    public GetFormattedLogElement(): JSX.Element {
        return (
            <Box>
                <Box>
                    The battle ended in <Box component="span" sx={{ fontWeight: 'bold' }}>{GetBattleResultLabel(this.battleResult)}</Box>.
                    {this.victoryType != VictoryType.Undecided && <>
                        {' '}Victory was achived through <Box component="span" sx={{ fontWeight: 'bold' }}>{GetVictoryLabel(this.victoryType)}</Box>
                    </>}
                </Box>
                <Box>
                    <UnitHover unit={this.attacker}>Attacker's final stats. <FlashOnIcon fontSize={"inherit"}/></UnitHover> {' '}
                    <UnitHover unit={this.defender}>Defender's final stats. <FlashOnIcon fontSize={"inherit"}/></UnitHover>
                </Box>
            </Box>
            )
    }
}

export class StartOfBattleLogInstance extends LogInstance{
    constructor(context: IBattleContext) {
        super(context);
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
                <Box>
                    Battle started.
                </Box>
                <Box>
                    <UnitHover unit={this.attacker}>Attacker's initial stats. <FlashOnIcon fontSize={"inherit"}/></UnitHover> {' '}
                    <UnitHover unit={this.defender}>Defender's initial stats. <FlashOnIcon fontSize={"inherit"}/></UnitHover>
                </Box>
        </Box>
    }
}

export class MultiSimulationLog implements ILogInstance{
    protected key:string;
    protected config:IBattleConfiguration;
    protected attackersVictoryThroughDamageCount:number = 0;
    protected attackersVictoryThroughMoraleCount:number = 0;
    protected defendersVictoryThroughDamageCount:number = 0;
    protected defendersVictoryThroughMoraleCount:number = 0;
    protected stalemateCount:number = 0;
    protected mutualDestructionCount:number = 0;
    protected totalCount:number = 0;
    protected extraLogs:ILogInstance[] = [];

    constructor(config:IBattleConfiguration){
        this.key = GenerateKey();
        this.config = config;
    }

    public RegisterResult(context:IBattleContext){
        this.totalCount++;
        if(context.battleResult == BattleResult.AttackersVictory && context.victoryType == VictoryType.Destruction) this.attackersVictoryThroughDamageCount++;
        if(context.battleResult == BattleResult.AttackersVictory && context.victoryType == VictoryType.Morale) this.attackersVictoryThroughMoraleCount++;
        if(context.battleResult == BattleResult.DefendersVictory && context.victoryType == VictoryType.Destruction) this.defendersVictoryThroughDamageCount++;
        if(context.battleResult == BattleResult.DefendersVictory && context.victoryType == VictoryType.Morale) this.defendersVictoryThroughMoraleCount++;
        if(context.battleResult == BattleResult.MutualDestruction) this.mutualDestructionCount++;
        if(context.battleResult == BattleResult.Stalemate) this.stalemateCount++;
        if(this.config.PostSimulatedHistory) this.extraLogs = this.extraLogs.concat(context.log);
    }

    public GetKey(): string {
        return this.key;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box>Total battles: {this.totalCount}.</Box>
            <Box>Attacker's victories through damage: {this.attackersVictoryThroughDamageCount}/{Math.round(this.attackersVictoryThroughDamageCount * 100 / this.totalCount)}%.</Box>
            <Box>Attacker's victories through morale: {this.attackersVictoryThroughMoraleCount}/{Math.round(this.attackersVictoryThroughMoraleCount * 100 / this.totalCount)}%.</Box>
            <Box>Defender's victories through damage: {this.defendersVictoryThroughDamageCount}/{Math.round(this.defendersVictoryThroughDamageCount * 100 / this.totalCount)}%.</Box>
            <Box>Defender's victories through morale: {this.defendersVictoryThroughMoraleCount}/{Math.round(this.defendersVictoryThroughMoraleCount * 100 / this.totalCount)}%.</Box>
            <Box>Stalemates: {this.stalemateCount}/{Math.round(this.stalemateCount * 100 / this.totalCount)}%.</Box>
            <Box>Mutual destruction: {this.mutualDestructionCount}/{Math.round(this.mutualDestructionCount * 100 / this.totalCount)}%.</Box>
        </Box>
    }

    public GetExtraLogs(){
        return this.extraLogs;
    }
}