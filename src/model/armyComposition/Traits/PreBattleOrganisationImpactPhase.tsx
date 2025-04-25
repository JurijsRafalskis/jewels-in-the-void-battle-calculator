import { ReactElement, useState } from "react";
import { BattleCalculator } from "../../../buisnessLogic/BattleCalculator";
import { IBattleContext, BattleRole } from "../../BattleStructure";
import { ITrait } from "./Trait";
import { GenerateKey } from "../../../utils/GenericUtilities";
import { LogInstance } from "../../../buisnessLogic/BattleLogs/GenericLogInstance";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Tooltip, Typography } from "@mui/material";
import UnitHover from "../../../components/display/UnitHover";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { UncontrolledLimitedIntegerNumberField } from "../../../components/fields/ControlledIntegerNumberField";
import { TextField } from '@mui/material';

const traitTitle = "Pre-battle Organisation impact";

interface PreBattleOrganisationImpactPhaseRelevantValues {
    TraitIdentifier: string;
    OrganisationImpact: number;
    MaximumApplications: number;
    AppliesToSelf: boolean;
    AppliesToOpponent: boolean;
}

export class PreBattleOrganisationImpactPhase implements ITrait, PreBattleOrganisationImpactPhaseRelevantValues {
    Title: string = traitTitle;
    TraitIdentifier: string = "Cantus of Defiance";
    #key: string = GenerateKey();
    OrganisationImpact: number = -5;
    MaximumApplications: number = 2;
    AppliesToSelf: boolean = false;
    AppliesToOpponent: boolean = true;

    constructor() { }

    createEditForm(onChange: (v: ITrait) => void, onClose: () => void): ReactElement {
        return <BonusDamagePhaseEditor
            TraitIdentifier={this.TraitIdentifier}
            OrganisationImpact={this.OrganisationImpact}
            MaximumApplications={this.MaximumApplications}
            AppliesToSelf={this.AppliesToSelf}
            AppliesToOpponent={this.AppliesToOpponent}
            onClose={onClose}
            onSave={(traitValues) => {
                //recreating the object to ensure that react rerenders everything correctly... Might be unneccessary, and is definetely unwieldy for bigger traits.
                var result = new PreBattleOrganisationImpactPhase();
                onChange(Object.assign(result, traitValues));
            }}
        />
    }
    createTooltip(): ReactElement {
        return <>{this.OrganisationImpact > 0 ? "Increases " : "Reduces "}{this.AppliesToSelf && "own"}{this.AppliesToSelf && this.AppliesToOpponent ? " and " : ""}{this.AppliesToOpponent && "opponent's"} Organisation by {this.OrganisationImpact} up until maximum of {this.OrganisationImpact * this.MaximumApplications}</>
    }
    registerBattleModifications(calculator: BattleCalculator, context: IBattleContext, role: BattleRole): void {
        const metadataKey = this.getMetadataKey();
        let metadataValue = context.metadata[metadataKey]
        if (isNaN(metadataValue)) {
            metadataValue = 1;
        }
        else {
            metadataValue++;
        }
        if (metadataValue > this.MaximumApplications) {
            return;
        }

        if (this.AppliesToSelf) {
            if (role == BattleRole.Attacker) {
                context.attackerCurrentState.Organization += this.OrganisationImpact;
                context.log.push(new PreBattleOrganisationStepLogs(context, BattleRole.Attacker, this));
            }
            else {
                context.defenderCurrentState.Organization += this.OrganisationImpact;
                context.log.push(new PreBattleOrganisationStepLogs(context, BattleRole.Defender, this));
            }
        }

        if (this.AppliesToOpponent) {
            if (role == BattleRole.Attacker) {
                context.defenderCurrentState.Organization += this.OrganisationImpact;
                context.log.push(new PreBattleOrganisationStepLogs(context, BattleRole.Defender, this));
            }
            else {
                context.attackerCurrentState.Organization += this.OrganisationImpact;
                context.log.push(new PreBattleOrganisationStepLogs(context, BattleRole.Attacker, this));
            }
        }

        context.metadata[metadataKey] = metadataValue;
    }

    getMetadataKey(): string {
        return `PreBattleOrganisationApplianceCount_${this.TraitIdentifier}`;
    }

    clone(): ITrait {
        var result = new PreBattleOrganisationImpactPhase();
        return Object.assign(result, this);
    }
    getKey(): string {
        return this.#key;
    }
}

interface PreBattleOrganisationEditorProps extends PreBattleOrganisationImpactPhaseRelevantValues {
    onSave: (v: PreBattleOrganisationImpactPhaseRelevantValues) => void;
    onClose: () => void
}

function BonusDamagePhaseEditor({ TraitIdentifier = "", OrganisationImpact = -5, MaximumApplications = 2, AppliesToSelf = false, AppliesToOpponent = true, ...props }: PreBattleOrganisationEditorProps) {
    const [currentTraitIdentifier, setCurrentTraitIdentifier] = useState(TraitIdentifier);
    const [currentOrganisationImpact, setOrganisationImpact] = useState(OrganisationImpact);
    const [currentMaximumApplications, setMaximumApplications] = useState(MaximumApplications);
    const [currentAppliesToSelf, setCurrentAppliesToSelf] = useState(AppliesToSelf);
    const [currentAppliesToOpponent, setCurrentAppliesToOpponent] = useState(AppliesToOpponent);
    return <>
        <Card>
            <CardHeader>
                <Typography variant="h6">{traitTitle}</Typography>
            </CardHeader>
            <CardContent>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextField
                                        size="small"
                                        margin="dense"
                                        label="Identifier"
                                        variant="standard"
                                        defaultValue={currentTraitIdentifier}
                                        onChange={v => {
                                            //Fixing an issue with missing currentTarget whan called within the setter...
                                            const value = v.currentTarget.value;
                                            setCurrentTraitIdentifier(value);
                                        }}
                                    />
                                    <Tooltip title="Maximum applications are checked using this value"><Box component="span">*</Box></Tooltip>
                            </td>
                        </tr>
                        <tr>
                            <td><UncontrolledLimitedIntegerNumberField
                                label="Organisation Impact"
                                defaultValue={currentOrganisationImpact}
                                onChange={newPriority => setOrganisationImpact(newPriority)}
                            /></td>
                        </tr>
                        <tr>
                            <td><UncontrolledLimitedIntegerNumberField
                                label="Maximum applications"
                                defaultValue={currentMaximumApplications}
                                min={1}
                                onChange={newPriority => setMaximumApplications(newPriority)}
                            /></td>
                        </tr>
                        <tr>
                            <td>Applies to:</td>
                        </tr>
                        <tr>
                            <td>
                                <FormControlLabel control={<Checkbox
                                    defaultChecked={currentAppliesToSelf}
                                    onChange={(ev) => setCurrentAppliesToSelf(ev.target.checked)}
                                />} label="Self" />
                            </td>
                            <td>
                                <FormControlLabel control={<Checkbox
                                    defaultChecked={currentAppliesToOpponent}
                                    onChange={(ev) => setCurrentAppliesToOpponent(ev.target.checked)}
                                />} label="Opposition" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    const newTrait = new PreBattleOrganisationImpactPhase();
                    newTrait.TraitIdentifier = currentTraitIdentifier;
                    newTrait.OrganisationImpact = currentOrganisationImpact;
                    newTrait.MaximumApplications = currentMaximumApplications;
                    newTrait.AppliesToSelf = currentAppliesToSelf;
                    newTrait.AppliesToOpponent = currentAppliesToOpponent;
                    props.onSave(newTrait);
                }}>Save</Button>
                <Button size="small" onClick={() => { props.onClose() }}>Close</Button>
            </CardActions>
        </Card>
    </>
}

export class PreBattleOrganisationStepLogs extends LogInstance {
    #role: BattleRole
    #step: PreBattleOrganisationImpactPhase;
    constructor(context: IBattleContext, role: BattleRole, step: PreBattleOrganisationImpactPhase) {
        super(context);
        this.#role = role;
        this.#step = step;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
            <Box><Box component="span" sx={{ fontWeight: 'bold' }}>{`Pre battle Organisation impact caused by "${this.#step.TraitIdentifier}":`}</Box></Box>
            <Box>
                <Box>
                    <Box component="span">{BattleRole[this.#role]} organisation has been impacted by {this.#step.OrganisationImpact}.</Box>
                    <UnitHover unit={this.#role == BattleRole.Attacker ? this.attacker : this.defender}><FlashOnIcon fontSize={"inherit"} /></UnitHover>
                </Box>
            </Box>
        </Box>
    }
}