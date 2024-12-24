import { useState, useRef } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { GetDefaultAttackerComposition, GetDefaultDefenderComposition, GetDefaultConfig, GenerateRandomSetOfUnits } from "./configuration/InitialValues";
import ConfigurationEditor from './components/ConfigurationEditor';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import FullBattleLogDisplay from './components/FullBattleLogDisplay';
import { BattleCalculator } from './buisnessLogic/BattleCalculator';
import { ILogInstance, LogInstance } from './buisnessLogic/BattleLogs/GenericLogInstance';
import { MultiSimulationLog } from './buisnessLogic/BattleLogs/LogInstances';
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, CircularProgress, createTheme, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { IArmy } from './model/armyComposition/Army';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { FullArmyCard } from './components/FullArmyEditor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTheme = createTheme({});

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(GetDefaultConfig());
  const [attackerArmy, setAttackerArmy] = useState<IArmy>(GetDefaultAttackerComposition());
  const [defenderArmy, setDefenderArmy] = useState<IArmy>(GetDefaultDefenderComposition());
  const [currentLog, setCurrentLog] = useState<ILogInstance[]>([]);
  const [backdropOpened, setBackdropOpened] = useState(false);
  const isUnderSmallSized = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const isOverMediumSized = useMediaQuery(defaultTheme.breakpoints.up("md"));
  const isUnderLargeSized = useMediaQuery(defaultTheme.breakpoints.down("lg"));
  const isMediumSized = isOverMediumSized && isUnderLargeSized;
  const logRef = useRef<any>();

  const scrollToLog = () =>{
    setTimeout(() =>{logRef?.current?.scrollIntoView({behavior: "smooth", block: "start"});}, 25);
  }

  const runSingleSimulation = async () => {
    setBackdropOpened(true);
    setTimeout(() => {
      setCurrentLog([]);
      const calculator = new BattleCalculator(attackerArmy, defenderArmy, calculatorConfiguration);
      const result = calculator.execute();
      setCurrentLog(result.log);
      setBackdropOpened(false);
      scrollToLog();
    }, 100);
  }

  const runMultiSimulation = async () => {
    setBackdropOpened(true);
    setTimeout(() => {
      setCurrentLog([]);
      const aggregatedLog = new MultiSimulationLog(calculatorConfiguration);
      for (var i = 0; i < calculatorConfiguration.SimulatedIterationsCount; i++) {
        const calculator = new BattleCalculator(attackerArmy, defenderArmy, calculatorConfiguration);
        const result = calculator.execute();
        aggregatedLog.RegisterResult(result);
      }
      const additionalLogs = !calculatorConfiguration.PostSimulatedHistory ? [] : aggregatedLog.GetExtraLogs();
      setCurrentLog([aggregatedLog, ...additionalLogs]);
      setBackdropOpened(false);
      scrollToLog();
    }, 100);
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: () => Math.max.apply(Math, Object.values(theme.zIndex)) + 1 })}
        open={backdropOpened}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5">
              Jewels in the Void battle simulator.
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={1} columns={26}>
        <Grid size={{ xs: 26, sm: 12, md: 8 }}>
          <FullArmyCard armyTitle={"Attacking forces"} army={attackerArmy} config={calculatorConfiguration} onChange={army => setAttackerArmy(army)} />
        </Grid>
        <Grid size={{ xs: 26, sm: 2, md: 1 }} justifyContent="center">
          <Tooltip title="Swap armies">
            <IconButton
              aria-label="wap armies"
              onClick={(ev) => {
                const attackerArmyTemp = attackerArmy;
                const defenderArmyTemp = defenderArmy
                setAttackerArmy(defenderArmyTemp);
                setDefenderArmy(attackerArmyTemp);
                ev.currentTarget.blur();
              }}>
              {isUnderSmallSized ? <SwapVertIcon fontSize='large'></SwapVertIcon> : <SwapHorizIcon fontSize={isMediumSized ? "small" : "medium"} />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 26, sm: 12, md: 8 }}>
          <FullArmyCard armyTitle={"Defending forces"} army={defenderArmy} config={calculatorConfiguration} onChange={army => setDefenderArmy(army)} />
        </Grid>
        <Grid size={{ xs: 26, sm: 0, md: 1 }}>

        </Grid>
        <Grid size={{ xs: 26, sm: 26, md: 8 }}>
          <Typography variant="h5">Configuration:</Typography>
          <Box>
            <ConfigurationEditor config={calculatorConfiguration} onChange={setConfiguration} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>Additional controls</AccordionSummary>
              <AccordionDetails>
              <ButtonGroup variant="contained">
                <Button variant="contained" onClick={() =>{
                  setAttackerArmy({...attackerArmy, units: GenerateRandomSetOfUnits()})
                }}>Generate attacker</Button>
                <Button variant="contained" onClick={() =>{
                  setDefenderArmy({...defenderArmy, units: GenerateRandomSetOfUnits()})
                }}>Generate defender</Button>
            </ButtonGroup>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
              <Button variant="contained" onClick={runSingleSimulation}>Run battle</Button>
              <Button variant="contained" onClick={runMultiSimulation}>Simulate results</Button>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid size={26} ref={logRef}>
          <Typography variant="h5">Battle results:</Typography>
          {currentLog.length > 0 && <FullBattleLogDisplay logs={currentLog} />}
        </Grid>
      </Grid>
    </>
  )
}

export default App

