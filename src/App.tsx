import { useState } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { IUnit } from './model/armyComposition/Unit'
import ArmyCardList from './components/ArmyCardList';
import { GetDefaultAttackerComposition, GetDefaultDefenderComposition, GetDefaultConfig, CreateEmptyUnit } from "./constants/InitialValues";
import ConfigurationEditor from './components/ConfigurationEditor';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import UnitCard from './components/UnitCard';
import { CalculateTotalArmyStats } from "./buisnessLogic/ArmyTotals";
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AddFromTemplateModal from './components/AddFromTemplateModal';
import FullBattleLogDisplay from './components/FullBattleLogDisplay';
import { IBattleContext } from './model/BattleStructure';
import { BattleCalculator } from './buisnessLogic/BattleCalculator';
import { LogInstance } from './buisnessLogic/BattleLogs/GenericLogInstance';

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(GetDefaultConfig());
  const [attackerArmy, setAttackerArmy] = useState<IUnit[]>(GetDefaultAttackerComposition());
  const [defenderArmy, setDefenderArmy] = useState<IUnit[]>(GetDefaultDefenderComposition());
  const [currentLog, setCurrentLog] = useState<LogInstance[]>([]);

  const runSingleSimulation = () => {
    setCurrentLog([]);
    const calculator = new BattleCalculator(attackerArmy, defenderArmy, calculatorConfiguration);
    const result = calculator.execute();
    setCurrentLog(result.log);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5">
              Jewels in the Void battle simulator.
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Typography variant="h5">Attacking forces:</Typography>
          <ArmyCardList units={attackerArmy} onChange={setAttackerArmy} />
          <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
              <Button variant="contained" onClick={() => {
                const newAttacker = attackerArmy.map(u => u);
                newAttacker.push(CreateEmptyUnit());
                setAttackerArmy(newAttacker);
              }}>Add Blank</Button>
              <AddFromTemplateModal onSelect={(newUnit) => {
                const newAttacker = attackerArmy.map(u => u);
                newAttacker.push(newUnit);
                setAttackerArmy(newAttacker);
              }}/>
            </ButtonGroup>
          </Box>
          {attackerArmy.length > 1 && <>
            <Typography variant="h5">Total:</Typography>
            <UnitCard unit={CalculateTotalArmyStats(attackerArmy, calculatorConfiguration)} renderActions={false} />
          </>}
        </Grid>
        <Grid size={4}>
          <Typography variant="h5">Defending forces:</Typography>
          <ArmyCardList units={defenderArmy} onChange={(newUnits) => setDefenderArmy(newUnits)} />
          <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
              <Button variant="contained" onClick={() => {
                const newDefender = defenderArmy.map(u => u);
                newDefender.push(CreateEmptyUnit());
                setDefenderArmy(newDefender);
              }}>Add Blank</Button>
              <AddFromTemplateModal onSelect={(newUnit) => {
                const newDefender = defenderArmy.map(u => u);
                newDefender.push(newUnit);
                setDefenderArmy(newDefender);
              }}/>
            </ButtonGroup>
          </Box>
          {defenderArmy.length > 1 &&
            <>
              <Typography variant="h5">Total:</Typography>
              <UnitCard unit={CalculateTotalArmyStats(defenderArmy, calculatorConfiguration)} renderActions={false} />
            </>}
        </Grid>
        <Grid size={4}>
          <Typography variant="h5">Battle configuration:</Typography>
          <Box>
            <ConfigurationEditor config={calculatorConfiguration} onChange={setConfiguration} />
          </Box>
          <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
              <Button variant="contained" onClick={runSingleSimulation}>Run battle</Button>
              <Button variant="contained" disabled={true}>Simulate results</Button>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid size={12}>
          <Typography variant="h5">Battle results:</Typography>
          {currentLog.length > 0 && <FullBattleLogDisplay logs={currentLog}/>}
        </Grid>
      </Grid>
    </>
  )
}

export default App
