import { ReactElement } from "react";
import IKeyable from "../../Keyable";
import { BattleCalculator } from "../../../buisnessLogic/BattleCalculator";
import { BattleRole, IBattleContext } from "../../BattleStructure";

export interface ITrait extends IKeyable {
    Title:string;
    createEditForm(onChange:(v:ITrait)=>void, onClose:()=>void):ReactElement;
    createTooltip():ReactElement;
    registerBattleModifications(calculator:BattleCalculator, context: IBattleContext, role:BattleRole):void;
    clone():ITrait;
}