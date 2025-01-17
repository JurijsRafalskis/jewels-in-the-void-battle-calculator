import React, { useState } from 'react';
import { IUnit } from '../../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { MenuItem, TextField, TextFieldVariants } from '@mui/material';
import Button from '@mui/material/Button';
import { UncontrolledLimitedIntegerNumberField } from '../fields/ControlledIntegerNumberField';
import { CreateEmptyUnit } from '../../configuration/InitialUnitValues';

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
                                        onChange={v => {
                                            //Fixing an issue with missing currentTarget whan called within the setter...
                                            const value = v.currentTarget.value;
                                            setCurrentUnit(u => { return { ...u, Title: value } })
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Organization"
                                        defaultValue={currentUnit.Organization}
                                        min={0}
                                        onChange={v => setCurrentUnit(u => { return { ...u, Organization: v }; })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Morale"
                                        defaultValue={currentUnit.Morale}
                                        min={0}
                                        onChange={v => setCurrentUnit(u => { return { ...u, Morale: v }; })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Maneuver"
                                        defaultValue={currentUnit.Maneuver}
                                        min={0}
                                        onChange={v => setCurrentUnit(u => { return { ...u, Maneuver: v }; })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Health"
                                        defaultValue={currentUnit.Health}
                                        min={0}
                                        onChange={v => setCurrentUnit(u => { return { ...u, Health: v }; })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Offensive fire"
                                        defaultValue={currentUnit.FireBonus.Offensive}
                                        onChange={v => setCurrentUnit(u => { return { ...u, FireBonus: { ...u.FireBonus, Offensive: v } } })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Defensive fire"
                                        defaultValue={currentUnit.FireBonus.Defensive}
                                        onChange={v => setCurrentUnit(u => { return { ...u, FireBonus: { ...u.FireBonus, Defensive: v } } })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Offensive shock"
                                        defaultValue={currentUnit.ShockBonus.Offensive}
                                        onChange={v => setCurrentUnit(u => { return { ...u, ShockBonus: { ...u.ShockBonus, Offensive: v } } })}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <UncontrolledLimitedIntegerNumberField
                                        label="Offensive shock"
                                        defaultValue={currentUnit.ShockBonus.Defensive}
                                        onChange={v => setCurrentUnit(u => { return { ...u, ShockBonus: { ...u.ShockBonus, Defensive: v } } })}
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