import Popover from '@mui/material/Popover';
import { IUnit } from '../model/armyComposition/Unit';
import { Box } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import UnitCard from './UnitCard';

export interface UnitHoverProps {
    unit: IUnit;
    children: ReactNode;
}

function UnitHover(props: UnitHoverProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const popoverOpen = Boolean(anchorEl);
    const id = "PopoverId_" + props.unit.Metadata?.Key;
    return <>
        <Box
            component="span"
            onMouseEnter={e => setAnchorEl(e.currentTarget)}
            onMouseLeave={e => setAnchorEl(null)}
            aria-owns={popoverOpen ? id : undefined}
            aria-haspopup="true"
        >
            {props.children}
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
        >
            <UnitCard unit={props.unit} renderActions={false}></UnitCard>
        </Popover>
    </>
}

export default UnitHover;