// (C) 2020 GoodData Corporation
import {
    allMeasureColumnWidthItem,
    attributeColumnWidthItem,
    measureColumnWidthItem,
    weakMeasureColumnWidthItemBuilder,
} from "../widthItems";
import {
    IAllMeasureColumnWidthItem,
    IAttributeColumnWidthItem,
    IMeasureColumnWidthItem,
    IWeakMeasureColumnWidthItem,
} from "../../../interfaces/PivotTable";

describe("widthItems", () => {
    describe("attributeColumnWidthItem", () => {
        it("should return a simple attribute column width item", () => {
            const expected: IAttributeColumnWidthItem = {
                attributeColumnWidthItem: {
                    attributeIdentifier: "foo",
                    width: {
                        value: 100,
                    },
                },
            };
            expect(attributeColumnWidthItem("foo", 100)).toMatchObject(expected);
        });
    });

    describe("measureColumnWidthItem", () => {
        it("should return a simple measure column width item", () => {
            const expected: IMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: {
                        value: 100,
                    },
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
                    width: {
                        value: 100,
                    },
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

    describe("allMeasureColumnWidthItem", () => {
        it("should return all measure column item with width", () => {
            const expected: IAllMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: {
                        value: 100,
                    },
                },
            };

            expect(allMeasureColumnWidthItem(100)).toMatchObject(expected);
        });
    });

    describe("weakMeasureColumnWidthItemBuilder", () => {
        it("should return weak measure column item with width and false allowGrowToFit", () => {
            const expected: IWeakMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: {
                        value: 100,
                        allowGrowToFit: false,
                    },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "id",
                        },
                    },
                },
            };

            expect(weakMeasureColumnWidthItemBuilder("id", 100)).toMatchObject(expected);
        });

        it("should return weak measure column item with width and true allowGrowToFit", () => {
            const expected: IWeakMeasureColumnWidthItem = {
                measureColumnWidthItem: {
                    width: {
                        value: 100,
                        allowGrowToFit: true,
                    },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "id",
                        },
                    },
                },
            };

            expect(weakMeasureColumnWidthItemBuilder("id", 100, true)).toMatchObject(expected);
        });
    });
});
