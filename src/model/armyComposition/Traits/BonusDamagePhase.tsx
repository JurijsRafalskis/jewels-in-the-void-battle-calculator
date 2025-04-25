import { ReactElement, useState } from "react";
import { ITrait } from "./Trait";
import { GenerateKey } from "../../../utils/GenericUtilities";
import { DieSet, DieType, FormatDiesForReading, Roll, RollResult } from "../../../utils/DieUtilities";
import { BattleCalculator } from "../../../buisnessLogic/BattleCalculator";
import { IBattleContext, BattleRole } from "../../BattleStructure";
import { LogInstance } from "../../../buisnessLogic/BattleLogs/GenericLogInstance";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from "@mui/material";
import UnitHover from "../../../components/display/UnitHover";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { UncontrolledLimitedIntegerNumberField } from "../../../components/fields/ControlledIntegerNumberField";
import { MultiDieField } from "../../../components/fields/DieField";

const traitTitle = "Bonus damage phase";

interface BonusDamagePhaseRelevantValues {
    Repeatable: boolean;
    Priority: number;
    Damage: DieSet[];
}

export class BonusDamagePhase implements ITrait, BonusDamagePhaseRelevantValues {
    //Maybe modift constructor to accept efaul values easier?
    Title: string = traitTitle;
    #key: string = GenerateKey();
    Repeatable: boolean = false;
    Priority: number = 150;
    Damage: DieSet[] = [
        {
            diceCount: 4,
            dieType: DieType.None
        }
        ,
        {
            diceCount: 1,
            dieType: DieType.d4
        }
    ];

    constructor() { }

    registerBattleModifications(calculator: BattleCalculator, context: IBattleContext, role: BattleRole): void {
        calculator.registerExtraStep({
            priority: this.Priority,
            stepFunction: (context, config) => {
                if (!this.Repeatable && context.turn > 1) return context;
                const damageReceiver = role == BattleRole.Attacker ? context.defenderCurrentState : context.attackerCurrentState;
                let damageRoll = Roll(this.Damage);
                damageReceiver.Health = Math.max(damageReceiver.Health - damageRoll.total, 0);
                context.log.push(new ExtraDamageTurnLogs(context, role, damageRoll));
                return context;
            }
        })
    }

    createEditForm(onChange: (v: ITrait) => void, onClose: () => void): ReactElement {
        return <BonusDamagePhaseEditor
            Damage={this.Damage}
            Priority={this.Priority}
            Repeatable={this.Repeatable}
            onClose={onClose}
            onSave={(traitValues) => {
                //recreating the object to ensure that react rerenders everything correctly... Might be unneccessary, and is definetely unwieldy for bigger traits.
                var result = new BonusDamagePhase();
                onChange(Object.assign(result, traitValues));
            }}
        />
    }

    clone():BonusDamagePhase {
        var result = new BonusDamagePhase();
        return Object.assign(result, this);
    }

    createTooltip(): ReactElement {
        return <>Deals {this.Repeatable && "repeatable"} {FormatDiesForReading(this.Damage)} direct damage to opponent with priority {this.Priority}.</>
    }
    getKey(): string {
        return this.#key;
    }
}

interface BonusDamagePhaseEditorProps extends BonusDamagePhaseRelevantValues {
    onSave: (v: BonusDamagePhaseRelevantValues) => void;
    onClose: () => void
}

function BonusDamagePhaseEditor({ Repeatable  = false, Priority = 150, Damage = [], ...props }: BonusDamagePhaseEditorProps) {
    const [currentPriority, setCurrentPriority] = useState(Priority);
    const [currentRepeatability, setCurrentRepeatability] = useState(Repeatable);
    const [currentDamage, setCurrentDamage] = useState(Damage);
    return <>
        <Card>
            <CardHeader>
                <Typography variant="h6">{traitTitle}</Typography>
            </CardHeader>
            <CardContent>
                <table>
                    <tbody>
                        <tr>
                            <td><UncontrolledLimitedIntegerNumberField
                                label="Priority"
                                defaultValue={currentPriority}
                                onChange={newPriority => setCurrentPriority(newPriority)}
                            /></td>
                            <td>
                                <FormControlLabel control={<Checkbox
                                    defaultChecked={currentRepeatability}
                                    onChange={(ev) => setCurrentRepeatability(ev.target.checked)}
                                />} label="Repeatable" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Damage:
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <MultiDieField
                                    fieldLabel="Damage"
                                    dieSets={currentDamage}
                                    onChange={dieSets => setCurrentDamage(dieSets)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    const newTrait = new BonusDamagePhase();
                    newTrait.Damage = currentDamage;
                    newTrait.Priority = currentPriority;
                    newTrait.Repeatable = currentRepeatability;
                    props.onSave(newTrait);
                }}>Save</Button>
                <Button size="small" onClick={() => { props.onClose() }}>Close</Button>
            </CardActions>
        </Card>
    </>
}

export class ExtraDamageTurnLogs extends LogInstance {
    #role: BattleRole
    #result: RollResult;
    constructor(context: IBattleContext, role: BattleRole, result: RollResult) {
        super(context);
        this.#role = role;
        this.#result = result;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box><Box component="span" sx={{ fontWeight: 'bold' }}>{`Executing bonus damage phase:`}</Box></Box>
            <Box>
                <Box component="span">{`${BattleRole[this.#role]} rolled ${this.#result.total} bonus damage. ${BattleRole[this.#role == BattleRole.Attacker ? BattleRole.Defender : BattleRole.Attacker]} stats: `}</Box>
                <UnitHover unit={this.#role == BattleRole.Attacker ? this.defender : this.attacker}><FlashOnIcon fontSize={"inherit"} /></UnitHover>
            </Box>
        </Box>
    }
}