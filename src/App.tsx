import { useState } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { IUnit } from './model/armyComposition/Unit'
import ArmyCardList from './components/ArmyCardList';
import { GetDefaultAttackerComposition, GetDefaultDefenderComposition, GetDefaultConfig, CreateEmptyUnit } from "./constants/InitialValues";
import ConfigurationEditor from './components/ConfigurationEditor';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import UnitCard from './components/UnitCard';
import { CalculateTotalArmyStats } from "./buisnessLogic/ArmyTotals";

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(GetDefaultConfig());
  const [attackerArmy, setAttackerArmy] = useState<IUnit[]>(GetDefaultAttackerComposition());
  const [defenderArmy, setDefenderArmy] = useState<IUnit[]>(GetDefaultDefenderComposition());
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <div className="TitleCardDiv">
            <h1>Jewels in the Void battle simulator.</h1>
          </div>
        </Grid>
        <Grid size={4}>
          <div className="AttackerArmyEditorDiv">
            <label><h3>Attacking forces:</h3></label>
            <ArmyCardList units={attackerArmy} onChange={setAttackerArmy} />
            <Box sx={{margin:"25px 0 25px 0"}}>
              <ButtonGroup variant="contained">
                <Button variant="contained" onClick={() => {
                  const newAttacker = attackerArmy.map(u => u);
                  newAttacker.push(CreateEmptyUnit());
                  setAttackerArmy(newAttacker);
                }}>Add Blank</Button>
                <Button variant="contained" disabled={true}>Add Template</Button>
              </ButtonGroup>
            </Box>
            {attackerArmy.length > 1 && <UnitCard unit={CalculateTotalArmyStats(attackerArmy, calculatorConfiguration)} renderActions={false} />}
          </div>
        </Grid>
        <Grid size={4}>
          <div className="DefenderArmyEditorDiv">
            <label><h3>Defending forces:</h3></label>
            <ArmyCardList units={defenderArmy} onChange={(newUnits) => setDefenderArmy(newUnits)} />
            <Box sx={{margin:"25px 0 25px 0"}}>
              <ButtonGroup variant="contained">
                <Button variant="contained" onClick={() => {
                  const newDefender = defenderArmy.map(u => u);
                  newDefender.push(CreateEmptyUnit());
                  setDefenderArmy(newDefender);
                }}>Add Blank</Button>
                <Button variant="contained" disabled={true}>Add Template</Button>
              </ButtonGroup>
            </Box>
            {defenderArmy.length > 1 && <UnitCard unit={CalculateTotalArmyStats(defenderArmy, calculatorConfiguration)} renderActions={false} />}
          </div>
        </Grid>
        <Grid size={4}>
            <label><h3>Battle configuration:</h3></label>
            <Box>
              <ConfigurationEditor config={calculatorConfiguration} onChange={setConfiguration} />
            </Box>
            <Box sx={{margin:"25px 0 25px 0"}}>
              <ButtonGroup variant="contained">
                <Button variant="contained">Run battle</Button>
                <Button variant="contained" disabled={true}>Simulate results</Button>
              </ButtonGroup>
           </Box>
        </Grid>
        <Grid size={12}>
          <div className="ResultsDiv"></div>
        </Grid>
      </Grid>
    </>
  )
}

export default App
