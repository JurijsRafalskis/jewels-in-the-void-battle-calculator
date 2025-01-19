import { IArmy } from "./Army";

export interface IArmyStack{
    activeArmy:IArmy;
    stack:IArmy[];
}