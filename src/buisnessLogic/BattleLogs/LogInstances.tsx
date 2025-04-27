import { Box } from "@mui/material";
import { BattleContactPhase, BattleResult, BattleRole, GetBattleResultLabel, GetVictoryLabel, IBattleContext, VictoryType } from "../../model/BattleStructure";
import { LogInstance } from "./GenericLogInstance";
import { RollResult } from "../../utils/DieUtilities";
import { IUnit } from "../../model/armyComposition/Unit";
import UnitHover from "../../components/display/UnitHover";
import FlashOnIcon from '@mui/icons-material/FlashOn';

export class ManeuvrePhaseLogInstance extends LogInstance {
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
                    <UnitHover unit={this.attacker}>Attacker's final stats <FlashOnIcon fontSize={"inherit"}/></UnitHover> {' '}
                    <UnitHover unit={this.defender}>Defender's final stats <FlashOnIcon fontSize={"inherit"}/></UnitHover>
                </Box>
            </Box>
            )
    }
}

export class PreBattleConditionsLogInstance extends LogInstance{
    constructor(context: IBattleContext) {
        super(context);
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
                <Box sx={{ fontWeight: 'bold' }}>
                    Pre-battle situation.
                </Box>
                <Box>
                    <UnitHover unit={this.attacker} renderTraits={true}>Attacker's initial stats <FlashOnIcon fontSize={"inherit"}/></UnitHover> {' '}
                    <UnitHover unit={this.defender} renderTraits={true}>Defender's initial stats <FlashOnIcon fontSize={"inherit"}/></UnitHover>
                </Box>
        </Box>
    }

}

export class StartOfBattleLogInstance extends LogInstance{
    constructor(context: IBattleContext) {
        super(context);
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
                <Box sx={{ fontWeight: 'bold' }}>
                    Battle has started.
                </Box>
        </Box>
    }
}