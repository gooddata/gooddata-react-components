// (C) 2019 GoodData Corporation
import { IPointData } from "./Config";
import { Execution } from "@gooddata/typings";

export type IUnwrappedAttributeHeadersWithItems = Execution.IAttributeHeader["attributeHeader"] & {
    items: Execution.IResultAttributeHeaderItem[];
};

export interface IValidationResult {
    dataTooLarge: boolean;
    hasNegativeValue: boolean;
}

export type ITooltipFactory = (point: IPointData, percentageValue?: number) => string;
