import { Typography, Box, ButtonGroup, Button } from "@mui/material";
import { CalculateTotalArmyStats } from "../buisnessLogic/ArmyTotals";
import { CreateEmptyUnit } from "../configuration/InitialValues";
import { IArmy } from "../model/armyComposition/Army";
import AddFromTemplateModal from "./AddFromTemplateModal";
import UnitCardList from "./ArmyCardList";
import UnitCard from "./UnitCard";
import { IBattleConfiguration } from "../model/BattleConfiguration";
import { IUnit } from "../model/armyComposition/Unit";
import HeroEditor from "./HeroForm";

export interface IFullArmyCardProps {
    armyTitle: string;
    army: IArmy;
    config:IBattleConfiguration
    onChange(army: IArmy): void
}

export function FullArmyCard(props: IFullArmyCardProps) {
    const propogateUnitChanges = (units:IUnit[]) =>{
        const newArmyUnits = {
            ...props.army,
            units: units
        };
        props.onChange(newArmyUnits);
    }

    return <>
        <Typography variant="h5">{props.armyTitle}</Typography>
        <Box sx={{ margin: "10px 0 25px 0" }}>
            <HeroEditor hero={props.army.hero} onChange={h => {
                props.onChange({
                    ...props.army,
                    hero: h
                });
            }}/>
        </Box>
        {(props.army.units.length > 1 || props.army.hero) && <>
            <Typography variant="h5">Total:</Typography>
            <UnitCard unit={CalculateTotalArmyStats(props.army, props.config)} renderActions={false} />
            <Typography variant="h5">Units:</Typography>
        </>}
        <UnitCardList units={props.army.units} onChange={propogateUnitChanges} />
        <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
                <Button variant="contained" onClick={() => {
                    const newUnitsSet = props.army.units.map(u => u);
                    newUnitsSet.push(CreateEmptyUnit());
                    propogateUnitChanges(newUnitsSet);
                }}>Add Blank</Button>
                <AddFromTemplateModal onSelect={(newUnit) => {
                    const newUnitsSet = props.army.units.map(u => u);
                    newUnitsSet.push(newUnit);
                    propogateUnitChanges(newUnitsSet);
                }} />
            </ButtonGroup>
        </Box>
        
    </>
}