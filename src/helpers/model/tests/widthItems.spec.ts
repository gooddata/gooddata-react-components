// (C) 2020 GoodData Corporation
import { attributeColumnWidthItem, measureColumnWidthItem } from "../widthItems";
import { IAttributeColumnWidthItem, IMeasureColumnWidthItem } from "../../../interfaces/PivotTable";

describe("widthItems", () => {
    describe("attributeColumnWidthItem", () => {
        it("should return a simple attribute column width item", () => {
            const expected: IAttributeColumnWidthItem = {
                attributeColumnWidthItem: {
                    attributeIdentifier: "foo",
                    width: 100,
                },
            };
            expect(attributeColumnWidthItem("foo", 100)).toMatchObject(expected);
        });

        it("should return a simple attribute column width item with aggregation", () => {
            const expected: IAttributeColumnWidthItem = {
                attributeColumnWidthItem: {
                    attributeIdentifier: "foo",
                    width: 100,
                    aggregation: "sum",
                },
            };
            expect(attributeColumnWidthItem("foo", 100).aggregation("sum")).toMatchObject(expected);
        });
    });

    describe("measureColumnWidthItem", () => {
        it("should return a simple measure column width item", () => {
            const expected: IMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: 100,
                    locators: [
                        {
                            measureLocatorItem: {
                                measureIdentifier: "foo",
                            },
                        },
                    ],
                },
            };
            expect(measureColumnWidthItem("foo", 100)).toMatchObject(expected);
        });

        it("should return a measure column width item with attribute locators", () => {
            const expected: IMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: 100,
                    locators: [
                        {
                            attributeLocatorItem: {
                                attributeIdentifier: "attr",
                                element: "elem",
                            },
                        },
                        {
                            measureLocatorItem: {
                                measureIdentifier: "foo",
                            },
                        },
                    ],
                },
            };

            expect(
                measureColumnWidthItem("foo", 100).attributeLocators({
                    attributeIdentifier: "attr",
                    element: "elem",
                }),
            ).toMatchObject(expected);
        });
    });
});
