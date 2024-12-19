export enum DieTypes {
    None = 0,
    d1 = 1,
    d2 = 2,
    d3 = 3,
    d4 = 4,
    d5 = 5,
    d6 = 6,
    d7 = 7,
    d8 = 8,
    d9 = 9,
    d10 = 10,
    d12 = 12,
    d20 = 20,
    d100 = 100
}

export interface DieSet {
    diceCount:number;
    dieType:DieTypes;
}

export interface RollResult {
    total:number,
    rolls:number[],
    dieType:DieTypes
}

export function FormatDieForReading(set:DieSet):string{
    return set.diceCount.toString() + (set.dieType == DieTypes.None ? "" : "d" + DieToInt(set.dieType).toString());
}

export function GetMedianDieSetValue(set:DieSet){
    if(set.dieType == DieTypes.None) return set.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(set.dieType);
    return set.diceCount * ((1 + maxValue) / 2);
}

export function GetMaximumDieSetValue(set:DieSet){
    if(set.dieType == DieTypes.None) return set.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(set.dieType);
    return set.diceCount * maxValue;
}

export function Roll(die:DieSet):RollResult;
export function Roll(dieCount:number, dieType:DieTypes):RollResult;
export function Roll(a:number | DieSet, b?:DieTypes):RollResult {
    if(typeof (a) === "number" && b){
        return RollInternal(a as number, b);
    }
    const checkedA = a && a as DieSet;
    if(checkedA && !b){
        return RollInternal(checkedA.diceCount, checkedA.dieType);
    }
    throw new Error("Invalid argument for function Roll.");
}

function RollInternal(dieCount:number, dieType:DieTypes):RollResult{
    const result:RollResult = {
        total : 0,
        dieType : dieType,
        rolls : []
    }
    for(let i = 0; i < dieCount; i++){
        let rollResult = RollDice(dieType);
        result.total += rollResult;
        result.rolls.push(rollResult);
    }
    return result;
}

function RollDice(dieType:DieTypes){ //type should be in its int form right now.
    let int = DieToInt(dieType);
    if(int == 0) return 0;
    return 1 + Math.floor(Math.random() * int);
}

export function DieToInt(dieType:DieTypes):number{
    let int = parseInt(dieType.toString()); //Check for wrong enum form?
    if(Number.isNaN(int)){
        int = parseInt(DieTypes[dieType].toString());
    }
    return int;
}