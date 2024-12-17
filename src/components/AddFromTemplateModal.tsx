import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { GetAllExistingUnits } from '../constants/InitialValues';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const existingUnits: IUnit[] = GetAllExistingUnits();

export interface AddFromTemplateModalProps {
    onSelect?(unit: IUnit): void;
}

function AddFromTemplateModal(props: AddFromTemplateModalProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    return <>
        <Button id='addTempalteButton' variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>Add Template</Button>
        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => {
                setAnchorEl(null);
            }}
            MenuListProps={{
                'aria-labelledby': 'addTempalteButton',
            }}
        >
            {existingUnits.map((unit, index) =>
            (<React.Fragment key={unit.Metadata?.Key}>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    props.onSelect && props.onSelect(unit);
                }}>
                    <Typography>{unit.Title}</Typography>
                </MenuItem>
                {index < existingUnits.length - 1 && <Divider/>}
            </React.Fragment>)
            )}
        </Menu>
    </>
}

export default AddFromTemplateModal;