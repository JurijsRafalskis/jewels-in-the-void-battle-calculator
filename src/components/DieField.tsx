import { MenuItem, TextField } from "@mui/material";
import { DieSet, DieTypes } from "../utils/DieUtilities";
import { useState } from "react";

const dieValues = Object.keys(DieTypes).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as DieTypes);

export interface DieFieldProps{
    fieldLabel:string;
    dieSet:DieSet;
    onChange(unitProps: DieSet): void;
}

function DieField(props:DieFieldProps){
    const [die, setDie] = useState(props.dieSet)
    return <>
        <TextField
            size="small"
            type="number"
            margin="dense"
            label={props.fieldLabel}
            variant="standard"
            defaultValue={die.dieCount}
            onChange={v => { die.dieCount = parseInt(v.currentTarget.value); setDie(die); props.onChange(die); }}
        />
        <TextField
            size="small"
            select
            label="Die"
            margin="dense"
            variant="standard"
            defaultValue={die.dieType}
            style={{ width: "100px" }}
            onChange={(e) => { props.dieSet.dieType = e.target.value as unknown as DieTypes; setDie(die); props.onChange(die); }}
        >
            {dieValues.map((v) => (
                <MenuItem key={v} value={v}>
                    {DieTypes[v]}
                </MenuItem>
            ))}
        </TextField>
    </>
}

export default DieField;