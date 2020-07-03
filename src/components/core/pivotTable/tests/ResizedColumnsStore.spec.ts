// (C) 2020 GoodData Corporation
import { ResizedColumnsStore, IWeakMeasureColumnWidthItemsMap } from "../ResizedColumnsStore";
import { ColumnWidthItem } from "../../../../interfaces/PivotTable";
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import { MEASURE_COLUMN, ROW_ATTRIBUTE_COLUMN, COLUMN_ATTRIBUTE_COLUMN } from "../agGridConst";
import { MANUALLY_SIZED_MAX_WIDTH, MIN_WIDTH } from "../agGridColumnSizing";
import { IGridHeader } from "../agGridTypes";

describe("ResizedColumnsStore", () => {
    const measureItem = {
        measureColumnWidthItem: {
            width: {
                value: 400,
            },
            locators: [
                {
                    measureLocatorItem: {
                        measureIdentifier: "m1",
                        element: "/m1",
                    },
                },
            ],
        },
    };
    const columnWidthsMock: ColumnWidthItem[] = [
        measureItem,
        {
            attributeColumnWidthItem: {
                width: {
                    value: 200,
                },
                attributeIdentifier: "a1",
            },
        },
    ];
    const columnWidthsAllMeasureMock: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 400,
                },
            },
        },
    ];
    const columnWidthsAllMeasureMockMinWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 10,
                },
            },
        },
    ];
    const columnWidthsAllMeasureMockMaxWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 4000,
                },
            },
        },
    ];
    const columnWidthsWeakMeasureMockMinWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 10,
                    allowGrowToFit: true,
                },
                locator: {
                    measureLocatorItem: {
                        measureIdentifier: "id",
                    },
                },
            },
        },
    ];
    const columnWidthsWeakMeasureMockMaxWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 4000,
                    allowGrowToFit: true,
                },
                locator: {
                    measureLocatorItem: {
                        measureIdentifier: "id",
                    },
                },
            },
        },
    ];
    const columnWidthsWeakMeasureMockWithString: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: "ttt" as any,
                    allowGrowToFit: true,
                },
                locator: {
                    measureLocatorItem: {
                        measureIdentifier: "id",
                    },
                },
            },
        },
    ];
    const executionResponseMock: Execution.IExecutionResponse = {
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            identifier: "4.df",
                            localIdentifier: "a1",
                            name: "Colours",
                            uri: "/gdc/md/test/obj/4.df",
                            formOf: {
                                identifier: "4",
                                name: "Colours",
                                uri: "/gdc/md/test/obj/4",
                            },
                        },
                    },
                ],
            },
            {
                headers: [
                    {
                        measureGroupHeader: {
                            items: [
                                {
                                    measureHeaderItem: {
                                        format: "#,##0.00",
                                        identifier: "1",
                                        localIdentifier: "m1",
                                        name: "Bigger Amount",
                                        uri: "/gdc/md/test/obj/2",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
        links: {
            executionResult: "",
        },
    };
    const executionResponsesMock: Execution.IExecutionResponses = {
        executionResponse: executionResponseMock,
        executionResult: null,
    };

    const measureIdentifier = "m_0";

    const weakMeasuresColumnWidths: IWeakMeasureColumnWidthItemsMap = {
        m_0: {
            measureColumnWidthItem: {
                width: {
                    value: 350,
                },
                locator: {
                    measureLocatorItem: {
                        measureIdentifier,
                    },
                },
            },
        },
    };

    const getFakeColumn = (columnDefinition: ColDef | IGridHeader): Column => {
        const fakeColumn = {
            getColDef: () => {
                return columnDefinition;
            },
            getColId: () => {
                return columnDefinition.colId;
            },
            getActualWidth: () => {
                return columnDefinition.width;
            },
        };

        return fakeColumn as Column;
    };

    describe("getManuallyResizedColumn", () => {
        it("should return correct manually resized measure column", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: {
                    width: {
                        value: 400,
                    },
                },
                a_4DOTdf: {
                    width: {
                        value: 200,
                    },
                },
            });

            const columnMock = getFakeColumn({
                colId: "m_0",
            });
            const expectedResult = { width: 400 };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return all measure column width when manuallyResizedColumns not exists", () => {
            const resizedColumnsStore = new ResizedColumnsStore({}, 42, {});

            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            const expectedResult = { width: 42 };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return all measure column width when manuallyResizedColumns exists", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    m_0: {
                        width: {
                            value: 400,
                        },
                    },
                    a_4DOTdf: {
                        width: {
                            value: 200,
                        },
                    },
                },
                42,
            );

            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            const expectedResult = { width: 400 };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should not return manually resized measure column width is auto", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: { width: { value: "auto" } },
                a_4DOTdf: { width: { value: 200 } },
            });

            const columnMock = getFakeColumn({
                colId: "m_0",
            });

            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(undefined);
        });

        it("should return weak column width when exist in internal weakMeasuresColumnWidths and not in manuallyResizedColumns", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    a_4DOTdf: { width: { value: 200 } },
                },
                42,
                weakMeasuresColumnWidths,
            );

            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedResult = { width: 350 };

            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return manuallyResizedColumns column width when exist in internal weakMeasuresColumnWidths and in manuallyResizedColumns", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    m_0: { width: { value: 111 } },
                    a_4DOTdf: { width: { value: 200 } },
                },
                42,
                weakMeasuresColumnWidths,
            );

            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedResult = { width: 111 };

            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return allMeasureColumnWidth column width", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    m_0: { width: { value: 111 } },
                    a_4DOTdf: { width: { value: 200 } },
                },
                42,
                weakMeasuresColumnWidths,
            );

            const columnMock = getFakeColumn({
                colId: "someColumnId",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: "someMeasureIdentifier",
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedResult = { width: 42 };

            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe("getMatchedWeakMeasuresColumnWidth", () => {
        it("should return weakMeasureColumnWidthItem if exist in internal weakMeasuresColumnWidths map", () => {
            const resizedColumnsStore = new ResizedColumnsStore({}, null, weakMeasuresColumnWidths);

            const columnMock = getFakeColumn({
                colId: "someId",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedResult = {
                measureColumnWidthItem: {
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier,
                        },
                    },
                    width: {
                        value: 350,
                    },
                },
            };

            const result = resizedColumnsStore.getMatchedWeakMeasuresColumnWidth(columnMock);

            expect(result).toEqual(expectedResult);
        });

        it("should return undefined if not exist in internal weakMeasuresColumnWidths map", () => {
            const resizedColumnsStore = new ResizedColumnsStore({}, null, weakMeasuresColumnWidths);

            const columnMock = getFakeColumn({
                colId: "someId",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: "someNotExistingIdentifier",
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const result = resizedColumnsStore.getMatchedWeakMeasuresColumnWidth(columnMock);

            expect(result).toEqual(undefined);
        });

        it("should return undefined if not match localIdentifier in internal weakMeasuresColumnWidths map", () => {
            const resizedColumnsStore = new ResizedColumnsStore({}, null, weakMeasuresColumnWidths);

            const columnMock = getFakeColumn({
                colId: "someId",
                type: MEASURE_COLUMN,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: "someNotExistingIdentifier",
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const result = resizedColumnsStore.getMatchedWeakMeasuresColumnWidth(columnMock);

            expect(result).toEqual(undefined);
        });
    });

    describe("isColumnManuallyResized", () => {
        it("should return true for manually resized column", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: {
                    width: {
                        value: 400,
                    },
                },
            });
            const columnMock = getFakeColumn({
                colId: "m_0",
            });
            const result = resizedColumnsStore.isColumnManuallyResized(columnMock);
            expect(result).toBeTruthy();
        });

        it("should return false for column that is not manually resized", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const columnMock = getFakeColumn({
                colId: "m.without.manually.resizing",
            });
            const result = resizedColumnsStore.isColumnManuallyResized(columnMock);
            expect(result).toBeFalsy();
        });
    });

    describe("addToManuallyResizedColumn", () => {
        it("should add manually resized column to map", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const correctWidth = 42;
            const columnMock = getFakeColumn({
                colId: "m_1",
                width: correctWidth,
            });
            resizedColumnsStore.addToManuallyResizedColumn(columnMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_1.width.value;
            expect(result).toBe(correctWidth);
        });
    });

    describe("addAllMeasureColumn", () => {
        it("should add all measure columns", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const columnsMock = [
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumn(42, columnsMock);
            const expectedResult = 42;
            const result = (resizedColumnsStore as any).allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });

        it("should omit from manually resized map by colId", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: {
                    width: {
                        value: 400,
                    },
                },
            });
            const columnsMock = [
                getFakeColumn({
                    colId: "m_0",
                    type: MEASURE_COLUMN,
                }),
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumn(42, columnsMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
        });

        it("should omit from manually resized map by colId and kept other items", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: {
                    width: {
                        value: 400,
                    },
                },
                a_4DOTdf: {
                    width: {
                        value: 200,
                    },
                },
            });
            const columnsMock = [
                getFakeColumn({
                    colId: "m_0",
                    type: MEASURE_COLUMN,
                }),
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumn(42, columnsMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns.a_4DOTdf.width.value;
            const correctWidth = 200;
            expect(result).toEqual(correctWidth);
        });

        it("should clear all weakMeasuresColumnWidths", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    m_0: { width: { value: 400 } },
                    a_4DOTdf: { width: { value: 200 } },
                },
                null,
                weakMeasuresColumnWidths,
            );

            const columnsMock = [
                getFakeColumn({
                    colId: "m_0",
                    type: MEASURE_COLUMN,
                }),
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumn(42, columnsMock);

            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual({});
        });
    });

    describe("addWeekMeasureColumn", () => {
        it("should do nothing when column type is not MEASURE_COLUMN", () => {
            const resizedColumnsStore = new ResizedColumnsStore();

            const columnMock = getFakeColumn({
                colId: "m_0_id",
                type: COLUMN_ATTRIBUTE_COLUMN,
            });

            resizedColumnsStore.addWeekMeasureColumn(columnMock);
            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual({});
        });

        it("should add weak column", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const columnMock = getFakeColumn({
                colId: "m_0_id",
                type: MEASURE_COLUMN,
                width: 666,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedWeakMeasuresColumnWidths = {
                m_0: {
                    measureColumnWidthItem: {
                        locator: {
                            measureLocatorItem: {
                                measureIdentifier,
                            },
                        },
                        width: {
                            value: 666,
                        },
                    },
                },
            };

            resizedColumnsStore.addWeekMeasureColumn(columnMock);
            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual(
                expectedWeakMeasuresColumnWidths,
            );
        });

        it("should add weak column and remove measure columns from manuallyResizedColumns and set suppressSizeToFit when mach measureIdentifier", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0_id_2: { width: { value: 400 }, measureIdentifier },
                a_4DOTdf: { width: { value: 200 } },
            });

            const columnMock = getFakeColumn({
                colId: "m_0_id",
                type: MEASURE_COLUMN,
                width: 666,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "1",
                            uri: "/gdc/md/storybook/obj/1",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            });

            const expectedWeakMeasuresColumnWidths = {
                m_0: {
                    measureColumnWidthItem: {
                        locator: {
                            measureLocatorItem: {
                                measureIdentifier,
                            },
                        },
                        width: {
                            value: 666,
                        },
                    },
                },
            };

            const expectedManuallyResizedColumns = {
                a_4DOTdf: { width: { value: 200 } },
            };

            resizedColumnsStore.addWeekMeasureColumn(columnMock);
            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual(
                expectedWeakMeasuresColumnWidths,
            );
            expect((resizedColumnsStore as any).manuallyResizedColumns).toEqual(
                expectedManuallyResizedColumns,
            );
        });
    });

    describe("removeWeakMeasureColumn", () => {
        it("should remove weak column ", () => {
            const resizedColumnsStore = new ResizedColumnsStore(
                {
                    m_0: {
                        width: {
                            value: "auto",
                        },
                        measureIdentifier,
                    },
                },
                null,
                weakMeasuresColumnWidths,
            );

            const weakResizedColumnDef = {
                colId: "m_0",
                type: MEASURE_COLUMN,
                width: 111,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "2",
                            uri: "someUri",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            };

            const columnMock = getFakeColumn(weakResizedColumnDef);
            resizedColumnsStore.removeWeakMeasureColumn(columnMock);
            expect((resizedColumnsStore as any).manuallyResizedColumns).toEqual({});
            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual({});
        });

        it("should remove weak column from manually resized when width is auto", () => {
            const resizedColumnsStore = new ResizedColumnsStore({}, null, weakMeasuresColumnWidths);

            const weakResizedColumnDef = {
                colId: "m_0",
                type: MEASURE_COLUMN,
                width: 111,
                drillItems: [
                    {
                        measureHeaderItem: {
                            identifier: "2",
                            uri: "someUri",
                            localIdentifier: measureIdentifier,
                            format: "#,##0.00",
                            name: "Amount",
                        },
                    },
                ],
            };

            const columnMock = getFakeColumn(weakResizedColumnDef);
            resizedColumnsStore.removeWeakMeasureColumn(columnMock);
            expect((resizedColumnsStore as any).weakMeasuresColumnWidths).toEqual({});
        });
    });

    describe("removeAllMeasureColumns", () => {
        it("should remove all measure columns", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.removeAllMeasureColumns();
            const result = resizedColumnsStore.allMeasureColumnWidth;
            expect(result).toBeNull();
        });

        it("should omit from manually resized columns when width is auto", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: { width: { value: "auto" } },
            });
            resizedColumnsStore.removeAllMeasureColumns();
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
        });

        it("should omit from manually resized columns when width is auto and kept other items", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: { width: { value: "auto" } },
                a_4DOTdf: { width: { value: 200 } },
            });
            resizedColumnsStore.removeAllMeasureColumns();
            const result = (resizedColumnsStore as any).manuallyResizedColumns.a_4DOTdf.width.value;
            const correctWidth = 200;
            expect(result).toEqual(correctWidth);
        });
    });

    describe("removeFromManuallyResizedColumn", () => {
        it("should remove measure from manually resized column map by colId", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: { width: { value: 200 } },
                a_4DOTdf: { width: { value: 200 } },
            });
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
                suppressSizeToFit: true,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
            expect(columnMock.getColDef().suppressSizeToFit).toBeFalsy();
        });

        it.each([[null], [150]])(
            "should remove row attribute from manually resized column map by colId when allMeasuresWidth set %d",
            (allMeasuresWidth: number) => {
                const resizedColumnsStore = new ResizedColumnsStore({
                    m_0: { width: { value: 200 } },
                    a_4DOTdf: { width: { value: 200 } },
                });
                (resizedColumnsStore as any).allMeasureColumnWidth = allMeasuresWidth;
                const columnMock = getFakeColumn({
                    colId: "a_4DOTdf",
                    type: ROW_ATTRIBUTE_COLUMN,
                    suppressSizeToFit: true,
                });
                resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
                const result = (resizedColumnsStore as any).manuallyResizedColumns.a_4DOTdf;
                expect(result).toBeUndefined();
                expect(columnMock.getColDef().suppressSizeToFit).toBeFalsy();
            },
        );

        it("should set auto width when colId does not exists and all measure is used", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            (resizedColumnsStore as any).allMeasureColumnWidth = 200;
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const expectedResult = { width: { value: "auto" } };
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_0;
            expect(result).toEqual(expectedResult);
        });

        it("should set auto width when colId does exists and all measure is used", () => {
            const resizedColumnsStore = new ResizedColumnsStore({
                m_0: { width: { value: 200 } },
            });
            (resizedColumnsStore as any).allMeasureColumnWidth = 200;
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const expectedResult = { width: { value: "auto" } };
            const result = (resizedColumnsStore as any).manuallyResizedColumns.m_0;
            expect(result).toEqual(expectedResult);
        });
    });

    describe("getColumnWidthsFromMap", () => {
        it("should return correct column widths", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(columnWidthsMock, executionResponseMock);
            const expectedResult = [
                {
                    measureColumnWidthItem: {
                        width: {
                            value: 400,
                        },
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
                {
                    attributeColumnWidthItem: {
                        width: {
                            value: 200,
                        },
                        attributeIdentifier: "a1",
                    },
                },
            ];
            const result = resizedColumnsStore.getColumnWidthsFromMap(executionResponsesMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return all measure column width when is used", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const columnWidthsWithAllMeasureMock: ColumnWidthItem[] = [
                ...columnWidthsMock,
                ...columnWidthsAllMeasureMock,
            ];
            resizedColumnsStore.updateColumnWidths(columnWidthsWithAllMeasureMock, executionResponseMock);
            const expectedResult = [
                {
                    measureColumnWidthItem: {
                        width: {
                            value: 400,
                        },
                        locators: [
                            {
                                measureLocatorItem: {
                                    measureIdentifier: "m1",
                                },
                            },
                        ],
                    },
                },
                {
                    attributeColumnWidthItem: {
                        width: {
                            value: 200,
                        },
                        attributeIdentifier: "a1",
                    },
                },
                {
                    measureColumnWidthItem: {
                        width: {
                            value: 400,
                        },
                    },
                },
            ];
            const result = resizedColumnsStore.getColumnWidthsFromMap(executionResponsesMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe("updateColumnWidths", () => {
        it("should update column widths", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const expectedResult = {
                m_0: { width: { value: 400 }, measureIdentifier: "m1" },
                a_4DOTdf: { width: { value: 200 } },
            };
            resizedColumnsStore.updateColumnWidths(columnWidthsMock, executionResponseMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should update only measure columns", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const expectedResult = {
                m_0: { width: { value: 400 }, measureIdentifier: "m1" },
            };
            const columnWidthsOnlyMeasureMock = [columnWidthsMock[0]];
            resizedColumnsStore.updateColumnWidths(columnWidthsOnlyMeasureMock, executionResponseMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should update only attribute measure columns", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            const expectedResult = {
                a_4DOTdf: { width: { value: 200 } },
            };
            const columnWidthsOnlyAttributeMock = [columnWidthsMock[1]];
            resizedColumnsStore.updateColumnWidths(columnWidthsOnlyAttributeMock, executionResponseMock);
            const result = (resizedColumnsStore as any).manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should validate all measure width item with min width", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(columnWidthsAllMeasureMockMinWidth, executionResponseMock);
            const expectedResult = MIN_WIDTH;
            const result = (resizedColumnsStore as any).allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });

        it("should validate all measure width item with max width", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(columnWidthsAllMeasureMockMaxWidth, executionResponseMock);
            const expectedResult = MANUALLY_SIZED_MAX_WIDTH;
            const result = (resizedColumnsStore as any).allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });

        it("should validate weak measures column widths with min width", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(
                columnWidthsWeakMeasureMockMinWidth,
                executionResponseMock,
            );
            const expectedResult = {
                measureColumnWidthItem: {
                    width: {
                        value: MIN_WIDTH,
                        allowGrowToFit: true,
                    },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "id",
                        },
                    },
                },
            };
            const result = (resizedColumnsStore as any).weakMeasuresColumnWidths.id;
            expect(result).toMatchObject(expectedResult);
        });

        it("should validate weak measures column widths with max width", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(
                columnWidthsWeakMeasureMockMaxWidth,
                executionResponseMock,
            );
            const expectedResult = {
                measureColumnWidthItem: {
                    width: {
                        value: MANUALLY_SIZED_MAX_WIDTH,
                        allowGrowToFit: true,
                    },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "id",
                        },
                    },
                },
            };
            const result = (resizedColumnsStore as any).weakMeasuresColumnWidths.id;
            expect(result).toMatchObject(expectedResult);
        });

        it("should validate weak measures column widths with string", () => {
            const resizedColumnsStore = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(
                columnWidthsWeakMeasureMockWithString,
                executionResponseMock,
            );
            const expectedResult = {};
            const result = (resizedColumnsStore as any).weakMeasuresColumnWidths;
            expect(result).toMatchObject(expectedResult);
        });
    });
});
