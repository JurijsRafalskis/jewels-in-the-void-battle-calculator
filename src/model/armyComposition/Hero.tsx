import { IBattleFieldModifier } from "./BattleFieldModifier";
import { IBattleBonusStats } from "./Unit";

export class Hero implements IBattleFieldModifier {
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
}