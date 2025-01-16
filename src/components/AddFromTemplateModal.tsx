import React, { useState } from 'react';
import { IUnit } from '../model/armyComposition/Unit';
import Button from '@mui/material/Button';
import { GetAllExistingUnits, GetAllFungalUnits, GetAllParadaisoUnits } from '../configuration/InitialValues';
import { Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GenerateKey, PrepareUnit } from '../utils/GenericUtilities';
import { NestedMenuItem } from 'mui-nested-menu';

interface IUnitSubMenu{
    units:IUnit[];
    title:string;
}

const unitSet:IUnitSubMenu[] = [
    {
        title: "Paradaiso",
        units: GetAllParadaisoUnits()
    },
    {
        title: "Fungal swarm",
        units: GetAllFungalUnits()
    }
]

export interface AddFromTemplateModalProps {
    onSelect?(unit: IUnit): void;
}

export default function AddFromTemplateModal(props: AddFromTemplateModalProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [buttonId] = useState("AddTemplateButton_" + GenerateKey());

    const createMenuItemElement = (unit:IUnit, index:number) =>{
        return <MenuItem key={unit.Metadata?.Key} onClick={() => {
            setAnchorEl(null);
            //Ensuring that new unit has unique ID.
            const newUnit = PrepareUnit(unit);
            props.onSelect && props.onSelect(newUnit);
        }}>
            <Typography>{unit.Title}</Typography>
        </MenuItem>
    };

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
            {unitSet.map((set, setIndex) =>(
                <NestedMenuItem
                    renderLabel={() => <>{set.title}</>}
                    parentMenuOpen={menuOpen}
                    key={set.title}
                    >
                    {set.units.map(createMenuItemElement)}
                </NestedMenuItem>
            ))}
        </Menu>
    </>;
}