// (C) 2020 GoodData Corporation
import {
    IAttributeColumnWidthItem,
    IMeasureColumnWidthItem,
    IAllMeasureColumnWidthItem,
} from "../../interfaces/PivotTable";
import { AFM } from "@gooddata/typings";
import { getAllowGrowToFitProp } from "../../components/core/pivotTable/agGridColumnSizing";

export class AttributeColumnWidthItemBuilder implements IAttributeColumnWidthItem {
    public attributeColumnWidthItem: IAttributeColumnWidthItem["attributeColumnWidthItem"];

    constructor(attributeIdentifier: string, width: number, allowGrowToFit: boolean = false) {
        this.attributeColumnWidthItem = {
            attributeIdentifier,
            width: {
                value: width,
                ...getAllowGrowToFitProp(allowGrowToFit),
            },
        };
    }
}

export class MeasureColumnWidthItemBuilder implements IMeasureColumnWidthItem {
    public measureColumnWidthItem: IMeasureColumnWidthItem["measureColumnWidthItem"];

    constructor(measureIdentifier: AFM.Identifier, width: number | "auto", allowGrowToFit: boolean = false) {
        if (width !== "auto") {
            this.measureColumnWidthItem = {
                width: {
                    value: width,
                    ...getAllowGrowToFitProp(allowGrowToFit),
                },
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier,
                        },
                    },
                ],
            };
        } else {
            this.measureColumnWidthItem = {
                width: {
                    value: "auto",
                },
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier,
                        },
                    },
                ],
            };
        }
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

export class AllMeasureColumnWidthItemBuilder implements IAllMeasureColumnWidthItem {
    public measureColumnWidthItem: IAllMeasureColumnWidthItem["measureColumnWidthItem"];

    constructor(width: number) {
        this.measureColumnWidthItem = {
            width: {
                value: width,
            },
        };
    }
}

export const attributeColumnWidthItem = (attributeIdentifier: string, width: number) =>
    new AttributeColumnWidthItemBuilder(attributeIdentifier, width);

export const measureColumnWidthItem = (
    measureIdentifier: AFM.Identifier,
    width: number | "auto",
    allowGrowToFit: boolean = false,
) => new MeasureColumnWidthItemBuilder(measureIdentifier, width, allowGrowToFit);

export const allMeasureColumnWidthItem = (width: number) => new AllMeasureColumnWidthItemBuilder(width);
