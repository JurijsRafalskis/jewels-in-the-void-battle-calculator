import { Box, Chip } from "@mui/material";
import { ITrait } from "../model/armyComposition/Traits/Trait";

export interface ITraitProps {
    traits:ITrait[]
}


export function TraitDisplay(props:ITraitProps){
    return <>
        {props.traits.map((trait, index) =>{
            return <Box>
                <Chip label={trait.Title} variant="outlined" />
            </Box>
        })};
    </>
}

export interface ITraitEditorProps {
    traits:ITrait[]
}

export function TraitEditor(props:ITraitEditorProps){
    return <></>
}