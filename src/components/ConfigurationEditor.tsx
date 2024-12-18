import React from 'react';
import { DieSelectionModeValues, IBattleConfiguration } from '../model/BattleConfiguration';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MoraleCalculationModeValues } from "../model/BattleConfiguration"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Checkbox, FormControlLabel } from '@mui/material';

export interface ConfigurationEditorProps {
    config: IBattleConfiguration;
    onChange(config: IBattleConfiguration): void;
}

const moraleCalculationModeEnumValues = Object.keys(MoraleCalculationModeValues).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as MoraleCalculationModeValues);
const dieSelectionModeEnumValues = Object.keys(DieSelectionModeValues).filter(f => !Number.isNaN(parseInt(f))).map(v => v as unknown as DieSelectionModeValues);

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
                <FormControlLabel 
                
                    label={"Post full simulation history"} 
                    control={
                    <Checkbox 
                        checked={currentConfig.PostSimulatedHistory}
                        onChange={(e) => {currentConfig.PostSimulatedHistory = e.target.checked; props.onChange(currentConfig)}}
                />}/>
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
                    {moraleCalculationModeEnumValues.map((v) => (
                        <MenuItem key={v} value={v}>
                            {MoraleCalculationModeValues[v]}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Box sx={{margin: "20px 0 0 0"}}>
                <TextField
                    size="small"
                    select
                    label="Die selection mode"
                    defaultValue={currentConfig.DieSelectionMode}
                    style = {{width: "200px"}}
                    onChange={(e) => { currentConfig.DieSelectionMode = e.target.value as unknown as DieSelectionModeValues; props.onChange(currentConfig); }}
                >
                    {dieSelectionModeEnumValues.map((v) => (
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