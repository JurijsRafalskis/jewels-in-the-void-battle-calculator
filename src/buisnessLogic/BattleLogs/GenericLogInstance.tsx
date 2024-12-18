import { IUnit } from "../../model/armyComposition/Unit";
import { IBattleContext } from "../../model/BattleStructure";
import { GenerateKey } from "../../utils/GenericUtilities";


export interface ILogInstance{
    GetFormattedLogElement():JSX.Element;
    GetKey():string;
}

export abstract class LogInstance implements ILogInstance{
    protected attacker:IUnit;
    protected defender:IUnit;
    protected key:string;
    constructor(context:IBattleContext){
        this.attacker = structuredClone(context.attackerCurrentState);
        this.defender = structuredClone(context.defenderCurrentState);
        this.key = GenerateKey();
    }

    public abstract GetFormattedLogElement():JSX.Element;

    public GetKey():string 
    { 
        return this.key;
    }

    public GetCurrentStateOfOpponents():IOpponents{
        return {
            attacker: this.attacker,
            defender: this.defender
        }
    }
}

export interface IOpponents{
    attacker:IUnit;
    defender:IUnit;
}
