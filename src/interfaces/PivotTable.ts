// (C) 2007-2018 GoodData Corporation
import { ISeparators } from '@gooddata/numberjs';
import { AFM } from '@gooddata/typings';

export interface IMenu {
    aggregations?: boolean;
    subTotals?: boolean; // TODO BB-1410 How to name it?
}

export interface IPivotTableConfig {
    separators?: ISeparators;
    menu?: IMenu;
    maxHeight?: number;
}

export interface IMenuAggregationClickConfig {
    type: AFM.TotalType;
    measureIdentifiers: string[];
    attributeIdentifier: string;
    include: boolean;
}
