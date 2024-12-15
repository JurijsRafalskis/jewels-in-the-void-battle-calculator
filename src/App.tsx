import { useState } from 'react'
import './App.css'
import { IBattleConfiguration } from './model/BattleConfiguration'
import { IUnit } from './model/armyComposition/Unit'

function App() {
  const [calculatorConfiguration, setConfiguration] = useState<IBattleConfiguration>({}); //Default config
  const [attackerArmy, setAttackerArmy] = useState<IUnit[]>([]);
  const [defenderArmy, setDefenderArmy] = useState<IUnit[]>([]);
  return (
    <>
    <div>
      <h1>Jewels in the Void.</h1>
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
