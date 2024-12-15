import React from 'react';
import { IUnit } from '../model/armyComposition/Unit';


export interface UnitEditorProps {
    unit: IUnit;
    onChange(unitProps: IUnit): void;
}

export class UnitEditor extends React.Component<UnitEditorProps> {
    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{this.props.unit.Title}</td>
                        </tr>
                        <tr>
                            <td>Organization: </td>
                            <td>{this.props.unit.Health}</td>
                        </tr>
                        <tr>
                            <td>Morale: </td>
                            <td>{this.props.unit.Morale}</td>
                        </tr>
                        <tr>
                            <td>Manuever: </td>
                            <td>{this.props.unit.Maneuver}</td>
                        </tr>
                        <tr>
                            <td>Health: </td>
                            <td>{this.props.unit.Health}</td>
                        </tr>
                        <tr>
                            <td>Offensive fire: </td>
                            <td>{this.props.unit.FireBonus.Offensive}</td>
                        </tr>
                        <tr>
                            <td>Defensive fire: </td>
                            <td>{this.props.unit.FireBonus.Defensive}</td>
                        </tr>
                        <tr>
                            <td>Offensive shock: </td>
                            <td>{this.props.unit.ShockBonus.Offensive}</td>
                        </tr>
                        <tr>
                            <td>Defensive shock: </td>
                            <td>{this.props.unit.ShockBonus.Defensive}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}