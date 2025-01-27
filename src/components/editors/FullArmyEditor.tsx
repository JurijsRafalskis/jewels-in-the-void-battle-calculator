import { Typography, Box, ButtonGroup, Button, Tooltip, IconButton, Badge, Dialog, CardContent, Card, CardActions } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { CalculateTotalArmyStats, GenerateDescriptiveArmyName } from "../../buisnessLogic/ArmyTotals";
import AddFromTemplateModal from "../controls/AddFromTemplateModal";
import UnitCardList from "../display/ArmyCardList";
import { UnitCard } from "../display/UnitCard";
import { IBattleConfiguration } from "../../model/BattleConfiguration";
import { IUnit } from "../../model/armyComposition/Unit";
import { CreateEmptyUnit } from "../../configuration/InitialUnitValues";
import HeroEditor from "./HeroForm";
import { IArmyStack } from "../../model/armyComposition/ArmyStack";
import InputIcon from '@mui/icons-material/Input';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { DndContext, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { useRef, useState } from "react";
import { IArmy } from "../../model/armyComposition/Army";
import { CSS } from '@dnd-kit/utilities';

export interface IFullArmyStackCardProps {
    cardTitle: string;
    armyStack: IArmyStack;
    config: IBattleConfiguration
    onChange(army: IArmyStack): void
}

export function FullArmyStackCard(props: IFullArmyStackCardProps) {
    const [openStackEditor, setOpenStackEditor] = useState(false);
    const propogateUnitChanges = (units: IUnit[]) => {
        const newArmyStack: IArmyStack = {
            ...props.armyStack,
            activeArmy: {
                ...props.armyStack.activeArmy,
                units: units
            }
        };
        props.onChange(newArmyStack);
    }

    return <>
        <Typography variant="h5">{props.cardTitle}</Typography>
        <Box sx={{ margin: "10px 0 25px 0" }}>
            <Tooltip title="Put current army into stack">
                <span>
                    <IconButton
                        aria-label="Put current army into stack"
                        onClick={ev => {
                            ev.currentTarget.blur();
                            let newStack: IArmyStack = {
                                stack: [props.armyStack.activeArmy, ...props.armyStack.stack],
                                activeArmy: {
                                    units: []
                                }
                            };
                            props.onChange(newStack);
                        }}
                    >
                        <InputIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            {/*<Tooltip title="Edit stack">*/}
            <span>
                <IconButton
                    aria-label="Edit stack"
                    onClick={ev => {
                        ev.currentTarget.blur();
                        setOpenStackEditor(true);
                    }}
                    disabled={props.armyStack.stack.length < 1 || (props.armyStack.stack.length < 2 && props.armyStack.activeArmy.units.length == 0)}
                >
                    <Badge badgeContent={props.armyStack.stack.length}>
                        <ModeEditIcon fontSize="small" />
                    </Badge>
                </IconButton>
                <Dialog open={openStackEditor}>
                    <Box sx={{ overflowY: "scroll", maxHeight: "90%" }}>
                        <ArmyStackDragNDropControl
                            {...props}
                            onChange={(stack) => {
                                setOpenStackEditor(false);
                                props.onChange(stack)
                            }}
                            onClose={() => setOpenStackEditor(false)}
                        />
                    </Box>
                </Dialog>
            </span>
            {/*</Tooltip>*/}
            <Tooltip title="Clean stack">
                <span>
                    <IconButton
                        aria-label="Clean stack"
                        disabled={props.armyStack.stack.length == 0}
                        onClick={ev => {
                            ev.currentTarget.blur();
                            let newStack: IArmyStack = {
                                stack: [],
                                activeArmy: props.armyStack.activeArmy
                            };
                            props.onChange(newStack);
                        }}
                    >
                        <CancelPresentationIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
        <Box sx={{ margin: "10px 0 25px 0" }}>
            <HeroEditor hero={props.armyStack.activeArmy.hero} onChange={h => {
                props.onChange({
                    ...props.armyStack,
                    activeArmy: {
                        ...props.armyStack.activeArmy,
                        hero: h
                    }
                });
            }} />
        </Box>
        {(props.armyStack.activeArmy.units.length > 1 || props.armyStack.activeArmy.hero) && <>
            <Typography variant="h5">Total:</Typography>
            <UnitCard unit={CalculateTotalArmyStats(props.armyStack.activeArmy, props.config)} renderActions={{ edit: false, remove: false }} />
            <Typography variant="h5">Units:</Typography>
        </>}
        <UnitCardList units={props.armyStack.activeArmy.units} onChange={propogateUnitChanges} />
        <Box sx={{ margin: "25px 0 25px 0" }}>
            <ButtonGroup variant="contained">
                <Button variant="contained" onClick={() => {
                    const newUnitsSet = props.armyStack.activeArmy.units.map(u => u);
                    newUnitsSet.push(CreateEmptyUnit());
                    propogateUnitChanges(newUnitsSet);
                }}>Add Blank</Button>
                <AddFromTemplateModal onSelect={(newUnit) => {
                    const newUnitsSet = props.armyStack.activeArmy.units.map(u => u);
                    newUnitsSet.push(newUnit);
                    propogateUnitChanges(newUnitsSet);
                }} />
            </ButtonGroup>
        </Box>
    </>
}

export interface IArmyStackDragNDropControlProps {
    armyStack: IArmyStack;
    onChange(army: IArmyStack): void;
    onClose(): void;
    config: IBattleConfiguration
}

export function ArmyStackDragNDropControl(props: IArmyStackDragNDropControlProps) {
    const prepareArmies = () => [props.armyStack.activeArmy, ...props.armyStack.stack].map(army => {
        return { ...CalculateTotalArmyStats(army, props.config), Title: GenerateDescriptiveArmyName(army) };
    });
    const [armyState, setArmyState] = useState(prepareArmies());
    const refArray = useRef(armyState.map(a => a.Metadata?.Key));
    const keys: string[] = armyState.map(unit => unit.Metadata?.Key ?? "");
    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setArmyState((armyList) => {
                const oldIndex = armyList.findIndex(unit => unit.Metadata?.Key == active.id);
                const newIndex = armyList.findIndex(unit => unit.Metadata?.Key == over.id);
                return arrayMove(armyList, oldIndex, newIndex);
            });
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 10,
          },
        }),
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
      )

    const actionSet = <>
        <Button size="small" onClick={() => {
            let existingUnits = [props.armyStack.activeArmy, ...props.armyStack.stack];
            let newArmy: IArmy[] = [];
            if (armyState.length > 1) {
                for (let i = 1; i < armyState.length; i++) {
                    newArmy.push(existingUnits[refArray.current.findIndex(k => k == armyState[i].Metadata?.Key)]);
                }
            }

            let newStack: IArmyStack = {
                activeArmy: armyState.length > 0 ? existingUnits[refArray.current.findIndex(k => k == armyState[0].Metadata?.Key)] : { units: [] },
                stack: newArmy
            }
            props.onChange(newStack);
        }}>Save</Button>
        <Button size="small" onClick={props.onClose}>Close</Button>
    </>
    return <Card>
        <CardActions>
            {actionSet}
        </CardActions>
        <CardContent>
            <DndContext
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={keys}
                >
                    <Grid container spacing={1} columns={12}>
                        {armyState.map((unit, index) => {
                            let key = unit.Metadata?.Key;
                            return <UnitDragNDropObject
                                key={key}
                                unit={unit}
                                firstItem={index == 0}
                                onChange={() => {
                                    //For some reason, one must spam this button for it to go through.
                                    let newArmyState = [...armyState];
                                    newArmyState.splice(newArmyState.findIndex(army => army.Metadata?.Key == key), 1);
                                    setArmyState(newArmyState);
                                }}
                            />
                        })}
                    </Grid>
                </SortableContext>
            </DndContext>
        </CardContent>
        <CardActions>
            {actionSet}
        </CardActions>
    </Card>
}

interface IUnitDragNDropObjectProps {
    unit: IUnit;
    firstItem?:boolean;
    onChange?(unitProps: IUnit | null): void;
}

function UnitDragNDropObject({firstItem = false, ...props}: IUnitDragNDropObjectProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.unit.Metadata?.Key ?? "" });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    let key = props.unit.Metadata?.Key;

    return <Grid
        size={{ xs: 12, sm: 6, md: 4 }}
        ref={setNodeRef}
        style={dndStyle}
        sx={{minWidth:"250px"}}
        {...attributes}
        {...listeners}>
        <UnitCard
            backgroundColorOverride={firstItem ? "beige" : ""}
            unit={props.unit}
            renderActions={{ edit: false, remove: true }}
            onChange={props.onChange}
        />
    </Grid>
}
