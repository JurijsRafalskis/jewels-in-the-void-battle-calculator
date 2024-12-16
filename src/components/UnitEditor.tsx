import React from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';


export interface UnitEditorProps {
    unit: IUnit;
    onChange(unitProps: IUnit): void;
}

export class UnitEditor extends React.Component<UnitEditorProps> {
    render() {
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
                                            value={this.props.unit.Title}
                                            onChange={
                                                (v) =>{
                                                    let newUnit = this.props.unit;
                                                    newUnit.Title = v.target.value;
                                                    this.props.onChange(newUnit);
                                                }
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            type="number"
                                            /*slotProps={{input:{ type: 'number'}}}*/
                                            margin="dense"
                                            label="Organization"
                                            variant="standard"
                                            value={this.props.unit.Health}
                                            onChange={()=>{}}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Morale"
                                            variant="standard"
                                            value={this.props.unit.Morale}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Manuever"
                                            variant="standard"
                                            value={this.props.unit.Maneuver}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Health"
                                            variant="standard"
                                            value={this.props.unit.Health}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Offensive fire"
                                            variant="standard"
                                            value={this.props.unit.FireBonus.Offensive}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextField
                                            size="small"
                                            margin="dense"
                                            label="Defensive fire"
                                            variant="standard"
                                            value={this.props.unit.FireBonus.Defensive}
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
                                            value={this.props.unit.ShockBonus.Offensive}
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
                                            value={this.props.unit.ShockBonus.Defensive}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        );
    }
}