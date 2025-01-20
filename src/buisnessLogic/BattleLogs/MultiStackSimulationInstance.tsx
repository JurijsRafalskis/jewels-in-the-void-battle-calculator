import { Box } from "@mui/material";
import { IUnit } from "../../model/armyComposition/Unit";
import { IBattleConfiguration } from "../../model/BattleConfiguration";
import { BattleResult, BattleRole, IBattleContext } from "../../model/BattleStructure";
import { NumberKeyedDictionary } from "../../structures/Dictionaries";
import { GenerateKey } from "../../utils/GenericUtilities";
import { PostBattleRevitalizationOfUnit } from "../ArmyTotals";
import { ILogInstance } from "./GenericLogInstance";
import { ConditionAccumulator } from "./MultiSimulationLogInstance";
import { BasicNumberHistogramHover } from "../../components/display/BasicNumberHistogram";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import UnitHover from "../../components/display/UnitHover";
import FlashOnIcon from '@mui/icons-material/FlashOn';

export class MultiStackSimulationLog implements ILogInstance {
    #key:string;
    #config:IBattleConfiguration;
    #opposition:IUnit[];
    #mainCombatantRole:BattleRole;
    #mainCombatantHealth:ConditionAccumulator;
    #victoryDictionary:NumberKeyedDictionary<number> = {};
    #organisationChangeDictionary:NumberKeyedDictionary<number> = {};
    #organisationGainTotal:number = 0;
    #totalCount:number = 0;
    #personalDestructionsCount:number = 0;
    #initalUnitState:IUnit;


    constructor(config:IBattleConfiguration, opposition:IUnit[], mainCombatantRole:BattleRole, initalUnitState:IUnit) {
        this.#key = GenerateKey();
        this.#config = config;
        this.#opposition = opposition;
        this.#mainCombatantRole = mainCombatantRole;
        this.#mainCombatantHealth = new ConditionAccumulator(mainCombatantRole, false);
        this.#initalUnitState = initalUnitState;
    }

    RegisterResult(contexts:IBattleContext[]){
        this.#totalCount++;
        let lastContext = contexts[contexts.length - 1];
        let finalUnitState = this.#mainCombatantRole == BattleRole.Attacker ? lastContext.attackerCurrentState : lastContext.defenderCurrentState;
        let totalVictoryCondition = this.#mainCombatantRole == BattleRole.Attacker ? BattleResult.AttackersVictory : BattleResult.DefendersVictory;
        this.#mainCombatantHealth.Accumulate(lastContext);
        let victoryCount = contexts.filter(c => c.battleResult == totalVictoryCondition).length;
        if(!this.#victoryDictionary[victoryCount]) this.#victoryDictionary[victoryCount] = 1;
        else this.#victoryDictionary[victoryCount]++;
        if(finalUnitState.Health == 0) this.#personalDestructionsCount++;
        let postFinalUnitStats = PostBattleRevitalizationOfUnit(this.#initalUnitState, finalUnitState);
        let organisationChange = postFinalUnitStats.Organization - this.#initalUnitState.Organization;
        if(!this.#organisationChangeDictionary[organisationChange]) this.#organisationChangeDictionary[organisationChange] = 1;
        else this.#organisationChangeDictionary[organisationChange]++;
        this.#organisationGainTotal += organisationChange;
    }

    GetFormattedLogElement(): JSX.Element {
        return <>
            <Box sx={{marginBottom:"15px"}}>Simulating {BattleRole[this.#mainCombatantRole]}'s battle against an army stack.</Box>
            <Box>Total simulated battles: {this.#totalCount}.</Box>
            <Box>
                <UnitHover unit={this.#initalUnitState}>{BattleRole[this.#mainCombatantRole]}'s initial stats.<FlashOnIcon fontSize={"inherit"}/></UnitHover>{' '}
                Opposition initial stats: {this.#opposition.map(o => <UnitHover unit={o} key={o.Metadata?.Key ?? ""}><FlashOnIcon fontSize={"inherit"}/></UnitHover>)}
            </Box>
            {Object.keys(this.#victoryDictionary).reverse().map(key => {
                let parsedKey = Number(key)
                return <Box key={key}>Ammount of {key}x victories: {this.#victoryDictionary[parsedKey]}/{Math.round(this.#victoryDictionary[parsedKey] * 100 / this.#totalCount)}%</Box>
            })}
            <Box>Ammount of fights ending in {BattleRole[this.#mainCombatantRole]}'s' army destruction: {this.#personalDestructionsCount}/{Math.round(this.#personalDestructionsCount * 100 / this.#totalCount)}%</Box>
            {this.#mainCombatantHealth.GetFormattedResults()}
            <Box sx={{marginBottom:"10px"}}>
                Average change in organisation: {Math.round(this.#organisationGainTotal * 100 / this.#totalCount) / 100}
                <BasicNumberHistogramHover
                    title="Organisation change"
                    data={this.#organisationChangeDictionary}
                    xLabel="Organisation change"
                    yLabel="Probability density"
                    normalize={true}
                >
                    <AccountTreeIcon fontSize="small"/>
                </BasicNumberHistogramHover>
            </Box>
        </>;
    }

    getKey(): string {
        return this.#key;
    }
}