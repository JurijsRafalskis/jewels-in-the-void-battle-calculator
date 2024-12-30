import { Box, Chip, Popover } from "@mui/material";
import { ITrait } from "../model/armyComposition/Traits/Trait";
import { useState } from "react";

export interface ITraitProps {
    traits:ITrait[]
}

export function TraitDisplay(props:ITraitProps){
    return <>
        {props.traits.filter(trait => trait.getKey).map((trait, index) =>{
            return <SingularTraitDisplay key={trait.getKey()} trait={trait}/>
        })}
    </>
}

interface ISIngularTraitDisplayProps{
    trait:ITrait;
}

function SingularTraitDisplay(props:ISIngularTraitDisplayProps){
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const popoverOpen = Boolean(anchorEl);
    const id = "PopoverId_" + props.trait.getKey();
    return <>
        <Box
            onMouseEnter={e => setAnchorEl(e.currentTarget)}
            onMouseLeave={e => setAnchorEl(null)}
            aria-owns={popoverOpen ? id : undefined}
            aria-haspopup="true"
        >
            <Chip label={props.trait.Title} variant="outlined" />
        </Box>
        <Popover
            id={id}
            open={popoverOpen}
            anchorEl={anchorEl}
            sx={{ pointerEvents: 'none' }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            disableAutoFocus={true}
        >
            {props.trait.createTooltip()}
        </Popover>
    </>
}

export interface ITraitEditorProps {
    traits:ITrait[]
    onChange(traits:ITrait[]):void;
}

export function TraitEditor(props:ITraitEditorProps){
    return <Box>
        <Box>

        </Box>
        <Box>
            
        </Box>
    </Box>
}