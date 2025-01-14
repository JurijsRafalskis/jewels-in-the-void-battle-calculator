import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Dialog, TextField, Tooltip } from "@mui/material"
import { IBattleFieldModifier } from "../model/armyComposition/BattleFieldModifier";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GetDefaultBattleFieldModifier } from "../configuration/InitialValues";
import { UncontrolledLimitedIntegerNumberField } from "./ControlledIntegerNumberField";
import "../styles/ComponentStyles/StatsCardTables.css";



export interface IBattleFieldModifierViewProps {
    modifier: IBattleFieldModifier;
}

interface IBattleFieldModifierAccordeonExtensionProps {
    accordeonTitle: string;
    onSave?(modifier: IBattleFieldModifier): void;
}

export function BattleFieldModifierAccordionView(props: IBattleFieldModifierViewProps & IBattleFieldModifierAccordeonExtensionProps) {
    const [editFormOpen, setEditFormOpen] = useState(false);
    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
        >
            {props.accordeonTitle}
        </AccordionSummary>
        <AccordionDetails>
            <BattleFieldModifierTableContent {...props} />
        </AccordionDetails>
        {props.onSave && <AccordionActions>
            <Button size="small" onClick={() => setEditFormOpen(true)}>
                Edit
            </Button>
            <Dialog open={editFormOpen}>
                <BattleFieldModifierEditor
                    modifier={props.modifier}
                    onSave={(modifier: IBattleFieldModifier) => { setEditFormOpen(false); props.onSave && props.onSave(modifier); }}
                    onClose={() => setEditFormOpen(false)}
                />
            </Dialog>
            <Button size="small" onClick={() => props.onSave && props.onSave(GetDefaultBattleFieldModifier())}>
                Reset
            </Button>
        </AccordionActions>}
    </Accordion>
}

export interface IBattleFieldModifierTableRendering {
    shouldRenderWrapperTable?: boolean;
}

export function BattleFieldModifierTableContent({ shouldRenderWrapperTable = true, ...props }: IBattleFieldModifierViewProps & IBattleFieldModifierTableRendering) {
    const tableContent = (<>
        
        <tr>
            <td>Organisation: </td>
            <td>{props.modifier.OrganisationBonus}</td>
        </tr>
        <tr>
            <td>Manuever: </td>
            <td>
                <Tooltip title="Die/Static">
                    <Box component={"span"}>
                        {props.modifier.ManeuverRollBonus}/{props.modifier.ManeuverStaticBonus}
                    </Box>
                </Tooltip>
            </td>
        </tr>
        <tr>
            <td>Health: </td>
            <td>{props.modifier.HealthBonus}</td>
        </tr>
        <tr>
            <td>Damage:</td>
            <td>
                <Tooltip title="Offensive fire/Defensive fire/Offensive shock/Defensive shock">
                    <Box component={"span"}>
                        {props.modifier.FireBonus.Offensive}/{props.modifier.FireBonus.Defensive}/{props.modifier.ShockBonus.Offensive}/{props.modifier.ShockBonus.Defensive}
                    </Box>
                </Tooltip>
            </td>
        </tr></>
    );
    return <>
        {shouldRenderWrapperTable ?
            <table className="statsCardTable">
                <tbody>
                    {tableContent}
                </tbody>
            </table>
            :
            tableContent}
    </>;
}

export interface IBattleFieldModifierEditorProps {
    modifier: IBattleFieldModifier;
    onSave(modifier: IBattleFieldModifier): void;
    onClose(): void;
}

export function BattleFieldModifierEditor(props: IBattleFieldModifierEditorProps) {
    const [curentModifier, setCurrentModifier] = useState(structuredClone(props.modifier))

    return <Card variant="outlined">
        <CardContent>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Organization"
                                defaultValue={curentModifier.OrganisationBonus}
                                onChange={v => setCurrentModifier(u => { return { ...u, OrganisationBonus: v }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Maneuver die"
                                defaultValue={curentModifier.ManeuverRollBonus}
                                onChange={v => setCurrentModifier(u => { return { ...u, ManeuverRollBonus: v }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Maneuver static"
                                defaultValue={curentModifier.ManeuverStaticBonus}
                                onChange={v => setCurrentModifier(u => { return { ...u, ManeuverStaticBonus: v }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Health"
                                defaultValue={curentModifier.HealthBonus}
                                onChange={v => setCurrentModifier(u => { return { ...u, HealthBonus: v }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Offensive fire"
                                defaultValue={curentModifier.FireBonus.Offensive}
                                onChange={v => setCurrentModifier(u => { return { ...u, FireBonus: { ...u.FireBonus, Offensive: v } }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Defensive fire"
                                defaultValue={curentModifier.FireBonus.Defensive}
                                onChange={v => setCurrentModifier(u => { return { ...u, FireBonus: { ...u.FireBonus, Defensive: v } }; })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Offensive shock"
                                defaultValue={curentModifier.ShockBonus.Offensive}
                                onChange={v => setCurrentModifier(u => { return { ...u, ShockBonus: { ...u.ShockBonus, Offensive: v } }; })}
                            />

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <UncontrolledLimitedIntegerNumberField
                                label="Defensive shock"
                                defaultValue={curentModifier.ShockBonus.Defensive}
                                onChange={v => setCurrentModifier(u => { return { ...u, ShockBonus: { ...u.ShockBonus, Defensive: v } }; })}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={() => { props.onSave(curentModifier) }}>Save</Button>
            <Button size="small" onClick={() => { props.onClose() }}>Close</Button>
        </CardActions>
    </Card>
}

