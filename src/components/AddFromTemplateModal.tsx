import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Button from '@mui/material/Button';
import { GetAllExistingUnits } from '../constants/InitialValues';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GenerateKey } from '../utils/GenericUtilities';

const existingUnits: IUnit[] = GetAllExistingUnits();

export interface AddFromTemplateModalProps {
    onSelect?(unit: IUnit): void;
}

function AddFromTemplateModal(props: AddFromTemplateModalProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [buttonId] = useState("AddTemplateButton_" + GenerateKey())
    return <>
        <Button id={buttonId} variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>Add Template</Button>
        <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => {
                setAnchorEl(null);
            }}
            MenuListProps={{
                'aria-labelledby': buttonId,
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