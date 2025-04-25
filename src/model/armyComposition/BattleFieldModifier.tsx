import { IBattleBonusStats, IDamageBonusStats } from "./Unit";

export interface IBattleFieldModifier extends IDamageBonusStats {
    OrganizationBonus: number;
    ManeuverRollBonus: number;
    ManeuverStaticBonus: number;
    HealthBonus:number;
}