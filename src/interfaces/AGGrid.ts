// (C) 2007-2018 GoodData Corporation
import { IDrillHeader } from '../interfaces/DrillEvents';
import { ColDef, CellEvent } from 'ag-grid';

export interface IGridRow {
    drillItemMap: {
        [key: string]: IDrillHeader;
    };
    [key: string]: any;
}

export interface IGridCellEvent extends CellEvent {
    colDef: IGridHeader;
}
export interface IGridHeader extends ColDef {
    index?: number;
    measureIndex?: number;
    drillItems: IDrillHeader[];
    children?: IGridHeader[];
}

export interface IColumnDefOptions {
    [key: string]: any;
}

export interface IGridAdapterOptions {
    makeRowGroups?: boolean;
    addLoadingRenderer?: string;
    columnDefOptions?: IColumnDefOptions;
}
