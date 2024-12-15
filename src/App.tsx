import { useState } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { IUnit } from './model/armyComposition/Unit'
import { ArmyEditor } from './components/ArmyEditor';
import { DefaultAttackerComposition, DefaultDefenderComposition, DefaultConfig } from './constants/initializationValues';
import { ConfigurationEditor } from './components/ConfigurationEditor';

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>(DefaultConfig); //Default config
  const [attackerArmy, setAttackerArmy] = useState<IUnit[]>(DefaultAttackerComposition); //Can we use them directly, or must we recreate the variables?
  const [defenderArmy, setDefenderArmy] = useState<IUnit[]>(DefaultDefenderComposition);
  return (
    <>
    <div className="TitleCardDiv">
      <h1>Jewels in the Void battle simulator.</h1>
    </div>
    <div className="MainControlsDiv">
      <div className="AttackerArmyEditorDiv">
        <label><h3>Attacking forces:</h3></label>
        <ArmyEditor units={attackerArmy} onChange={units => {}}/>
      </div>
      <div className="DefenderArmyEditorDiv">
      <label><h3>Defending forces:</h3></label>
      <ArmyEditor units={defenderArmy} onChange={units => {}}/>
      </div>
      <div className="ConfigPanelDiv">
        <label><h3>Battle configuration:</h3></label>
        <div className="ConfigPanelEditorDiv">
          <ConfigurationEditor config={calculatorConfiguration} onChange={newConfig => {}}/>
        </div>
        <div className="ControlsDiv">
          <button>Run battle</button>
          <button>Simulate results</button>
        </div>
      </div>
      <div className="ResultsDiv"></div>
      
    </div>
      
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
