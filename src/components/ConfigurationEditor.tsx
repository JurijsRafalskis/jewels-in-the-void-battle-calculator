import React from 'react';
import { IBattleConfiguration }from '../model/BattleConfiguration';

export interface ConfigurationEditorProps {
    config:IBattleConfiguration;
    onChange(config:IBattleConfiguration):void;
}

export class ConfigurationEditor extends React.Component<ConfigurationEditorProps> {
    render() {
        return (
          <div>
            <table>
                <tr>
                    <td>Simulation Itterations: </td>
                    <td>{this.props.config.SimulatedItterationsCount}</td>
                </tr>
            </table>
          </div>
        );
      }
}