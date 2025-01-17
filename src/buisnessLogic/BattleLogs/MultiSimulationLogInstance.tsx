import { Box } from "@mui/material";
import { IBattleConfiguration } from "../../model/BattleConfiguration";
import { IBattleContext, BattleResult, VictoryType, BattleRole } from "../../model/BattleStructure";
import { GenerateKey } from "../../utils/GenericUtilities";
import { ILogInstance } from "./GenericLogInstance";
import { NumberKeyedDictionary } from "../../structures/Dictionaries";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { BasicNumberHistogramHover } from "../../components/BasicNumberHistogram";
import React from "react";

export class MultiSimulationLog implements ILogInstance{
    #key:string;
    #config:IBattleConfiguration;
    #accumulators:AccumulatorBase[] = [
        new TotalBattlesAccumulator(),
        new VictoryTypeAccumulator(),
        new ConditionAccumulator(BattleRole.Attacker),
        new ConditionAccumulator(BattleRole.Defender)
    ]
    #extraLogs:ILogInstance[] = [];

    constructor(config:IBattleConfiguration){
        this.#key = GenerateKey();
        this.#config = config;
    }

    public RegisterResult(context:IBattleContext){
        for(let index in this.#accumulators){
            this.#accumulators[index].Accumulate(context);
        }
        if(this.#config.PostSimulatedHistory) this.#extraLogs = this.#extraLogs.concat(context.log);
    }

    public getKey(): string {
        return this.#key;
    }

    public GetFormattedLogElement(): JSX.Element {
        return <Box>
           {this.#accumulators.map((a, index) => <React.Fragment key={index}>{a.GetFormattedResults()}</React.Fragment>)}
        </Box>
    }

    public GetExtraLogs(){
        return this.#extraLogs;
    }
}

abstract class AccumulatorBase {
    abstract Accumulate(context:IBattleContext):void;
    abstract GetFormattedResults() : JSX.Element;
}

class TotalBattlesAccumulator extends AccumulatorBase {
    #totalCount:number = 0;
    Accumulate(context: IBattleContext): void {
        this.#totalCount++;
    }
    GetFormattedResults(): JSX.Element {
        return  <Box sx={{marginBottom:"15px"}}>Total simulated battles: {this.#totalCount}.</Box>;
    }
}


class ConditionAccumulator extends AccumulatorBase{
    #minimumHealth:number = Number.MAX_SAFE_INTEGER;
    #maximumHealth:number = 0;
    #totalHealthSum:number = 0;
    #healthDictionary:NumberKeyedDictionary<number> = {};
    #maxMorale:number = 0;
    #minMorale:number = Number.MAX_SAFE_INTEGER;
    #totalMorale:number = 0;
    #moraleDictionary:NumberKeyedDictionary<number> = {};
    #totalCount:number = 0;
    #role:BattleRole;

    constructor(role:BattleRole){
        super();
        this.#role = role;
    }

    Accumulate(context: IBattleContext): void {
        this.#totalCount++;
        let currentState = this.#role == BattleRole.Attacker ? context.attackerCurrentState : context.defenderCurrentState;
        this.#totalHealthSum += currentState.Health;
        if(!this.#healthDictionary[currentState.Health]) {
            this.#healthDictionary[currentState.Health] = 1;
        } 
        else {
            this.#healthDictionary[currentState.Health]++;
        }
        this.#minimumHealth = this.#minimumHealth > currentState.Health ? currentState.Health : this.#minimumHealth;
        this.#maximumHealth = this.#maximumHealth < currentState.Health ? currentState.Health : this.#maximumHealth;
        this.#totalMorale += currentState.Morale;
        if(!this.#moraleDictionary[currentState.Morale]) {
            this.#moraleDictionary[currentState.Morale] = 1;
        } 
        else {
            this.#moraleDictionary[currentState.Morale]++;
        }
        this.#minMorale = this.#minMorale > currentState.Morale ? currentState.Morale : this.#minMorale;
        this.#maxMorale = this.#maxMorale < currentState.Morale ? currentState.Morale : this.#maxMorale;
    }

    GetFormattedResults(): JSX.Element {
        return  <>
            <Box>
                {BattleRole[this.#role]}'s average remaining health: {Math.round(this.#totalHealthSum * 100 / this.#totalCount) / 100}
                <BasicNumberHistogramHover
                    title="Health"
                    data={this.#healthDictionary}
                    xLabel="Health"
                    yLabel="Probability density"
                    normalize={true}
                >
                    <FavoriteIcon fontSize="small"/>
                </BasicNumberHistogramHover>
            </Box>
            <Box>{BattleRole[this.#role]}'s minimum remaining health: {this.#minimumHealth}</Box>
            <Box>{BattleRole[this.#role]}'s maximum remaining health: {this.#maximumHealth}</Box>
            <Box sx={{marginTop:"10px"}}>
                {BattleRole[this.#role]}'s average remaining morale: {Math.round(this.#totalMorale * 100 / this.#totalCount) / 100}
                <BasicNumberHistogramHover
                    title="Morale"
                    data={this.#moraleDictionary}
                    xLabel="Morale"
                    yLabel="Probability density"
                    normalize={true}
                >
                    <FavoriteBorderIcon fontSize="small"/>
                </BasicNumberHistogramHover>
            </Box>
            <Box>{BattleRole[this.#role]}'s minimum remaining morale: {this.#minMorale}</Box>
            <Box>{BattleRole[this.#role]}'s maximum remaining morale: {this.#maxMorale}</Box>
        </>;
    }
}

class VictoryTypeAccumulator extends AccumulatorBase{
    #attackersVictoryThroughDamageCount:number = 0;
    #attackersVictoryThroughMoraleCount:number = 0;
    #defendersVictoryThroughDamageCount:number = 0;
    #defendersVictoryThroughMoraleCount:number = 0;
    #stalemateCount:number = 0;
    #mutualDestructionCount:number = 0;
    #totalCount:number = 0;
    constructor(){
        super();
    }

    Accumulate(context: IBattleContext): void {
        this.#totalCount++;
        if(context.battleResult == BattleResult.AttackersVictory && context.victoryType == VictoryType.Destruction) this.#attackersVictoryThroughDamageCount++;
        if(context.battleResult == BattleResult.AttackersVictory && context.victoryType == VictoryType.Morale) this.#attackersVictoryThroughMoraleCount++;
        if(context.battleResult == BattleResult.DefendersVictory && context.victoryType == VictoryType.Destruction) this.#defendersVictoryThroughDamageCount++;
        if(context.battleResult == BattleResult.DefendersVictory && context.victoryType == VictoryType.Morale) this.#defendersVictoryThroughMoraleCount++;
        if(context.battleResult == BattleResult.MutualDestruction) this.#mutualDestructionCount++;
        if(context.battleResult == BattleResult.Stalemate) this.#stalemateCount++;
    }
    GetFormattedResults(): JSX.Element {
        return <>
            <Box>Attacker's victories through damage: {this.#attackersVictoryThroughDamageCount}/{Math.round(this.#attackersVictoryThroughDamageCount * 100 / this.#totalCount)}%.</Box>
            <Box>Attacker's victories through morale: {this.#attackersVictoryThroughMoraleCount}/{Math.round(this.#attackersVictoryThroughMoraleCount * 100 / this.#totalCount)}%.</Box>
            <Box>Defender's victories through damage: {this.#defendersVictoryThroughDamageCount}/{Math.round(this.#defendersVictoryThroughDamageCount * 100 / this.#totalCount)}%.</Box>
            <Box>Defender's victories through morale: {this.#defendersVictoryThroughMoraleCount}/{Math.round(this.#defendersVictoryThroughMoraleCount * 100 / this.#totalCount)}%.</Box>
            <Box>Stalemates: {this.#stalemateCount}/{Math.round(this.#stalemateCount * 100 / this.#totalCount)}%.</Box>
            <Box>Mutual destruction: {this.#mutualDestructionCount}/{Math.round(this.#mutualDestructionCount * 100 / this.#totalCount)}%.</Box>
        </>
    }
}


