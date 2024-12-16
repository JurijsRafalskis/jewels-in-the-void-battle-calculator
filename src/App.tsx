import { useState } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { IUnit } from './model/armyComposition/Unit'
import { ArmyEditor } from './components/ArmyEditor';
import { DefaultAttackerComposition, DefaultDefenderComposition, DefaultConfig } from './constants/initializationValues';
import { ConfigurationEditor } from './components/ConfigurationEditor';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid2';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(DefaultConfig); //Default config
  const [attackerArmy, setAttackerArmy] = useState<IUnit[]>(DefaultAttackerComposition); //Can we use them directly, or must we recreate the variables?
  const [defenderArmy, setDefenderArmy] = useState<IUnit[]>(DefaultDefenderComposition);
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
            <ArmyEditor units={attackerArmy} onChange={units => { }} />
          </div>
        </Grid>
        <Grid size={4}>
        <div className="DefenderArmyEditorDiv">
          <label><h3>Defending forces:</h3></label>
          <ArmyEditor units={defenderArmy} onChange={units => { }} />
        </div>
        </Grid>
        <Grid size={4}>
        <div className="ConfigPanelDiv">
          <label><h3>Battle configuration:</h3></label>
          <div className="ConfigPanelEditorDiv">
            <ConfigurationEditor config={calculatorConfiguration} onChange={newConfig => { }} />
          </div>
          <div className="ControlsDiv">
          <ButtonGroup variant="contained">
            <Button variant="contained">Run battle</Button>
            <Button variant="contained">Simulate results</Button>
          </ButtonGroup>
          </div>
        </div>
        </Grid>
        <Grid  size={12}>
        <div className="ResultsDiv"></div>
        </Grid>
      </Grid>
      {/*}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count} !
        </button>
        <p>
        </p>
      </div>*/}
    </>
  )
}

export default App
