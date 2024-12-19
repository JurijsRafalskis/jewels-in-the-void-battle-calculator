import { DieSelectionModeValues, IBattleConfiguration } from '../model/BattleConfiguration';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { MoraleCalculationModeValues } from "../model/BattleConfiguration"
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BattleFieldModifierAccordionView } from './BattleFieldModiffierEditor';

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
            <BattleFieldModifierAccordionView
                accordeonTitle="Attacker battlefield modifiers"
                modifier={currentConfig.AttackersBattleFieldModifiers}
                onSave={(modifier) => { currentConfig.AttackersBattleFieldModifiers = modifier; props.onChange(currentConfig); }} />
            <BattleFieldModifierAccordionView
                accordeonTitle="Defender battlefield modifiers"
                modifier={currentConfig.DefenderBattleFieldModifiers}
                onSave={(modifier) => { currentConfig.DefenderBattleFieldModifiers = modifier; props.onChange(currentConfig); }} />
            <BattleFieldModifierAccordionView
                accordeonTitle="Global battlefield modifiers"
                modifier={currentConfig.GlobalBattlefieldModifiers}
                onSave={(modifier) => { currentConfig.GlobalBattlefieldModifiers = modifier; props.onChange(currentConfig); }} />
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Calculation settings</AccordionSummary>
                <AccordionDetails>
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
                    <Box sx={{ margin: "20px 0 0 0" }}>
                        <FormControlLabel

                            label={"Post full simulation history"}
                            control={
                                <Checkbox
                                    checked={currentConfig.PostSimulatedHistory}
                                    onChange={(e) => { currentConfig.PostSimulatedHistory = e.target.checked; props.onChange(currentConfig) }}
                                />} />
                    </Box>
                    <Box sx={{ margin: "20px 0 0 0" }}>
                        <TextField
                            size="small"
                            select
                            label="Morale calculation mode"
                            defaultValue={currentConfig.MoraleCalculationMode}
                            style={{ width: "200px" }}
                            onChange={(e) => { currentConfig.MoraleCalculationMode = e.target.value as unknown as MoraleCalculationModeValues; props.onChange(currentConfig); }}
                        >
                            {moraleCalculationModeEnumValues.map((v) => (
                                <MenuItem key={v} value={v}>
                                    {MoraleCalculationModeValues[v]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {/* 
                    <Box sx={{ margin: "20px 0 0 0" }}>
                        <TextField
                            size="small"
                            select
                            label="Die selection mode"
                            defaultValue={currentConfig.DieSelectionMode}
                            style={{ width: "200px" }}
                            onChange={(e) => { currentConfig.DieSelectionMode = e.target.value as unknown as DieSelectionModeValues; props.onChange(currentConfig); }}
                        >
                            {dieSelectionModeEnumValues.map((v) => (
                                <MenuItem key={v} value={v}>
                                    {DieSelectionModeValues[v]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>*/}
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default ConfigurationEditor;