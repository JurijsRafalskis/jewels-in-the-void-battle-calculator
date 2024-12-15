import React from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import { UnitEditor } from './UnitEditor';

export interface ArmyEditorProps {
  units: IUnit[];
  onChange(unitProps: IUnit): void;
}

export class ArmyEditor extends React.Component<ArmyEditorProps> {
  render() {
    return (
      <div>
        {this.props.units.map(unit => (
          <UnitEditor unit={unit} onChange={() => { }} />
        ))}
      </div>
    );
  }
}