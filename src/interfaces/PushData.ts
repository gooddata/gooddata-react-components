// (C) 2007-2020 GoodData Corporation
import { AFM, Execution, VisualizationObject } from "@gooddata/typings";
import { IColorAssignment, IColorPalette } from "./Config";

export interface IColorsData {
    colorAssignments: IColorAssignment[];
    colorPalette: IColorPalette;
}

export type DrillableItemType = "measure";

export interface IAttributeDisplayFormUri {
    attribute: string;
    displayForm: string;
}

export interface IDrillableItemPushData {
    type: DrillableItemType;
    localIdentifier: AFM.Identifier;
    title: string;
    attributes: IAttributeDisplayFormUri[];
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
