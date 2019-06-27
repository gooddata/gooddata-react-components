// (C) 2007-2018 GoodData Corporation
import max from "lodash/max";
import { IGridRow } from "./agGridTypes";
import { isMappingHeaderAttributeItem } from "../../../interfaces/MappingHeader";

interface IAttributesRowItemUris {
    [columnId: string]: string[];
}

interface IAttributesRowItemRepetitions {
    [columnId: string]: boolean[];
}

export interface IGroupingProvider {
    reset: () => void;
    isRepeatedValue: (columnId: string, rowIndex: number) => boolean;
    isGroupBoundary: (rowIndex: number) => boolean;
    isColumnWithGrouping: (columnId: string) => boolean;
    processPage: (pageRows: IGridRow[], rowOffset: number, columnIds: string[]) => void;
}

class DefaultGroupingProvider implements IGroupingProvider {
    // tslint:disable-next-line:no-empty
    public reset() {}

    public isGroupBoundary(_rowIndex: number) {
        return false;
    }

    public isColumnWithGrouping(_columnId: string) {
        return false;
    }

    // tslint:disable-next-line:no-empty
    public processPage(_pageRows: IGridRow[], _rowOffset: number, _columnIds: string[]) {}

    public isRepeatedValue(_columnId: string, _rowIndex: number) {
        return false;
    }
}

class AttributeGroupingProvider implements IGroupingProvider {
    private itemUris: IAttributesRowItemUris;
    private itemRepetitions: IAttributesRowItemRepetitions;
    private repetitionsCounts: number[];
    private maxRepetitions: number;

    constructor() {
        this.reset();
    }

    public reset() {
        this.itemUris = {};
        this.itemRepetitions = {};
        this.repetitionsCounts = [];
        this.maxRepetitions = 0;
    }

    public isRepeatedValue(columnId: string, rowIndex: number) {
        if (this.itemRepetitions[columnId]) {
            return this.itemRepetitions[columnId][rowIndex] === true;
        }
        return false;
    }

    public isGroupBoundary(rowIndex: number) {
        return (
            !!this.repetitionsCounts &&
            (this.repetitionsCounts[rowIndex] === undefined ||
                this.repetitionsCounts[rowIndex] < this.maxRepetitions)
        );
    }

    public isColumnWithGrouping(columnId: string) {
        return Object.keys(this.itemRepetitions).indexOf(columnId) < this.maxRepetitions;
    }

    public processPage(pageRows: IGridRow[], rowOffset: number, columnIds: string[]) {
        columnIds.forEach(columnId => {
            if (!this.itemUris[columnId]) {
                this.itemUris[columnId] = [];
            }

            pageRows.forEach((row: IGridRow, rowIndex: number) => {
                const headerItem = row.headerItemMap[columnId];
                if (isMappingHeaderAttributeItem(headerItem)) {
                    const attributeItemUri = headerItem.attributeHeaderItem.uri;
                    this.itemUris[columnId][rowIndex + rowOffset] = attributeItemUri;
                }
            });
        });

        this.update();
    }

    private update() {
        this.repetitionsCounts = null;
        this.maxRepetitions = 0;
        let previousColumnId: string = null;

        Object.keys(this.itemUris).forEach(columnId => {
            const rowCount = this.itemUris[columnId].length;
            this.itemRepetitions[columnId] = Array(rowCount).fill(false);
            if (this.repetitionsCounts === null) {
                this.repetitionsCounts = Array(rowCount).fill(0);
            }

            this.updateAttributeColumn(
                this.itemUris[columnId],
                this.itemRepetitions[columnId],
                previousColumnId !== null ? this.itemRepetitions[previousColumnId] : null,
            );

            previousColumnId = columnId;
        });

        this.maxRepetitions = max(this.repetitionsCounts);
    }

    private updateAttributeColumn(
        itemUris: string[],
        itemRepetitions: boolean[],
        previousAttributeItemRepetitions: boolean[],
    ) {
        let previousItemUri: string = null;
        itemUris.forEach((itemUri, rowIndex) => {
            let repeatedItem = previousItemUri === itemUri;
            if (previousAttributeItemRepetitions !== null) {
                repeatedItem = repeatedItem && previousAttributeItemRepetitions[rowIndex];
            }

            if (repeatedItem) {
                itemRepetitions[rowIndex] = true;
                this.repetitionsCounts[rowIndex] += 1;
            }

            previousItemUri = itemUri;
        });
    }
}

export class GroupingProviderFactory {
    public static createProvider(groupRows: boolean): IGroupingProvider {
        if (groupRows) {
            return new AttributeGroupingProvider();
        }

        return new DefaultGroupingProvider();
    }
}
