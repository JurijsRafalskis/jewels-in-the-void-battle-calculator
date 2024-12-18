import { Box, Typography } from "@mui/material";
import { BattleContactPhase, BattleResult, BattleRole, GetBattleResultLabel, GetVictoryLabel, IBattleContext, VictoryType } from "../../model/BattleStructure";
import { ILogInstance, LogInstance } from "./GenericLogInstance";
import { RollResult } from "../../utils/DieUtilities";
import { IUnit } from "../../model/armyComposition/Unit";
import UnitHover from "../../components/UnitHover";
import { GenerateKey } from "../../utils/GenericUtilities";
import FlashOnIcon from '@mui/icons-material/FlashOn';

export class InitiativePhaseLogInstance extends LogInstance {
    protected attackersRoll: RollResult;
    protected defendersRoll: RollResult;
    constructor(context: IBattleContext, attackersRoll: RollResult, defendersRoll: RollResult) {
        super(context);
        this.attackersRoll = attackersRoll;
        this.defendersRoll = defendersRoll;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
                <Box sx={{ fontWeight: 'bold' }}>Executing initative phase:</Box>
                <Box>{`Attacker's maneuver roll is ${this.attackersRoll.total}, defender's ${this.defendersRoll.total}.`}</Box>
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

    protected attackersVictoryCount:number = 0;
    protected defendersVictoryCount:number = 0;
    protected stalemateCount:number = 0;
    protected mutualDestructionCount:number = 0;
    protected totalCount:number = 0;
    protected moraleVictoriesCount:number = 0;
    protected damageVictoriesCount:number = 0;
    protected undecidedCount:number = 0;

    constructor(){
        this.key = GenerateKey();
    }

    public RegisterResult(context:IBattleContext){
        this.totalCount++;
        if(context.battleResult == BattleResult.AttackersVictory) this.attackersVictoryCount++;
        if(context.battleResult == BattleResult.DefendersVictory) this.defendersVictoryCount++;
        if(context.battleResult == BattleResult.MutualDestruction) this.mutualDestructionCount++;
        if(context.battleResult == BattleResult.Stalemate) this.stalemateCount++;
        if(context.victoryType == VictoryType.Destruction) this.damageVictoriesCount++;
        if(context.victoryType == VictoryType.Morale) this.moraleVictoriesCount++;
        if(context.victoryType == VictoryType.Undecided) this.undecidedCount++;
    }

    public GetKey(): string {
        return this.key;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box>Total battles: {this.totalCount}. Attacker's victories: {this.attackersVictoryCount}. Defender's victories: {this.defendersVictoryCount}. Stalemates: {this.stalemateCount}. Mutual destruction: {this.mutualDestructionCount}.</Box>
            <Box>Victories through damage: {this.damageVictoriesCount}. Victories through morale: {this.moraleVictoriesCount}. Undecided battles: {this.undecidedCount}.</Box>
        </Box>
    }
}