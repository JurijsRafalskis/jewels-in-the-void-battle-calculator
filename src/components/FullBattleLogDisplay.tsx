import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { LogInstance } from "../buisnessLogic/BattleLogs/GenericLogInstance";

export interface IFullBattleLogDisplayProps {
    logs: LogInstance[];
}

function FullBattleLogDisplay(props: IFullBattleLogDisplayProps) {
    return (
        <>
            {props.logs.map(l => (
                <Box key={l.GetKey()}>
                    {l.GetFormattedLogElement()}
                </Box>
            ))}
        </>
    )
}

export default FullBattleLogDisplay;