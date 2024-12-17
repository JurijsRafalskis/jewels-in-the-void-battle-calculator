import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

export interface IFullBattleLogDisplayProps {
    logs: string[];
}

function FullBattleLogDisplay(props: IFullBattleLogDisplayProps) {
    return (
        <>
            {props.logs.map(l => (
                <Box>
                    <Typography>
                        {l}
                    </Typography>
                </Box>
            ))}
        </>
    )
}

export default FullBattleLogDisplay;