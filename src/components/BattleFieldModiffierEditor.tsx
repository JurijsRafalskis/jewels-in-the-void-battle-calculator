import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, Dialog, TextField, Tooltip } from "@mui/material"
import { IBattleFieldModifier } from "../model/armyComposition/BattleFieldModifier";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export interface IBattleFieldModifierViewProps {
    modifier: IBattleFieldModifier;
    onSave?(modifier: IBattleFieldModifier): void;
}

interface IBattleFieldModifierAccordeonTitleProp {
    accordeonTitle:string;
}

export function BattleFieldModifierAccordionView(props: IBattleFieldModifierViewProps & IBattleFieldModifierAccordeonTitleProp) {
    const [editFormOpen, setEditFormOpen] = useState(false);
    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
            {props.accordeonTitle}
        </AccordionSummary>
        <AccordionDetails>
            <BattleFieldModifierTableContent {...props}/>
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
        </AccordionActions>}
    </Accordion>
}

function BattleFieldModifierTableContent(props: IBattleFieldModifierViewProps) {
    return <table>
    <tbody>
        <tr>
            <td>Organisation: </td>
            <td>{props.modifier.OrganisationBonus}</td>
        </tr>
        <tr>
            <td>Manuever: </td>
            <td>{props.modifier.ManeuverBonus}</td>
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
        </tr>
    </tbody>
</table>;
}

export interface IBattleFieldModifierEditorProps {
    modifier: IBattleFieldModifier;
    onSave(modifier: IBattleFieldModifier): void;
    onClose():void;
}

export function BattleFieldModifierEditor(props: IBattleFieldModifierEditorProps) {
    const [curentModifier, setCurrentModifier] = useState(structuredClone(props.modifier))

    return <Card variant="outlined">
        <CardContent>
        <table>
            <tbody>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            type="number"
                            margin="dense"
                            label="Organization"
                            variant="standard"
                            defaultValue={curentModifier.OrganisationBonus}
                            onChange={v => { curentModifier.OrganisationBonus = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            type="number"
                            margin="dense"
                            label="Maneuver"
                            variant="standard"
                            defaultValue={curentModifier.ManeuverBonus}
                            onChange={v => { curentModifier.ManeuverBonus = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            type="number"
                            margin="dense"
                            label="Offensive fire"
                            variant="standard"
                            defaultValue={curentModifier.FireBonus.Offensive}
                            onChange={v => { curentModifier.FireBonus.Offensive = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            type="number"
                            margin="dense"
                            label="Defensive fire"
                            variant="standard"
                            defaultValue={curentModifier.FireBonus.Defensive}
                            onChange={v => { curentModifier.FireBonus.Defensive = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            margin="dense"
                            label="Offensive shock"
                            variant="standard"
                            defaultValue={curentModifier.ShockBonus.Offensive}
                            onChange={v => { curentModifier.ShockBonus.Offensive = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <TextField
                            size="small"
                            margin="dense"
                            label="Defensive shock"
                            variant="standard"
                            defaultValue={curentModifier.ShockBonus.Defensive}
                            onChange={v => { curentModifier.ShockBonus.Defensive = parseInt(v.currentTarget.value); setCurrentModifier(curentModifier); }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={()=>{props.onSave(curentModifier)}}>Save</Button>
            <Button size="small" onClick={()=>{props.onClose()}}>Close</Button>
        </CardActions>
    </Card>
}

