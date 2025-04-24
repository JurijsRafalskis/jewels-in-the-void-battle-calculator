import { ReactElement } from "react";
import { BattleCalculator } from "../../../buisnessLogic/BattleCalculator";
import { IBattleContext, BattleRole } from "../../BattleStructure";
import { ITrait } from "./Trait";
import { GenerateKey } from "../../../utils/GenericUtilities";

const traitTitle = "Pre battle Organisation impact";

export class PreBattleOrganisationStep implements ITrait {
    Title: string = traitTitle;
    #key: string = GenerateKey();   

    constructor() { }

    createEditForm(onChange: (v: ITrait) => void, onClose: () => void): ReactElement {
        throw new Error("Method not implemented.");
    }
    createTooltip(): ReactElement {
        throw new Error("Method not implemented.");
    }
    registerBattleModifications(calculator: BattleCalculator, context: IBattleContext, role: BattleRole): void {
        throw new Error("Method not implemented.");
    }
    clone(): ITrait {
        var result = new PreBattleOrganisationStep();
        return Object.assign(result, this);
    }
    getKey(): string {
        return this.#key;
    }
}