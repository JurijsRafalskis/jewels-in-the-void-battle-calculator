import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { MenuItem, TextField, TextFieldVariants } from '@mui/material';
import { CreateEmptyUnit } from "../constants/InitialValues"
import Button from '@mui/material/Button';
import { DieType } from '../utils/DieUtilities';

const dieValues = Object.keys(DieType).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as DieType);

interface defaultProps {
    size: 'small' | 'medium',
    type: React.InputHTMLAttributes<unknown>['type'],
    margin:'dense' | 'normal' | 'none',
    variant:TextFieldVariants
}

const defaultNumberFieldProps:defaultProps = {
    size:"small",
    type:"number",
    margin:"dense",
    variant: "standard"
}

export interface UnitFormProps {
    unit?: IUnit;
    onSave(newUnitValues: IUnit): void;
    onCancel(): void;
}

function UnitEditForm(props: UnitFormProps) {
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
                                        onChange={v => { currentUnit.Title = v.currentTarget.value; setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Organization"
                                        defaultValue={currentUnit.Organisation}
                                        onChange={v => { currentUnit.Organisation = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Morale"
                                        defaultValue={currentUnit.Morale}
                                        onChange={v => { currentUnit.Morale = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Maneuver"
                                        defaultValue={currentUnit.Maneuver}
                                        onChange={v => { currentUnit.Maneuver = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Health"
                                        defaultValue={currentUnit.Health}
                                        onChange={v => { currentUnit.Health = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Offensive fire"
                                        defaultValue={currentUnit.FireBonus.Offensive}
                                        onChange={v => { currentUnit.FireBonus.Offensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Defensive fire"
                                        defaultValue={currentUnit.FireBonus.Defensive}
                                        onChange={v => { currentUnit.FireBonus.Defensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Offensive shock"
                                        defaultValue={currentUnit.ShockBonus.Offensive}
                                        onChange={v => { currentUnit.ShockBonus.Offensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        {...defaultNumberFieldProps}
                                        label="Defensive shock"
                                        defaultValue={currentUnit.ShockBonus.Defensive}
                                        onChange={v => { currentUnit.ShockBonus.Defensive = parseInt(v.currentTarget.value); setCurrentUnit(currentUnit); }}
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