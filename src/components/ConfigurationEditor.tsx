import React from 'react';
import { IBattleConfiguration } from '../model/BattleConfiguration';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MoraleCalculationModeValues } from "../model/BattleConfiguration"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export interface ConfigurationEditorProps {
    config: IBattleConfiguration;
    onChange(config: IBattleConfiguration): void;
}

const enumValues = Object.keys(MoraleCalculationModeValues).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as MoraleCalculationModeValues);

function ConfigurationEditor(props: ConfigurationEditorProps) {
    const currentConfig = structuredClone(props.config);
    return (
        <>
            <Box>
                <TextField
                    size="small"
                    type="number"
                    margin="dense"
                    label="Simulation Iterations"
                    variant="standard"
                    defaultValue={currentConfig.SimulatedIterationsCount}
                    onChange={(e) => { currentConfig.SimulatedIterationsCount = parseInt(e.target.value); props.onChange(currentConfig); }}
                />
            </Box>
            <Box sx={{margin: "20px 0 0 0"}}>
                <TextField
                    size="small"
                    select
                    label="Morale calculation mode"
                    defaultValue={currentConfig.MoraleCalculationMode}
                    style = {{width: "200px"}}
                    onChange={(e) => { currentConfig.MoraleCalculationMode = e.target.value as unknown as MoraleCalculationModeValues; props.onChange(currentConfig); }}
                >
                    {enumValues.map((v) => (
                        <MenuItem key={v} value={v}>
                            {MoraleCalculationModeValues[v]}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </>
    );
}

export default ConfigurationEditor;