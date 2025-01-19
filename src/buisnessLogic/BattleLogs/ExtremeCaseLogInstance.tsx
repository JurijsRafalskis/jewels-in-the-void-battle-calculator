import { Box } from "@mui/material";
import { GenerateKey } from "../../utils/GenericUtilities";
import { ILogInstance } from "./GenericLogInstance";

export class ExtremeCaseLogInstance implements ILogInstance{
    #key:string = GenerateKey();
    public isAttackerCapableOfVictory:boolean = false;
    public canAttackerBeDestroyed:boolean = false;
    public isDefenderCapableOfVictory:boolean = false;
    public canDefenderBeDestroyed:boolean = false;
    getKey(): string {
        return this.#key;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <>
            <Box sx={{marginTop:"10px"}}>Attacker's victory is mathematically {this.isAttackerCapableOfVictory ? "" : "im"}possible.</Box>
            <Box>Attacker's destruction is mathematically {this.canAttackerBeDestroyed ? "" : "im"}possible.</Box>
            <Box>Defender's victory is mathematically {this.isDefenderCapableOfVictory ? "" : "im"}possible.</Box>
            <Box>Defender's destruction is mathematically {this.canDefenderBeDestroyed ? "" : "im"}possible.</Box>
        </>
    }
}