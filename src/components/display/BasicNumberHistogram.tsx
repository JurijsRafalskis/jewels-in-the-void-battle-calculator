import { ReactNode, useMemo, useRef, useState } from "react";
import { NumberKeyedDictionary } from "../../structures/Dictionaries";
import Chart from "react-google-charts";
import { GenerateKey } from "../../utils/GenericUtilities";
import { Box, Popover, PopoverOrigin } from "@mui/material";

const referenceSize = 230;

export interface IBasicNumberHistogramProps {
    title?:string;
    xLabel?:string;
    yLabel?:string;
    data:NumberKeyedDictionary<number>;
    normalize?:boolean;
}

export interface IBasicNumberHistogramHoverProps extends IBasicNumberHistogramProps {
    children: ReactNode;
}

export function BasicNumberHistogramHover({ normalize:boolean = false, ...props }:IBasicNumberHistogramHoverProps){
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const popoverOpen = Boolean(anchorEl);
    const id = useMemo(() => "HistogramPopoverId_" + GenerateKey(), []);
    let originCondition = window.scrollY + window.innerHeight - (anchorEl?.getBoundingClientRect().bottom ?? 0);
    let anchorOrigin:PopoverOrigin = (originCondition > referenceSize) ? {
        vertical: 'bottom',
        horizontal: 'right',
    } : {
        vertical: 'top',
        horizontal: 'right',
    };

    let transformOrigin:PopoverOrigin = (originCondition > referenceSize) ? {
        vertical: 'top',
        horizontal: 'left',
    } : {
        vertical: 'bottom',
        horizontal: 'left',
    };

    return <>
        <Box
            component="span"
            onMouseEnter={e => setAnchorEl(e.currentTarget)}
            onMouseLeave={e => setAnchorEl(null)}
            aria-owns={popoverOpen ? id : undefined}
            aria-haspopup="true"
        >
            {props.children}
        </Box>
        <Popover
            id={id}
            open={popoverOpen}
            anchorEl={anchorEl}
            sx={{ pointerEvents: 'none' }}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            disableAutoFocus={true}
        >
            <Box sx={{height: referenceSize + "px"}}>
                <BasicNumberHistogram normalize {...props}/>
            </Box>
        </Popover>
    </>
}

export function BasicNumberHistogram(props:IBasicNumberHistogramProps) {
    const transformData = () =>{
        let normalizationValue = 1;
        if(props.normalize){
            normalizationValue = 0;
            for(let index in props.data){
                normalizationValue += props.data[index];
            }
        }
        let data:Array<Array<any>> = [[props.xLabel, props.yLabel]];
        for(let index in props.data){
            data.push([index, props.data[index] / normalizationValue]);
        }
        return data;
    }
    const data = useMemo(() => transformData(), [props.data]);

    const options = {
        curveType: "none",
        title: props.title,
        legend: { position: "bottom" },
    };

    return <Chart
        chartType="LineChart"
        width="200px"
        height="200px"
        data={data}
        options={options}
    />
}