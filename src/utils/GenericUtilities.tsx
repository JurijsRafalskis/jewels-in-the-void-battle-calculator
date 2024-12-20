import { IUnit } from "../model/armyComposition/Unit";

export function GenerateKey(){
    return crypto.randomUUID(); //Todo: add polyfill?
}

export function AppendKeyToUnit(unit:IUnit):IUnit{
    unit.Metadata = unit.Metadata || {};
    unit.Metadata.Key = GenerateKey();
    return unit;
}

export function ParseAndLimitIntegerValues(input:any, min?:number, max?:number):number {
    var value = parseInt(input);
    if(isNaN(value)) return min ?? max ?? 0;
    if(min != undefined && value < min) return min;
    if(max != undefined && value > max) return max;
    return value;
}