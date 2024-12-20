import { Typography, Box, ButtonGroup, Button } from "@mui/material";
import { CalculateTotalArmyStats } from "../buisnessLogic/ArmyTotals";
import { CreateEmptyUnit } from "../constants/InitialValues";
import { IArmy } from "../model/armyComposition/Army";
import AddFromTemplateModal from "./AddFromTemplateModal";
import UnitCardList from "./ArmyCardList";
import UnitCard from "./UnitCard";
import { IBattleConfiguration } from "../model/BattleConfiguration";
import { IUnit } from "../model/armyComposition/Unit";

export interface IFullArmyCardProps {
    armyTitle: string;
    army: IArmy;
    config:IBattleConfiguration
    onChange(army: IArmy): void
}

export function FullArmyCard(props: IFullArmyCardProps) {
    const propogateUnitChanges = (units:IUnit[]) =>{
        const newArmy = structuredClone(props.army); //Exclude the units?
        newArmy.units == units;
        props.onChange(newArmy);
    }

    return <>
        <Typography variant="h5">{props.armyTitle}</Typography>
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
        {props.army.units.length > 1 && <>
            <Typography variant="h5">Total:</Typography>
            <UnitCard unit={CalculateTotalArmyStats(props.army, props.config)} renderActions={false} />
        </>}
    </>
}