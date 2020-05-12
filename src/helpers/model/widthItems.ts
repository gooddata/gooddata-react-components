// (C) 2020 GoodData Corporation
import { ColumnWidth, IAttributeColumnWidthItem, IMeasureColumnWidthItem } from "../../interfaces/PivotTable";
import { AFM } from "@gooddata/typings";

export class AttributeColumnWidthItemBuilder implements IAttributeColumnWidthItem {
    public attributeColumnWidthItem: IAttributeColumnWidthItem["attributeColumnWidthItem"];

    constructor(attributeIdentifier: string, width: ColumnWidth) {
        this.attributeColumnWidthItem = {
            attributeIdentifier,
            width,
        };
    }

    public aggregation = (aggregation: "sum") => {
        this.attributeColumnWidthItem.aggregation = aggregation;
        return this;
    };
}

export class MeasureColumnWidthItemBuilder implements IMeasureColumnWidthItem {
    public measureColumnWidthItem: IMeasureColumnWidthItem["measureColumnWidthItem"];

    constructor(measureIdentifier: AFM.Identifier, width: ColumnWidth) {
        this.measureColumnWidthItem = {
            width,
            locators: [
                {
                    measureLocatorItem: {
                        measureIdentifier,
                    },
                },
            ],
        };
    }

    public attributeLocators = (
        ...attributeLocators: Array<AFM.IAttributeLocatorItem["attributeLocatorItem"]>
    ) => {
        this.measureColumnWidthItem.locators.splice(
            -2,
            0,
            ...attributeLocators.map(attributeLocatorItem => ({
                attributeLocatorItem,
            })),
        );
        return this;
    };
}

export const attributeColumnWidthItem = (attributeIdentifier: string, width: ColumnWidth) =>
    new AttributeColumnWidthItemBuilder(attributeIdentifier, width);

export const measureColumnWidthItem = (measureIdentifier: AFM.Identifier, width: ColumnWidth) =>
    new MeasureColumnWidthItemBuilder(measureIdentifier, width);
