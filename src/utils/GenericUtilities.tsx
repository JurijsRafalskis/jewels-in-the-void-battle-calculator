import { IUnit } from "../model/armyComposition/Unit";

export function GenerateKey(){
    return crypto.randomUUID(); //Todo: add polyfill?
}

export function AppendKeyToUnit(unit:IUnit):IUnit{
    unit.Metadata = unit.Metadata || {};
    unit.Metadata.Key = GenerateKey();
    return unit;
}