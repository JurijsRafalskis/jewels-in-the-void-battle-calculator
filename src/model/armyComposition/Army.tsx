import { Hero } from "./Hero";
import { IUnit } from "./Unit";

export interface IArmy {
    units:IUnit[];
    hero?:Hero;
}