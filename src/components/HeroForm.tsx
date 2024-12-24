import { Button, Card, CardActions, CardContent, Dialog, Divider, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { Hero } from "../model/armyComposition/Hero";
import { BattleFieldModifierTableContent } from "./BattleFieldModiffierEditor";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useState } from "react";
import { GenerateKey } from "../utils/GenericUtilities";
import { GetHeroList } from "../configuration/InitialValues";
import { UncontrolledLimitedIntegerNumberField } from "./ControlledIntegerNumberField";
import { BlankHero } from "../configuration/InitialHeroValues";
import { TraitDisplay } from "./TraitPicker";

export interface IHeroEditorProps {
    hero?: Hero,
    onChange(hero: Hero | undefined): void;
}

export default function HeroEditor(props: IHeroEditorProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [buttonId] = useState("AddHeroButton_" + GenerateKey())
    const [editFormOpen, setEditFormOpen] = useState(false);

    return <>
        {!props.hero ?
            <>
                <Button startIcon={<AddCircleOutlineIcon />} id={buttonId} onClick={(e) => setAnchorEl(e.currentTarget)}>Add hero</Button>
                <Menu anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                    MenuListProps={{
                        'aria-labelledby': buttonId,
                    }
                    }>
                    <MenuItem key={"Empty"} onClick={() => {
                        setAnchorEl(null);
                        props.onChange(BlankHero());
                    }}>
                        <Typography>Add blank</Typography>
                    </MenuItem>
                    <Divider />
                    {GetHeroList().map((hero, index) => {
                        return <MenuItem key={hero.getKey()} onClick={() => {
                            setAnchorEl(null);
                            props.onChange(hero);
                        }}>
                            <Typography>{hero.Title}</Typography>
                        </MenuItem>
                    })}
                </Menu>
            </>
            :
            <Card variant="outlined">
                <CardContent>
                    <table className="statsCardTable">
                        <tbody>
                            <tr>
                                <td>Hero name:</td>
                                <td>{props.hero.Title}</td>
                            </tr>
                            <BattleFieldModifierTableContent modifier={props.hero} shouldRenderWrapperTable={false}/>
                            {props.hero.Traits && props.hero.Traits.length > 0 && <tr>
                                <td>Traits:</td>
                                <td><TraitDisplay traits={props.hero.Traits}/></td>
                            </tr>}
                        </tbody>
                    </table>
                    <Dialog open={editFormOpen}>
                        <HeroEditForm {...props} onCancel={() => { setEditFormOpen(false) }} onChange={(h) => {
                            setEditFormOpen(false);
                            props.onChange(h);
                        }} />
                    </Dialog>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => { setEditFormOpen(true) }}>Edit</Button>
                    <Button size="small" onClick={() => { props.onChange(undefined); }}>Remove</Button>
                </CardActions>
            </Card>}
    </>
}

export interface IHeroFormProps extends IHeroEditorProps {
    onCancel(): void;
}

export function HeroEditForm(props: IHeroFormProps) {
    const [hero, setHeroValues] = useState(props.hero ?? BlankHero());

    return <>
        <Card variant="outlined">
            <CardContent>
                {/* Find a way to reuse that? */}
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextField
                                    size="small"
                                    margin="dense"
                                    label="Name"
                                    variant="standard"
                                    defaultValue={hero.Title}
                                    onChange={v => {
                                        //Fixing an issue with missing currentTarget whan called within the setter...
                                        const value = v.currentTarget.value;
                                        setHeroValues(u => { return new Hero({ ...u, Title: value } );})
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Organization"
                                    defaultValue={hero.OrganisationBonus}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, OrganisationBonus: v }); })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Maneuver die"
                                    defaultValue={hero.ManeuverRollBonus}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, ManeuverRollBonus: v }); })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Maneuver static"
                                    defaultValue={hero.ManeuverStaticBonus}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, ManeuverStaticBonus: v }); })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Offensive fire"
                                    defaultValue={hero.FireBonus.Offensive}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, FireBonus: { ...h.FireBonus, Offensive: v } }); })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Defensive fire"
                                    defaultValue={hero.FireBonus.Defensive}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, FireBonus: { ...h.FireBonus, Defensive: v } }); })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Offensive shock"
                                    defaultValue={hero.ShockBonus.Offensive}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, ShockBonus: { ...h.ShockBonus, Offensive: v } }); })}
                                />

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <UncontrolledLimitedIntegerNumberField
                                    label="Defensive shock"
                                    defaultValue={hero.ShockBonus.Defensive}
                                    onChange={v => setHeroValues(h => { return new Hero({ ...h, ShockBonus: { ...h.ShockBonus, Defensive: v } }); })}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => props.onChange(hero)}>Save</Button>
                <Button size="small" onClick={props.onCancel}>Close</Button>
            </CardActions>
        </Card>
    </>
}

