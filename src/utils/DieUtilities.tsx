export enum DieType {
    None = 1,
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
    d100 = 100,
    Custom = 0
}

export interface DieSet {
    diceCount:number;
    dieType:DieType;
    dieCustomValue?:number;
}

export interface RollResult {
    total:number,
    rolls:number[],
    dieType:DieType,
    dieCustomValue?:number;
}

export function FormatDieForReading(set:DieSet):string{
    return set.diceCount.toString() + (set.dieType == DieType.None ? "" : "d" + DieToInt(set.dieType).toString());
}

export function GetMedianDieSetValue(set:DieSet){
    if(set.dieType == DieType.None) return set.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(set.dieType);
    return set.diceCount * ((1 + maxValue) / 2);
}

export function GetMaximumDieSetValue(set:DieSet){
    if(set.dieType == DieType.None) return set.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(set.dieType);
    return set.diceCount * maxValue;
}

export function Roll(die:DieSet):RollResult;
export function Roll(dieCount:number, dieType:DieType):RollResult;
export function Roll(dieCount:number, dieCustomValue:number):RollResult;
export function Roll(dieCustomValue:number):RollResult;
export function Roll(a:number | DieSet, b?:DieType | number ):RollResult {
    if(typeof (a) === "number" && b){
        return RollInternal({diceCount:a as number, dieType:typeof(b) == "number" ? AttemptToProcureDieType(b) : b, dieCustomValue : typeof(b) == "number" ? b : undefined });
    }
    if(typeof (a) === "number" && !b){
        return RollInternal({diceCount:1, dieType:AttemptToProcureDieType(a as number), dieCustomValue : a });
    }
    const checkedA = a && a as DieSet;
    if(checkedA && !b){
        return RollInternal(checkedA);
    }
    throw new Error("Invalid argument for function Roll.");
}

function RollInternal(die:DieSet):RollResult{
    const result:RollResult = {
        total : 0,
        dieType : die.dieType,
        dieCustomValue: die.dieCustomValue,
        rolls : []
    }
    for(let i = 0; i < die.diceCount; i++){
        let dieMax = die.dieType == DieType.Custom && die.dieCustomValue ? die.dieCustomValue : DieToInt(die.dieType);
        let rollResult = RollExactDice(dieMax);
        result.total += rollResult;
        result.rolls.push(rollResult);
    }
    return result;
}

function RollDice(dieType:DieType){ //type should be in its int form right now.
    let int = DieToInt(dieType);
    if(int == 0) return 0;
    return 1 + Math.floor(Math.random() * int);
}

function RollExactDice(input:number):number{
    if(input == 0){
        return 0;
    }
    return 1 + Math.floor(Math.random() * input);
}

export function DieToInt(dieType:DieType):number{
    let int = parseInt(dieType.toString()); //Check for wrong enum form?
    if(Number.isNaN(int)){
        int = parseInt(DieType[dieType].toString());
    }
    return int;
}

function AttemptToProcureDieType(dieCustomValue:number):DieType{
    const existingValue = DieType[dieCustomValue];
    return  !!existingValue ? (existingValue.toString() as unknown as DieType) : DieType.Custom;
}