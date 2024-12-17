import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { TextField } from '@mui/material';
import { CreateEmptyUnit } from "../constants/InitialValues"
import Button from '@mui/material/Button';

export interface UnitFormProps {
    unit?: IUnit;
    onSave(newUnitValues: IUnit): void;
    onCancel(): void;
}

function UnitEditForm(props:UnitFormProps) {
        const [currentUnit, setCurrentUnit] = useState(props.unit ? structuredClone(props.unit) : CreateEmptyUnit()); //TODO - Deep copy?
        return (
            <Card variant="outlined">
                <CardContent>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Name"
                                            variant="standard"
                                            defaultValue={currentUnit.Title}
                                            onChange={v => {currentUnit.Title = v.currentTarget.value; setCurrentUnit(currentUnit)}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            type="number"
                                            margin="dense"
                                            label="Organization"
                                            variant="standard"
                                            defaultValue={currentUnit.Health}
                                            onChange={v => {currentUnit.Health = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            type="number"
                                            margin="dense"
                                            label="Morale"
                                            variant="standard"
                                            defaultValue={currentUnit.Morale}
                                            onChange={v => {currentUnit.Morale = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
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
                                            defaultValue={currentUnit.Maneuver}
                                            onChange={v => {currentUnit.Maneuver = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            type="number"
                                            margin="dense"
                                            label="Health"
                                            variant="standard"
                                            defaultValue={currentUnit.Health}
                                            onChange={v => {currentUnit.Health = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
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
                                            defaultValue={currentUnit.FireBonus.Offensive}
                                            onChange={v => {currentUnit.FireBonus.Offensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
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
                                            defaultValue={currentUnit.FireBonus.Defensive}
                                            onChange={v => {currentUnit.FireBonus.Defensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
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
                                            defaultValue={currentUnit.ShockBonus.Offensive}
                                            onChange={v => {currentUnit.ShockBonus.Offensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
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
                                            defaultValue={currentUnit.ShockBonus.Defensive}
                                            onChange={v => {currentUnit.ShockBonus.Defensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit)}}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => props.onSave(currentUnit)}>Save</Button>
                    <Button size="small" onClick={props.onCancel}>Close</Button>
                </CardActions>
            </Card>
        );
}

export default UnitEditForm;