// (C) 2020 GoodData Corporation

import { Execution } from "@gooddata/typings";

type UnwrappedAttributeHeader = Execution.IAttributeHeader["attributeHeader"];
type UnwrappedAttributeHeaderItem = Execution.IResultAttributeHeaderItem["attributeHeaderItem"];

export type UnwrappedMeasureHeaderItem = Execution.IMeasureHeaderItem["measureHeaderItem"];

export interface IUnwrappedAttributeHeaderWithItems extends UnwrappedAttributeHeader {
    items: Execution.IResultAttributeHeaderItem[];
}

export interface IAttributeItem extends UnwrappedAttributeHeaderItem {
    attribute: IUnwrappedAttributeHeaderWithItems;
}
