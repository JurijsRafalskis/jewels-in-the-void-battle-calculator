import React, { useState } from 'react';
import { IUnit } from '../../model/armyComposition/Unit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import UnitEditForm from "../editors/UnitEditForm";
import Dialog from '@mui/material/Dialog';
import "../../styles/ComponentStyles/StatsCardTables.css";
import { Tooltip } from '@mui/material';
import { TraitDisplay } from '../fields/TraitPicker';

export interface IUnidCardActionsRender {
    edit?:boolean;
    remove?:boolean;
}

export interface UnitCardProps {
    unit: IUnit;
    renderActions?:IUnidCardActionsRender;
    renderTraits?:boolean;
    onChange?(unitProps: IUnit | null): void;
    backgroundColorOverride?:string;
}

export function UnitCard({renderActions = {edit:true, remove:true}, renderTraits = true, onChange = (u) => {}, ...props}:UnitCardProps) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    let primaryStyleOverride = {};
    if(props.backgroundColorOverride)
    {
        primaryStyleOverride = {backgroundColor: props.backgroundColorOverride};
    }

    return (
        <Card variant="outlined" style={primaryStyleOverride}>
            <CardContent>
                    <table className={"statsCardTable"}>
                        <tbody>
                            {!!props.unit.Title && <tr>
                                <td>Name: </td>
                                <td>{props.unit.Title}</td>
                            </tr>}
                            <tr>
                                <td>Organization: </td>
                                <td>{props.unit.Organization}</td>
                            </tr>
                            <tr>
                                <td>Morale: </td>
                                <td>{props.unit.Morale}</td>
                            </tr>
                            <tr>
                                <td>Manuever: </td>
                                {props.unit.ManeuverStaticBonus == 0 ? 
                                <td>{props.unit.Maneuver}</td>
                                : 
                                <td><Tooltip title="Die/Static"><>{props.unit.Maneuver}/{props.unit.ManeuverStaticBonus}</></Tooltip></td>
                                }
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
                            {renderTraits && props.unit.Traits && props.unit.Traits.length > 0 && <tr>
                                <td>Traits:</td>
                                <td><TraitDisplay traits={props.unit.Traits}/></td>
                            </tr>}
                        </tbody>
                    </table>
            </CardContent>
            {renderActions && <CardActions>
                {renderActions.edit && <><Button size="small" onClick={() => setEditModalOpen(true)}>Edit</Button>
                <Dialog open={editModalOpen}>
                    <UnitEditForm
                        unit={props.unit}
                        onCancel={() => setEditModalOpen(false)}
                        onSave={(newUnit: IUnit) => { setEditModalOpen(false); onChange(newUnit); }}
                    />
                </Dialog></>}
                {/*This feels like very dirty hack - to reuse same function for removal and changed values. Probably should rewrite. */}
                {renderActions.remove && <Button size="small" onClick={() => onChange(null)}>Remove</Button>}
            </CardActions>}
        </Card>
    );
}
