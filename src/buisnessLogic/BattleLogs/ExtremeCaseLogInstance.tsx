import { Box } from "@mui/material";
import { GenerateKey } from "../../utils/GenericUtilities";
import { ILogInstance } from "./GenericLogInstance";

export class ExtremeCaseLogInstance implements ILogInstance{
    #key:string = GenerateKey();
    public isAttackerCapableOfVictory?:boolean;
    public canAttackerBeDestroyed?:boolean;
    public isDefenderCapableOfVictory?:boolean;
    public canDefenderBeDestroyed?:boolean;
    getKey(): string {
        return this.#key;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <>
            {this.isAttackerCapableOfVictory != undefined && <Box>Attacker's victory is mathematically {this.isAttackerCapableOfVictory ? "" : "im"}possible.</Box>}
            {this.canAttackerBeDestroyed != undefined && <Box>Attacker's destruction is mathematically {this.canAttackerBeDestroyed ? "" : "im"}possible.</Box>}
            {this.isDefenderCapableOfVictory != undefined && <Box>Defender's victory is mathematically {this.isDefenderCapableOfVictory ? "" : "im"}possible.</Box>}
            {this.canDefenderBeDestroyed != undefined && <Box>Defender's destruction is mathematically {this.canDefenderBeDestroyed ? "" : "im"}possible.</Box>}
        </>
    }
}