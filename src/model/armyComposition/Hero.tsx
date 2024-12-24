import { GenerateKey } from "../../utils/GenericUtilities";
import IKeyable from "../Keyable";
import { IBattleFieldModifier } from "./BattleFieldModifier";
import { IBattleBonusStats } from "./Unit";

export interface IHeroProperties extends IBattleFieldModifier {
    Title:string;
}


export class Hero implements IHeroProperties, IKeyable {
    Title:string = "";
    OrganisationBonus: number = 0;
    ManeuverRollBonus: number = 0;
    ManeuverStaticBonus: number = 0;
    FireBonus: IBattleBonusStats = {
        Defensive : 0,
        Offensive : 0
    };
    ShockBonus: IBattleBonusStats = {
        Defensive : 0,
        Offensive : 0
    };
    #key: string = GenerateKey();
    constructor(props?:IHeroProperties){
        if(!props){
            return;
        }
        Object.assign(
            this,
            {
                ...props
            }
        )
    }
    getKey(): string {
        return this.#key;
    }

}