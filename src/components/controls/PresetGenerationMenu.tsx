import React from "react";
import Button from "@mui/material/Button";
import { Menu, MenuItem, Typography } from '@mui/material';
import { GetPresetConfigs } from "../../configuration/InitialValues";
import { IArmy } from "../../model/armyComposition/Army";

export interface IPresetGenerationMenu {
    title: string;
    callback(army: IArmy): void
}

export function PresetGenerationMenu (props:IPresetGenerationMenu) {
    const [armyPresetAnchor, setArmyPresetAnchor] = React.useState<null | HTMLElement>(null);
    return <>
      <Button variant="contained" onClick={(e) => setArmyPresetAnchor(e.currentTarget)}>{props.title}</Button>
      <Menu
          anchorEl={armyPresetAnchor}
          open={Boolean(armyPresetAnchor)}
          onClose={() => setArmyPresetAnchor(null)}
          MenuListProps={{
            'aria-labelledby': armyPresetAnchor?.id,
          }
          }
        >
          {GetPresetConfigs().map(preset => {
            return <>
              <MenuItem
                  key={preset.presetTitle}
                  onClick={() => {
                    props.callback(preset.presetStackCreation());
                    setArmyPresetAnchor(null);
                  }}
                >
                <Typography>{preset.presetTitle}</Typography>
              </MenuItem>
            </>
          })}
      </Menu>
    </>
  }