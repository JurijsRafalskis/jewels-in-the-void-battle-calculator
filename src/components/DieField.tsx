import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { AttemptToProcureDieType, DieSet, DieType } from "../utils/DieUtilities";
import { useState } from "react";
import { UncontrolledLimitedIntegerNumberField } from "./ControlledIntegerNumberField";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

const dieValues = Object.keys(DieType).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as DieType);

export interface DieFieldProps{
    fieldLabel:string;
    dieSet:DieSet;
    onChange(unitProps: DieSet): void;
}

export function DieField(props:DieFieldProps){
    const [die, setDie] = useState(props.dieSet)
    const [isCustom, setIsCustom] = useState(props.dieSet.dieType != DieType.Custom);
    return <>
        <UncontrolledLimitedIntegerNumberField
            label="Die count"
            defaultValue={die.diceCount}
            min={0}
            onChange={v => { let currentDie:DieSet = {...die, diceCount: v}; setDie(currentDie); props.onChange(currentDie); }}
        />
        <TextField
            size="small"
            select
            label="Die"
            margin="dense"
            variant="standard"
            defaultValue={die.dieType}
            style={{ width: "100px" }}
            onChange={(e) => { 
                let currentDie:DieSet = {...die, dieType : e.target.value as unknown as DieType }; 
                setDie(currentDie);
                if(!isCustom && currentDie.dieType == DieType.Custom){
                    setIsCustom(true);
                } 
                props.onChange(currentDie); 
            }}
        >
            {dieValues.map((v) => (
                <MenuItem key={v} value={v}>
                    {DieType[v]}
                </MenuItem>
            ))}
        </TextField>
        <UncontrolledLimitedIntegerNumberField
            disabled={die.dieType != DieType.Custom && !isCustom}
            label="Custom die value"
            min={0}
            defaultValue={die.dieCustomValue ?? 0}
            onChange={v => {  let currentDie:DieSet = {...die, dieCustomValue: v, dieType: AttemptToProcureDieType(v)}; setDie(currentDie); props.onChange(currentDie); }}
        />
    </>
}

export interface MultiDieFieldProps{
    fieldLabel:string;
    dieSets:DieSet[];
    onChange(unitProps: DieSet[]): void;
}

export function MultiDieField(props:MultiDieFieldProps){
    return <>
        <Box>
            {props.dieSets.map((item, index) =>{
                return <Box key={`${item.diceCount}_${item.dieType}_${item.dieCustomValue ?? 0}_${index}`}>
                    <DieField 
                    fieldLabel="Die count"
                    dieSet={item}
                    onChange={die => {
                        let values = [...props.dieSets];
                        values[index] = die;
                        props.onChange(values);
                    }}
                    />
                    <IconButton 
                        aria-label="Remove"
                        onClick={() =>{
                            let values = [...props.dieSets];
                            values.splice(index, 1);
                            props.onChange(values);
                        }}>
                        <ClearIcon/>
                    </IconButton>
                </Box>
            })}
        </Box>
        <Box>
        <IconButton aria-label="Add a new die" onClick={() => {
            let values = [...props.dieSets];
            values.push({
                diceCount: 0,
                dieType: DieType.None,
            });
            props.onChange(values);
        }}>
                <AddCircleOutlineIcon />
        </IconButton>
        </Box>
    </>
}