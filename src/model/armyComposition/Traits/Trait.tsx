import { ReactElement } from "react";
import IKeyable from "../../Keyable";

export interface ITrait extends IKeyable {
    Title:string;
    Description:string;
    createEditForm():ReactElement;
    createTooltip():ReactElement;
}