import { DieSelectionModeValues, IBattleConfiguration } from '../model/BattleConfiguration';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { MoraleCalculationModeValues } from "../model/BattleConfiguration"
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BattleFieldModifierAccordionView } from './BattleFieldModiffierEditor';

const historyPostingLimit = 2000;

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
                            label="Simulation iterations"
                            variant="standard"
                            defaultValue={currentConfig.SimulatedIterationsCount}
                            onChange={(e) => { 
                                currentConfig.SimulatedIterationsCount = parseInt(e.target.value); 
                                if(currentConfig.SimulatedIterationsCount > historyPostingLimit){
                                    currentConfig.PostSimulatedHistory = false;
                                }
                                props.onChange(currentConfig); 
                            }}
                        />
                    </Box>
                    <Box sx={{ margin: "20px 0 0 0" }}>
                        <Tooltip  
                            title={"Disabled due to 'Simulation itterations' having value over " + historyPostingLimit}
                            disableFocusListener={currentConfig.SimulatedIterationsCount <= historyPostingLimit}
                            disableHoverListener={currentConfig.SimulatedIterationsCount <= historyPostingLimit}
                            disableTouchListener={currentConfig.SimulatedIterationsCount <= historyPostingLimit}
                        >
                            <FormControlLabel
                            label={"Post full simulation history"}
                            control={
                                <Checkbox
                                    disabled={currentConfig.SimulatedIterationsCount > historyPostingLimit}
                                    checked={currentConfig.PostSimulatedHistory}
                                    onChange={(e) => { currentConfig.PostSimulatedHistory = e.target.checked; props.onChange(currentConfig) }}
                                />} />
                        </Tooltip>
                        
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