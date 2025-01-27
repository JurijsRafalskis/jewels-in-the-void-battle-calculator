import { useState, useRef } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { GetDefaultAttackerComposition, GetDefaultDefenderComposition, GetDefaultConfig, GenerateRandomSetOfUnits } from "./configuration/InitialValues";
import ConfigurationEditor from './components/editors/ConfigurationEditor';
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
import FullBattleLogDisplay from './components/display/FullBattleLogDisplay';
import { ILogInstance, LogInstance } from './buisnessLogic/BattleLogs/GenericLogInstance';
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, CircularProgress, createTheme, IconButton, Link, Menu, MenuItem, Tooltip, useMediaQuery } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { FullArmyStackCard } from './components/editors/FullArmyEditor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IArmyStack } from './model/armyComposition/ArmyStack';
import { SimulateDoubleStackBattles, SimulateSimpleGauntletOfBattles, SimulateComplexGauntletOfBattles, SimulateExtremeCasesOfBattles, SimulateSetOfBattles, SimulateSingleBattle, SimulateSingleGauntlet } from './buisnessLogic/CalculatorService';
import { BattleRole } from './model/BattleStructure';
import React from 'react';
import { IArmy } from './model/armyComposition/Army';
import GitHubIcon from '@mui/icons-material/GitHub';

const defaultTheme = createTheme({});

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(GetDefaultConfig());
  const [attackerArmyStack, setAttackerArmyStack] = useState<IArmyStack>({ activeArmy: GetDefaultAttackerComposition(), stack: [] });
  const [defenderArmyStack, setDefenderArmyStack] = useState<IArmyStack>({ activeArmy: GetDefaultDefenderComposition(), stack: [] });
  const [currentLog, setCurrentLog] = useState<ILogInstance[]>([]);
  const [backdropOpened, setBackdropOpened] = useState(false);
  const [singleSimulationAnchor, setSingleSimulationAnchor] = React.useState<null | HTMLElement>(null);
  const [multiSimulationAnchor, setMultiSimulationAnchor] = React.useState<null | HTMLElement>(null);
  const isUnderSmallSized = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const isOverMediumSized = useMediaQuery(defaultTheme.breakpoints.up("md"));
  const isUnderLargeSized = useMediaQuery(defaultTheme.breakpoints.down("lg"));
  const isMediumSized = isOverMediumSized && isUnderLargeSized;
  const logRef = useRef<any>();

  const scrollToLog = () => {
    setTimeout(() => { logRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 25);
  }

  const runSingleSimulation = async () => {
    setBackdropOpened(true);
    setTimeout(() => {
      setCurrentLog([]);
      let result = SimulateSingleBattle(attackerArmyStack.activeArmy, defenderArmyStack.activeArmy, calculatorConfiguration);
      setCurrentLog(result);
      setBackdropOpened(false);
      scrollToLog();
    }, 0);
  }

  const runSingleStackVsStackSimulation = async () => {
    setBackdropOpened(true);
    setTimeout(() => {
      setCurrentLog([]);
      let result = SimulateDoubleStackBattles(attackerArmyStack, defenderArmyStack, calculatorConfiguration);
      setCurrentLog(result);
      setBackdropOpened(false);
      scrollToLog();
    }, 0);
  }

  const runMultiSimulation = async () => {
    setBackdropOpened(true);
    setTimeout(() => {
      setCurrentLog([]);
      let result = SimulateSetOfBattles(attackerArmyStack.activeArmy, defenderArmyStack.activeArmy, calculatorConfiguration);
      setCurrentLog(result);
      setBackdropOpened(false);
      scrollToLog();
    }, 0);
  }

  const createSingleGauntletStart = (role: BattleRole) => {
    return async () =>{
      setBackdropOpened(true);
      setTimeout( () =>{
        setCurrentLog([]);
        let result = SimulateSingleGauntlet(
          role == BattleRole.Attacker ? attackerArmyStack.activeArmy : defenderArmyStack.activeArmy, 
          role == BattleRole.Attacker ? defenderArmyStack : attackerArmyStack, 
          calculatorConfiguration, 
          role);
        setCurrentLog(result);
        setBackdropOpened(false);
        scrollToLog();
      }, 0);
    }
  }

  const runSingleAttackersGauntlet = createSingleGauntletStart(BattleRole.Attacker);
  const runSingleDefendersGauntlet = createSingleGauntletStart(BattleRole.Defender);

  const createMultiGauntletStart = 
  (
    role: BattleRole, 
    calculation:(mainCombatant:IArmy, opposition:IArmyStack, configuration:IBattleConfiguration, mainCombatantRole:BattleRole)=>ILogInstance[]
  ) => {
    return async () =>{
      setBackdropOpened(true);
      setTimeout( () =>{
        setCurrentLog([]);
        let result = calculation(
          role == BattleRole.Attacker ? attackerArmyStack.activeArmy : defenderArmyStack.activeArmy, 
          role == BattleRole.Attacker ? defenderArmyStack : attackerArmyStack, 
          calculatorConfiguration, 
          role);
        setCurrentLog(result);
        setBackdropOpened(false);
        scrollToLog();
      }, 0);
    }
  }

  const runSimpleMultiAttackersGauntlet = createMultiGauntletStart(BattleRole.Attacker, SimulateSimpleGauntletOfBattles);
  const runSimpleMultiDefendersGauntlet = createMultiGauntletStart(BattleRole.Defender, SimulateSimpleGauntletOfBattles);
  const runComplexMultiAttackersGauntlet = createMultiGauntletStart(BattleRole.Attacker, SimulateComplexGauntletOfBattles);
  const runComplexMultiDefendersGauntlet = createMultiGauntletStart(BattleRole.Defender, SimulateComplexGauntletOfBattles);

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
            <IconButton 
              sx={{"margin-left":"auto"}}
              href="https://github.com/JurijsRafalskis/jewels-in-the-void-battle-calculator"
              target='_blank'
            >
              <GitHubIcon></GitHubIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={1} columns={26}>
        <Grid size={{ xs: 26, sm: 12, md: 8 }}>
          <FullArmyStackCard cardTitle={"Attacking forces"} armyStack={attackerArmyStack} config={calculatorConfiguration} onChange={armyStack => setAttackerArmyStack(armyStack)} />
        </Grid>
        <Grid size={{ xs: 26, sm: 2, md: 1 }} justifyContent="center">
          <Tooltip title="Swap armies">
            <IconButton
              aria-label="Swap armies"
              onClick={(ev) => {
                const attackerArmyTemp = attackerArmyStack;
                const defenderArmyTemp = defenderArmyStack
                setAttackerArmyStack(defenderArmyTemp);
                setDefenderArmyStack(attackerArmyTemp);
                ev.currentTarget.blur();
              }}>
              {isUnderSmallSized ? <SwapVertIcon fontSize='large'></SwapVertIcon> : <SwapHorizIcon fontSize={isMediumSized ? "small" : "medium"} />}
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 26, sm: 12, md: 8 }}>
          <FullArmyStackCard cardTitle={"Defending forces"} armyStack={defenderArmyStack} config={calculatorConfiguration} onChange={armyStack => setDefenderArmyStack(armyStack)} />
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
                  <Button variant="contained" onClick={() => {
                    setAttackerArmyStack({ ...attackerArmyStack, activeArmy: { ...attackerArmyStack.activeArmy, units: GenerateRandomSetOfUnits() } })
                  }}>Generate attacker</Button>
                  <Button variant="contained" onClick={() => {
                    setDefenderArmyStack({ ...defenderArmyStack, activeArmy: { ...defenderArmyStack.activeArmy, units: GenerateRandomSetOfUnits() } })
                  }}>Generate defender</Button>
                </ButtonGroup>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
              <Button variant="contained" onClick={(e) => setSingleSimulationAnchor(e.currentTarget)}>Single battle</Button>
              <Menu
                anchorEl={singleSimulationAnchor}
                open={Boolean(singleSimulationAnchor)}
                onClose={() => setSingleSimulationAnchor(null)}
                MenuListProps={{
                  'aria-labelledby': singleSimulationAnchor?.id,
                }
              }
              >
                 <MenuItem 
                    key={"Single battle"} 
                    onClick={() => {
                      setSingleSimulationAnchor(null)
                      runSingleSimulation();
                    }}>
                      <Typography>Single battle</Typography>
                  </MenuItem>
                  <MenuItem 
                    key={"Attacker vs stack"} 
                    onClick={() => {
                      setSingleSimulationAnchor(null)
                      runSingleAttackersGauntlet();
                    }}>
                      <Typography>Attacker vs stack</Typography>
                  </MenuItem>
                  <MenuItem 
                    key={"Defender vs stack"} 
                    onClick={() => {
                      setSingleSimulationAnchor(null)
                      runSingleDefendersGauntlet();
                    }}>
                      <Typography>Defender vs stack</Typography>
                  </MenuItem>
                  <MenuItem 
                    key={"Stack vs stack"}
                    disabled={true} 
                    onClick={() => {
                      setSingleSimulationAnchor(null)
                      runSingleStackVsStackSimulation();
                    }}>
                      <Typography>Defender's vs stack</Typography>
                  </MenuItem>
              </Menu>
              <Button variant="contained" onClick={(e) => setMultiSimulationAnchor(e.currentTarget)}>Analysis</Button>
              <Menu
                  anchorEl={multiSimulationAnchor}
                  open={Boolean(multiSimulationAnchor)}
                  onClose={() => setMultiSimulationAnchor(null)}
                  MenuListProps={{
                      'aria-labelledby': multiSimulationAnchor?.id
                    }
                  }
              >
              <MenuItem 
                    key={"Battle analisys"} 
                    onClick={() => {
                      setMultiSimulationAnchor(null)
                      runMultiSimulation();
                    }}>
                      <Typography>Battle analisys</Typography>
                  </MenuItem>
                  <MenuItem 
                    key={"Attacker's vs stack simple analisys"} 
                    onClick={() => {
                      setMultiSimulationAnchor(null)
                      runSimpleMultiAttackersGauntlet();
                    }}>
                      <Typography>Attacker's vs stack simple analisys</Typography>
                  </MenuItem>
                  <MenuItem 
                    key={"Defender's vs stack simple analisys"} 
                    onClick={() => {
                      setMultiSimulationAnchor(null)
                      runSimpleMultiDefendersGauntlet();
                    }}>
                      <Typography>Defender's vs stack simple analisys</Typography>
                  </MenuItem>
                  <MenuItem 
                    disabled={true}
                    key={"Attacker's vs stack complex analisys"} 
                    onClick={() => {
                      setMultiSimulationAnchor(null)
                      runComplexMultiAttackersGauntlet();
                    }}>
                      <Typography>Attacker's vs stack complex analisys</Typography>
                  </MenuItem>
                  <MenuItem 
                    disabled={true}
                    key={"Defender's vs stack complex analisys"} 
                    onClick={() => {
                      setMultiSimulationAnchor(null)
                      runComplexMultiDefendersGauntlet();
                    }}>
                      <Typography>Defender's vs stack complex analisys</Typography>
                  </MenuItem>
              </Menu>
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

