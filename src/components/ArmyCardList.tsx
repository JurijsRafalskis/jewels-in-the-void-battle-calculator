import React from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import UnitCard from './UnitCard';
import { IArmy } from '../model/armyComposition/Army';

export interface UnitCardListProps {
  units:IUnit[]
  onChange(unitProps: IUnit[]): void;
}

function UnitCardList(props: UnitCardListProps) {
    return (
      <div>
        {props.units.map((unit, index) => (
          <UnitCard key={unit.Metadata?.Key || index} unit={unit} onChange={(newUnit) => 
            { 
              /*This feels like very dirty hack - to reuse same function for removal and changed values. Probably should rewrite. */
              let newUnits:IUnit[] = [];
              if(newUnit){
                newUnits = props.units.map((u, i) => 
                  i != index ? u : newUnit
                );                
              }
              else{
                newUnits = props.units.filter((u, i) => i != index);
              }
              props.onChange(newUnits);  //TODO: Check if we can directly manipulate this list, or we need to deep clone?
            }} />
        ))}
      </div>
    );
}

export default UnitCardList;
