import { IUnit } from "../model/armyComposition/Unit";

export function CloneUnit(unit:IUnit):IUnit{
    let deepCopy = structuredClone(unit);
    deepCopy.Traits = unit.Traits.map(t => t.clone());
    return deepCopy;
}