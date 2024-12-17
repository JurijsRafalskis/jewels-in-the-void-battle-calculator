export enum DieTypes {
    None = 0,
    d2 = 2,
    d3 = 3,
    d4 = 4,
    d6 = 6,
    d8 = 8,
    d10 = 10,
    d12 = 12,
    d20 = 20,
    d100 = 100
}

export interface RollResult {
    total:number,
    rolls:number[],
    dieType:DieTypes
}

export function Roll(dieCount:number, dieType:DieTypes){
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
    let int = parseInt(dieType.toString()); //Check for wrong enum form?
    if(Number.isNaN(int)){
        int = parseInt(DieTypes[dieType].toString());
    }
    if(int == 0) return 0;
    return 1 + Math.floor(Math.random() * int);
}