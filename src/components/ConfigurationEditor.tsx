import React from 'react';
import { IBattleConfiguration }from '../model/BattleConfiguration';
import TextField from '@mui/material/TextField';

export interface ConfigurationEditorProps {
    config:IBattleConfiguration;
    onChange(config:IBattleConfiguration):void;
}

export class ConfigurationEditor extends React.Component<ConfigurationEditorProps> {
    render() {
        return (
          <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <TextField
                                size="small"
                                type="number"
                                margin="dense"
                                label="Simulation Itterations"
                                variant="standard"
                                value={this.props.config.SimulatedItterationsCount}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
        );
      }
}