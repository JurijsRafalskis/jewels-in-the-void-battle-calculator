import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import UnitEditForm from "./UnitEditForm";
import Dialog from '@mui/material/Dialog';

export interface UnitCardProps {
    unit: IUnit;
    renderActions?:boolean;
    onChange?(unitProps: IUnit | null): void;
}

function UnitCard( {renderActions = true, onChange = (u) => {}, ...props}:UnitCardProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    return (
        <Card variant="outlined">
            <CardContent>
                <div>
                    <table>
                        <tbody>
                            {!!props.unit.Title && <tr>
                                <td>Name: </td>
                                <td>{props.unit.Title}</td>
                            </tr>}
                            <tr>
                                <td>Organization: </td>
                                <td>{props.unit.Health}</td>
                            </tr>
                            <tr>
                                <td>Morale: </td>
                                <td>{props.unit.Morale}</td>
                            </tr>
                            <tr>
                                <td>Manuever: </td>
                                <td>{props.unit.Maneuver}</td>
                            </tr>
                            <tr>
                                <td>Health: </td>
                                <td>{props.unit.Health}</td>
                            </tr>
                            <tr>
                                <td>Fire: </td>
                                <td>{props.unit.FireBonus.Offensive}/{props.unit.FireBonus.Defensive}</td>
                            </tr>
                            <tr>
                                <td>Shock: </td>
                                <td>{props.unit.ShockBonus.Offensive}/{props.unit.ShockBonus.Defensive}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
            {renderActions && <CardActions>
                <Button size="small" onClick={() => setEditModalOpen(true)}>Edit</Button>
                <Dialog open={editModalOpen}>
                    <UnitEditForm
                        unit={props.unit}
                        onCancel={() => setEditModalOpen(false)}
                        onSave={(newUnit: IUnit) => { setEditModalOpen(false); onChange(newUnit); }}
                    />
                </Dialog>
                {/*This feels like very dirty hack - to reuse same function for removal and changed values. Probably should rewrite. */}
                <Button size="small" onClick={() => onChange(null)}>Remove</Button>
            </CardActions>}
        </Card>
    );
}

export default UnitCard;