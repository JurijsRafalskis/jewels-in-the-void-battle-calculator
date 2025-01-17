import { TextField, TextFieldVariants } from "@mui/material";
import { useState } from "react";
import { ParseAndLimitIntegerValues } from "../../utils/GenericUtilities";

export interface IUncontrolledLimitedIntegerNumberFieldProps {
    label: string;
    defaultValue?: number;
    onChange(value: number): void;
    min?: number;
    max?: number;
    disabled?:boolean;
}

export function UncontrolledLimitedIntegerNumberField({ defaultValue = 0, disabled = false, ...props }: IUncontrolledLimitedIntegerNumberFieldProps) {
    const [errorExists, setErrorExists] = useState(false);
    return (
        <TextField
            size="small"
            type="number"
            margin="dense"
            variant="standard"
            disabled={disabled}
            error={errorExists}
            helperText={errorExists ? "Invalid value, will be ignored" : ""}
            label={props.label}
            defaultValue={defaultValue}
            onChange={v => {
                let newValue = v.currentTarget.value;
                let parsedValue = ParseAndLimitIntegerValues(newValue, props.min, props.max);
                if (newValue != parsedValue.toString()) {
                    setErrorExists(true)
                }
                else {
                    setErrorExists(false);
                    props.onChange(parsedValue);
                }
            }
            }
        />
    )
}
