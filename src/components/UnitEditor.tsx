import React from 'react';
import {IUnit} from '../model/armyComposition/Unit';


export interface IUnitEditorProps {
 unit:IUnit;
 onChange(unitProps:IUnit):void;
}

export default class UnitEditor extends React.Component{
    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Label: </td>
                            <td>Value: </td>
                        </tr>
                        <tr>
                            <td>Label: </td>
                            <td>Value: </td>
                        </tr>
                        <tr>
                            <td>Label: </td>
                            <td>Value: </td>
                        </tr>
                        <tr>
                            <td>Label: </td>
                            <td>Value: </td>
                        </tr>
                        <tr>
                            <td>Label: </td>
                            <td>Value: </td>
                        </tr>
                    </tbody>
                </table>
            </div>
          );
    }
}


//UnitEditor; 
/*UnitEditor({unit:IUnit}){

    return (
        <div>

        </div>
      );
}*/