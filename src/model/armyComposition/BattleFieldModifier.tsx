import { IBattleBonusStats, IDamageBonusStats } from "./Unit";

export interface IBattleFieldModifier extends IDamageBonusStats {
    OrganisationBonus: number;
    ManeuverRollBonus: number;
    ManeuverStaticBonus: number;
}