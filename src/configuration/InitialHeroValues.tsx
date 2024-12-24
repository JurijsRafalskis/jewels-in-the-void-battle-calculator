import { Hero } from "../model/armyComposition/Hero";

export function BlankHero():Hero{
    let hero = new Hero();    
    return hero;
}

export function RadiantLance():Hero{
    const hero = new Hero();    
    hero.Title = "Radiant Lance, Cry out at Dusk";
    hero.ManeuverRollBonus = 2;
    hero.FireBonus = {
        Offensive: 6,
        Defensive: 6
    }
    return hero;
}

export function HundredWings():Hero{
    const hero = new Hero();    
    hero.Title = "Hundred Wings, Soar High in Burning Sky";
    hero.ManeuverRollBonus = 6;
    hero.FireBonus = {
        Offensive: 2,
        Defensive: 2
    }
    return hero;
}