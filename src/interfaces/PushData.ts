// (C) 2007-2019 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { IColorAssignment, IColorPalette } from "./Config";

export interface IColorsData {
    colorAssignments: IColorAssignment[];
    colorPalette: IColorPalette;
}

export type DrillableItemType = "measure";

export interface IDrillableItemPushData {
    type: DrillableItemType;
    localIdentifier: AFM.Identifier;
    title: string;
}

export interface IPushData {
    result?: Execution.IExecutionResponses;
    properties?: {
        sortItems?: AFM.SortItem[];
        totals?: VisualizationObject.IVisualizationTotal[];
    };
    propertiesMeta?: any;
    colors?: IColorsData;
    supportedDrillableItems?: IDrillableItemPushData[];
}
