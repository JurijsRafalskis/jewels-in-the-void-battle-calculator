import { ReactElement } from "react";
import { ITrait } from "./Trait";
import { GenerateKey } from "../../../utils/GenericUtilities";

export class BonusDamagePhase implements ITrait{
    Title: string = "Bonus damage phase";
    Description: string = "";
    #key:string = GenerateKey();

    constructor(){}

    createEditForm(): ReactElement {
        return <></>
    }
    createTooltip(): ReactElement {
        return <></>
    }
    getKey(): string {
        return this.#key;
    }
    

}