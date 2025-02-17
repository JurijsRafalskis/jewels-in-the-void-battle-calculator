import { IUnit } from "../../model/armyComposition/Unit";
import { IBattleContext } from "../../model/BattleStructure";
import IKeyable from "../../model/Keyable";
import { GenerateKey } from "../../utils/GenericUtilities";
import { CloneUnit } from "../../utils/UnitUtils";


export interface ILogInstance extends IKeyable{
    GetFormattedLogElement():JSX.Element;
}

export abstract class LogInstance implements ILogInstance{
    protected attacker:IUnit;
    protected defender:IUnit;
    protected key:string;
    constructor(context:IBattleContext){
        this.attacker = CloneUnit(context.attackerCurrentState);
        this.defender = CloneUnit(context.defenderCurrentState);
        this.key = GenerateKey();
    }

    public abstract GetFormattedLogElement():JSX.Element;

    public getKey():string 
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
