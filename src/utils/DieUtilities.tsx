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
    rolls:SingularRollResult[],
}

export interface SingularRollResult{
    roll:number;
    dieType:DieType,
    dieCustomValue?:number;
}

export function FormatDiesForReading(sets:DieSet[]){
    return sets.map(FormatDieForReading).join(" + ");
}

export function FormatDieForReading(set:DieSet):string{
    return set.diceCount.toString() + (set.dieType == DieType.None ? "" : "d" + (set.dieType == DieType.Custom ? set.dieCustomValue?.toString() : DieToInt(set.dieType).toString()));
}

export function GetMedianDieSetValue(set:DieSet | DieSet[]):number{
    if(set.constructor === Array){
        let total = 0;
        set.forEach(setItem => {
            total += GetMedianDieSetValue(setItem as DieSet);
        });
        return total;
    }

    let currentSet = set as DieSet;
    if(currentSet.dieType == DieType.None) return currentSet.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(currentSet.dieType);
    return currentSet.diceCount * ((1 + maxValue) / 2);
}

export function GetMaximumDieSetValue(set:DieSet | DieSet[]):number{
    if(set.constructor === Array){
        let total = 0;
        set.forEach(setItem => {
            total += GetMaximumDieSetValue(setItem as DieSet);
        });
        return total;
    }

    let currentSet = set as DieSet;
    if(currentSet.dieType == DieType.None) return currentSet.diceCount; //Exception for calculating straight values.
    let maxValue = DieToInt(currentSet.dieType);
    return currentSet.diceCount * maxValue;
}

export function GetMinimumDieSetValue(set:DieSet | DieSet[]):number{
    if(set.constructor === Array){
        let total = 0;
        set.forEach(setItem => {
            total += GetMinimumDieSetValue(setItem as DieSet);
        });
        return total;
    }

    let currentSet = set as DieSet;
    return currentSet.diceCount;
}

export function RollMaximumDieSetValue(set:DieSet | DieSet[]):RollResult{
    let currentSet:DieSet[] = [];
    if(set.constructor === Array){
        currentSet = set as DieSet[];
    }
    else{
        currentSet = [set as DieSet];
    }
    let result:RollResult = {
        total: 0,
        rolls: []
    }

    for(let index in currentSet){
        var dieValue = currentSet[index].dieCustomValue && !isNaN(currentSet[index].dieCustomValue) ? currentSet[index].dieCustomValue : DieToInt(currentSet[index].dieType);
        for(let i = 0; i < currentSet[index].diceCount; i++) {
            result.total += dieValue;
            result.rolls.push({
                roll:dieValue,
                dieType: currentSet[index].dieType,
                dieCustomValue: currentSet[index].dieCustomValue,
            });
        }
    }
    
    return result;
}

export function RollMinimumDieSetValue(set:DieSet | DieSet[]):RollResult{
    let currentSet:DieSet[] = [];
    if(set.constructor === Array){
        currentSet = set as DieSet[];
    }
    else{
        currentSet = [set as DieSet];
    }

    let result:RollResult = {
        total: 0,
        rolls: []
    }

    for(let index in currentSet){
        for(let i = 0; i < currentSet[index].diceCount; i++) {
            result.total++;
            result.rolls.push({
                roll:1,
                dieType: currentSet[index].dieType,
                dieCustomValue: currentSet[index].dieCustomValue,
            });
        }
    }
    
    return result;
}


export function Roll(die:DieSet[]):RollResult;
export function Roll(die:DieSet):RollResult;
export function Roll(dieCount:number, dieType:DieType):RollResult;
export function Roll(dieCount:number, dieCustomValue:number):RollResult;
export function Roll(dieCustomValue:number):RollResult;
export function Roll(a:number | DieSet | DieSet[], b?:DieType | number ):RollResult {
    if(typeof (a) === "number" && b){
        return RollInternal({diceCount:a as number, dieType:typeof(b) == "number" ? AttemptToProcureDieType(b) : b, dieCustomValue : typeof(b) == "number" ? b : undefined });
    }
    if(typeof (a) === "number" && !b){
        return RollInternal({diceCount:1, dieType:AttemptToProcureDieType(a as number), dieCustomValue : a });
    }
    const checkedA = a;
    if(checkedA && !b){
        if(checkedA.constructor === Array)
        {
            let result:RollResult = {
                total:0,
                rolls: []
            }
            //Right now, treating the contents as valid from the get go. Maybe add a try catch, and rethrow with better explanation?
            checkedA.forEach(element => {
                let currentRoll = RollInternal(element);
                result.total += currentRoll.total;
                result.rolls = [...result.rolls, ...currentRoll.rolls]
            });
            return result;
        }
        else{
            return RollInternal(checkedA as DieSet);
        }
    }
    throw new Error("Invalid argument for function Roll.");
}

function RollInternal(die:DieSet):RollResult{
    const result:RollResult = {
        total : 0,
        rolls : []
    }
    for(let i = 0; i < die.diceCount; i++){
        let dieMax = die.dieType == DieType.Custom && die.dieCustomValue ? die.dieCustomValue : DieToInt(die.dieType);
        let rollResult = RollExactDice(dieMax);
        result.total += rollResult;
        result.rolls.push({
            roll: rollResult,
            dieType : die.dieType,
            dieCustomValue: die.dieCustomValue,
        });
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

export function AttemptToProcureDieType(dieCustomValue:number):DieType{
    const existingValue = DieType[dieCustomValue];
    //Ternary operator doesen't work here for unclear reason.
    if(!!existingValue){
        return existingValue.toString() as unknown as DieType;
    }
    return DieType.Custom
}