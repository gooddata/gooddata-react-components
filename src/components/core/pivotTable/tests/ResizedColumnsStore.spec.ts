// (C) 2020 GoodData Corporation
import { ResizedColumnsStore } from "../ResizedColumnsStore";
import { ColumnEventSourceType, ColumnWidthItem } from "../../../../interfaces/PivotTable";
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import { MEASURE_COLUMN, ROW_ATTRIBUTE_COLUMN } from "../agGridConst";
import { MANUALLY_SIZED_MAX_WIDTH, MIN_WIDTH } from "../agGridColumnSizing";

describe("ResizedColumnsStore", () => {
    const columnWidthsMock: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 400,
                locators: [
                    {
                        measureLocatorItem: {
                            measureIdentifier: "m1",
                            element: "/m1",
                        },
                    },
                ],
            },
        },
        {
            attributeColumnWidthItem: {
                width: 200,
                attributeIdentifier: "a1",
            },
        },
    ];
    const columnWidthsAllMeasureMock: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 400,
            },
        },
    ];
    const columnWidthsAllMeasureMockMinWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 10,
            },
        },
    ];
    const columnWidthsAllMeasureMockMaxWidth: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 4000,
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
    const getFakeColumn = (columnDefinition: ColDef): Column => {
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
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 400, source: "uiColumnDragged" },
                a_4DOTdf: { width: 200, source: "uiColumnDragged" },
            };
            const columnMock = getFakeColumn({
                colId: "m_0",
            });
            const expectedResult = { width: 400, source: "uiColumnDragged" };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return all measure column width", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.allMeasureColumnWidth = 42;
            const columnMock = getFakeColumn({
                type: MEASURE_COLUMN,
            });
            const expectedResult = { width: 42, source: "uiColumnDragged" };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });

        it("should return all measure column width when manuallyResizedColumns exists", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 400, source: "uiColumnDragged" },
                a_4DOTdf: { width: 200, source: "uiColumnDragged" },
            };
            resizedColumnsStore.allMeasureColumnWidth = 42;

            const columnMock = getFakeColumn({
                type: MEASURE_COLUMN,
            });
            const expectedResult = { width: 42, source: "uiColumnDragged" };
            const result = resizedColumnsStore.getManuallyResizedColumn(columnMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe("isColumnManuallyResized", () => {
        it("should return true for manually resized column", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 400, source: "uiColumnDragged" },
            };
            const columnMock = getFakeColumn({
                colId: "m_0",
            });
            const result = resizedColumnsStore.isColumnManuallyResized(columnMock);
            expect(result).toBeTruthy();
        });

        it("should return false for column that is not manually resized", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {};
            const columnMock = getFakeColumn({
                colId: "m.without.manually.resizing",
            });
            const result = resizedColumnsStore.isColumnManuallyResized(columnMock);
            expect(result).toBeFalsy();
        });
    });

    describe("addToManuallyResizedColumn", () => {
        it("should add manually resized column to map", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            const correctWidth = 42;
            const columnMock = getFakeColumn({
                colId: "m_1",
                width: correctWidth,
            });
            resizedColumnsStore.addToManuallyResizedColumn(columnMock);
            const result = resizedColumnsStore.manuallyResizedColumns.m_1.width;
            expect(result).toBe(correctWidth);
        });
    });

    describe("addAllMeasureColumns", () => {
        it("should add all measure columns", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            const columnsMock = [
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumns(42, columnsMock);
            const expectedResult = 42;
            const result = resizedColumnsStore.allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });

        it("should omit from manually resized map by colId", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 400, source: "uiColumnDragged" },
            };
            const columnsMock = [
                getFakeColumn({
                    colId: "m_0",
                    type: MEASURE_COLUMN,
                }),
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumns(42, columnsMock);
            const result = resizedColumnsStore.manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
        });

        it("should omit from manually resized map by colId and kept other items", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 400, source: "uiColumnDragged" },
                a_4DOTdf: { width: 200, source: "uiColumnDragged" },
            };
            const columnsMock = [
                getFakeColumn({
                    colId: "m_0",
                    type: MEASURE_COLUMN,
                }),
                getFakeColumn({
                    type: MEASURE_COLUMN,
                }),
            ];
            resizedColumnsStore.addAllMeasureColumns(42, columnsMock);
            const result = resizedColumnsStore.manuallyResizedColumns.a_4DOTdf.width;
            const correctWidth = 200;
            expect(result).toEqual(correctWidth);
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
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: "auto", source: "uiColumnDragged" },
            };
            resizedColumnsStore.removeAllMeasureColumns();
            const result = resizedColumnsStore.manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
        });

        it("should omit from manually resized columns when width is auto and kept other items", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: "auto", source: "uiColumnDragged" },
                a_4DOTdf: { width: 200, source: "uiColumnDragged" },
            };
            resizedColumnsStore.removeAllMeasureColumns();
            const result = resizedColumnsStore.manuallyResizedColumns.a_4DOTdf.width;
            const correctWidth = 200;
            expect(result).toEqual(correctWidth);
        });
    });

    describe("removeFromManuallyResizedColumn", () => {
        it("should remove measure from manually resized column map by colId", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 200, source: "uiColumnDragged" },
                a_4DOTdf: { width: 200, source: "uiColumnDragged" },
            };
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
                suppressSizeToFit: true,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const result = resizedColumnsStore.manuallyResizedColumns.m_0;
            expect(result).toBeUndefined();
            expect(columnMock.getColDef().suppressSizeToFit).toBeFalsy();
        });

        it.each([[null], [150]])(
            "should remove row attribute from manually resized column map by colId when allMeasuresWidth set %d",
            (allMeasuresWidth: number) => {
                const resizedColumnsStore: any = new ResizedColumnsStore();
                resizedColumnsStore.manuallyResizedColumns = {
                    m_0: { width: 200, source: "uiColumnDragged" },
                    a_4DOTdf: { width: 200, source: "uiColumnDragged" },
                };
                resizedColumnsStore.allMeasureColumnWidth = allMeasuresWidth;
                const columnMock = getFakeColumn({
                    colId: "a_4DOTdf",
                    type: ROW_ATTRIBUTE_COLUMN,
                    suppressSizeToFit: true,
                });
                resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
                const result = resizedColumnsStore.manuallyResizedColumns.a_4DOTdf;
                expect(result).toBeUndefined();
                expect(columnMock.getColDef().suppressSizeToFit).toBeFalsy();
            },
        );

        it("should set auto width when colId does not exists and all measure is used", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.allMeasureColumnWidth = 200;
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const expectedResult = { width: "auto", source: "uiColumnDragged" };
            const result = resizedColumnsStore.manuallyResizedColumns.m_0;
            expect(result).toEqual(expectedResult);
        });

        it("should set auto width when colId does exists and all measure is used", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.allMeasureColumnWidth = 200;
            resizedColumnsStore.manuallyResizedColumns = {
                m_0: { width: 200, source: "uiColumnDragged" },
            };
            const columnMock = getFakeColumn({
                colId: "m_0",
                type: MEASURE_COLUMN,
            });
            resizedColumnsStore.removeFromManuallyResizedColumn(columnMock);
            const expectedResult = { width: "auto", source: "uiColumnDragged" };
            const result = resizedColumnsStore.manuallyResizedColumns.m_0;
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
                        width: 400,
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
                    attributeColumnWidthItem: { width: 200, attributeIdentifier: "a1" },
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
                        width: 400,
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
                    attributeColumnWidthItem: { width: 200, attributeIdentifier: "a1" },
                },
                {
                    measureColumnWidthItem: {
                        width: 400,
                    },
                },
            ];
            const result = resizedColumnsStore.getColumnWidthsFromMap(executionResponsesMock);
            expect(result).toEqual(expectedResult);
        });
    });

    describe("updateColumnWidths", () => {
        it("should update column widths", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            const expectedResult = {
                m_0: { width: 400, source: ColumnEventSourceType.UI_DRAGGED },
                a_4DOTdf: { width: 200, source: ColumnEventSourceType.UI_DRAGGED },
            };
            resizedColumnsStore.updateColumnWidths(columnWidthsMock, executionResponseMock);
            const result = resizedColumnsStore.manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should update only measure columns", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            const expectedResult = {
                m_0: { width: 400, source: ColumnEventSourceType.UI_DRAGGED },
            };
            const columnWidthsOnlyMeasureMock = [columnWidthsMock[0]];
            resizedColumnsStore.updateColumnWidths(columnWidthsOnlyMeasureMock, executionResponseMock);
            const result = resizedColumnsStore.manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should update only attribute measure columns", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            const expectedResult = {
                a_4DOTdf: { width: 200, source: ColumnEventSourceType.UI_DRAGGED },
            };
            const columnWidthsOnlyAttributeMock = [columnWidthsMock[1]];
            resizedColumnsStore.updateColumnWidths(columnWidthsOnlyAttributeMock, executionResponseMock);
            const result = resizedColumnsStore.manuallyResizedColumns;
            expect(result).toEqual(expectedResult);
        });

        it("should validate all measure width item with min width", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(columnWidthsAllMeasureMockMinWidth, executionResponseMock);
            const expectedResult = MIN_WIDTH;
            const result = resizedColumnsStore.allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });

        it("should validate all measure width item with max width", () => {
            const resizedColumnsStore: any = new ResizedColumnsStore();
            resizedColumnsStore.updateColumnWidths(columnWidthsAllMeasureMockMaxWidth, executionResponseMock);
            const expectedResult = MANUALLY_SIZED_MAX_WIDTH;
            const result = resizedColumnsStore.allMeasureColumnWidth;
            expect(result).toEqual(expectedResult);
        });
    });
});
