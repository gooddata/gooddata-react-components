// (C) 2019-2020 GoodData Corporation
import { AxisType } from "./AxisType";
import { IVisualizationPropertiesContent } from "./Visualization";
import { IPushData } from "../../interfaces/PushData";

export interface IConfigItemSubsection {
    disabled: boolean;
    configPanelDisabled: boolean;
    axis: AxisType;
    properties: IVisualizationPropertiesContent;
    pushData(data: IPushData): void;
}
