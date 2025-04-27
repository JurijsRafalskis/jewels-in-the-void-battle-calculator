import { Box, Button, Chip, Dialog, IconButton, Menu, MenuItem, Popover, Tooltip, Typography } from "@mui/material";
import { ITrait } from "../../model/armyComposition/Traits/Trait";
import { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GenerateKey } from "../../utils/GenericUtilities";
import React from "react";
import { GetTraitList } from "../../configuration/InitialValues";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ITraitProps {
    traits: ITrait[]
}

export function TraitDisplay(props: ITraitProps) {
    return <>
        {props.traits.filter(trait => trait.getKey).map((trait, index) => {
            return <SingularTraitDisplay key={trait.getKey()} trait={trait} />
        })}
    </>
}

interface ISIngularTraitDisplayProps {
    trait: ITrait;
}

function SingularTraitDisplay(props: ISIngularTraitDisplayProps) {
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
    traits: ITrait[]
    onChange(traits: ITrait[]): void;
}

export function TraitEditor(props: ITraitEditorProps) {
    const [buttonAnchorElelment, setButtonAnchorElelment] = React.useState<null | HTMLElement>(null);
    const traitMenuOpen = Boolean(buttonAnchorElelment);
    const [buttonId] = useState("AddTraitButton_" + GenerateKey())

    return <Box>
        <Box>
            {props.traits.map((trait, index) => {
                return <SingularTraitEditor key={trait.getKey()} trait={trait}
                    onChange={function (trait: ITrait): void {
                        let newTraits = [...props.traits];
                        newTraits[index] = trait;
                        props.onChange(newTraits);
                    }}
                    onRemoval={function (): void {
                        let newTraits = [...props.traits]
                        newTraits.splice(index, 1);
                        props.onChange(newTraits);
                    }} />
            })}
        </Box>
        <Box>
            <Button startIcon={<AddCircleOutlineIcon />} id={buttonId} onClick={(e) => setButtonAnchorElelment(e.currentTarget)}>Add trait</Button>
            <Menu anchorEl={buttonAnchorElelment}
                open={traitMenuOpen}
                onClose={() => {
                    setButtonAnchorElelment(null);
                }}
                MenuListProps={{
                    'aria-labelledby': buttonId,
                }
                }>
                {GetTraitList().map((trait, index) => {
                    return <MenuItem key={trait.getKey()} onClick={() => {
                        setButtonAnchorElelment(null);
                        props.onChange([...props.traits, trait]);
                    }}>
                        <Typography>{trait.Title}</Typography>
                    </MenuItem>
                })}
            </Menu>
        </Box>
    </Box>
}

export interface SingularTraitEditorProps {
    trait: ITrait
    onChange(trait: ITrait): void;
    onRemoval(): void;
}

export function SingularTraitEditor(props: SingularTraitEditorProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    return <Box>
        <Chip label={props.trait.Title} variant="outlined" />
        <Tooltip title="Edit trait">
            <IconButton
                onClick={() => {
                    setMenuOpen(true);
                }}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
        <Dialog open={menuOpen}>
            {props.trait.createEditForm((trait) => {
                props.onChange(trait);
                setMenuOpen(false);
            }, () => {setMenuOpen(false)})}
        </Dialog>
        <Tooltip title="Remove trait">
            <IconButton
                onClick={props.onRemoval}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    </Box>
}