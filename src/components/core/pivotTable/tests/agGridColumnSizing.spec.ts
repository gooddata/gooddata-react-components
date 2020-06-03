// (C) 2007-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import {
    convertColumnWidthsToMap,
    getColumnWidthsFromMap,
    enrichColumnDefinitionsWithWidths,
    MANUALLY_SIZED_MAX_WIDTH,
    syncSuppressSizeToFitOnColumns,
    resetColumnsWidthToDefault,
} from "../agGridColumnSizing";
import {
    ColumnWidthItem,
    ColumnEventSourceType,
    ColumnWidth,
    IResizedColumns,
} from "../../../../interfaces/PivotTable";
import { IGridHeader } from "../agGridTypes";
import { DEFAULT_COLUMN_WIDTH } from "../../PivotTable";
import { Column, ColumnApi } from "ag-grid-community";
import { oneColumnAttributeNoMeasureResponse } from "../../../../execution/fixtures/ExecuteAfm.fixtures";

describe("agGridColumnSizing", () => {
    const columnWidths: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: 60,
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
                width: 400,
                attributeIdentifier: "a1",
            },
        },
    ];

    const executionResponse: Execution.IExecutionResponse = {
        links: {
            executionResult: "resultUrl",
        },
        dimensions: [
            {
                headers: [
                    {
                        attributeHeader: {
                            identifier: "4.df",
                            uri: "/gdc/md/storybook/obj/4.df",
                            name: "Colours",
                            localIdentifier: "a1",
                            formOf: {
                                uri: "/gdc/md/storybook/obj/4",
                                identifier: "4",
                                name: "Colours",
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
                                        identifier: "1",
                                        uri: "/gdc/md/storybook/obj/1",
                                        localIdentifier: "m1",
                                        format: "#,##0.00",
                                        name: "Amount",
                                    },
                                },
                                {
                                    measureHeaderItem: {
                                        identifier: "2",
                                        uri: "/gdc/md/storybook/obj/2",
                                        localIdentifier: "m2",
                                        format: "#,##0.00",
                                        name: "Bigger Amount",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const MIN_WIDTH = 100;
    const MAX_WIDTH = 300;

    const widthValidator = (width: ColumnWidth): ColumnWidth => {
        if (Number(width) === width) {
            return Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);
        }
        return width;
    };

    const expectedColumnMap = {
        m_0: {
            width: 60,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        a_4DOTdf: {
            width: 400,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };

    const expectedColumnMapValidated = {
        m_0: {
            width: MIN_WIDTH,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        a_4DOTdf: {
            width: MAX_WIDTH,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };

    describe("convertColumnWidthsToMap", () => {
        it("should return correct IResizedColumns map", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse);
            expect(result).toEqual(expectedColumnMap);
        });

        it("should return correct IResizedColumns map and validate range of widths", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse, widthValidator);
            expect(result).toEqual(expectedColumnMapValidated);
        });
    });

    describe("getColumnWidthsFromMap", () => {
        it("should return correct ColumnWidthItem array", async () => {
            const result = getColumnWidthsFromMap(expectedColumnMap, {
                executionResponse,
                executionResult: null,
            });
            expect(result).toEqual(columnWidths);
        });

        it("should return correct ColumnWidthItem array for only column attribute", async () => {
            const columnAttributeColumnMap = {
                a_4_1: {
                    width: 400,
                    source: ColumnEventSourceType.UI_DRAGGED,
                },
            };
            const { executionResponse } = oneColumnAttributeNoMeasureResponse;
            const expectedColumnWidths: ColumnWidthItem[] = [
                {
                    measureColumnWidthItem: {
                        width: 400,
                        locators: [
                            {
                                attributeLocatorItem: {
                                    attributeIdentifier: "a1",
                                    element: "/gdc/md/storybook/obj/4/elements?id=1",
                                },
                            },
                        ],
                    },
                },
            ];

            const result = getColumnWidthsFromMap(columnAttributeColumnMap, {
                executionResponse,
                executionResult: null,
            });
            expect(result).toEqual(expectedColumnWidths);
        });
    });

    describe("enrichColumnDefinitionsWithWidths", () => {
        const coloursId = "a_4DOTdf";
        const coloursDefinition: IGridHeader = {
            headerName: "Colours",
            type: "ROW_ATTRIBUTE_COLUMN",
            field: coloursId,
            colId: coloursId,
            drillItems: [
                {
                    attributeHeader: {
                        identifier: "4.df",
                        uri: "/gdc/md/storybook/obj/4.df",
                        name: "Colours",
                        localIdentifier: "a1",
                        formOf: {
                            uri: "/gdc/md/storybook/obj/4",
                            identifier: "4",
                            name: "Colours",
                        },
                    },
                },
            ],
            index: 0,
            sort: "asc",
            cellRenderer: "loadingRenderer",
        };

        const amountId = "m_0";
        const amountDefinition: IGridHeader = {
            drillItems: [
                {
                    measureHeaderItem: {
                        identifier: "1",
                        uri: "/gdc/md/storybook/obj/1",
                        localIdentifier: "m1",
                        format: "#,##0.00",
                        name: "Amount",
                    },
                },
            ],
            headerName: "Amount",
            field: amountId,
            colId: amountId,
            type: "MEASURE_COLUMN",
            measureIndex: 0,
            index: 1,
        };

        const biggerAmountId = "m_1";
        const biggerAmount: IGridHeader = {
            drillItems: [
                {
                    measureHeaderItem: {
                        identifier: "2",
                        uri: "/gdc/md/storybook/obj/2",
                        localIdentifier: "m2",
                        format: "#,##0.00",
                        name: "Bigger Amount",
                    },
                },
            ],
            headerName: "Bigger Amount",
            field: biggerAmountId,
            colId: biggerAmountId,
            type: "MEASURE_COLUMN",
            measureIndex: 1,
            index: 2,
        };

        const columnDefinitions: IGridHeader[] = [coloursDefinition, amountDefinition, biggerAmount];

        const coloursManualWidth = 400;
        const amountManualWidth = 100;

        const manuallyResizedColumns: IResizedColumns = {
            m_0: {
                width: amountManualWidth,
                source: ColumnEventSourceType.UI_DRAGGED,
            },
            [coloursId]: {
                width: coloursManualWidth,
                source: ColumnEventSourceType.UI_DRAGGED,
            },
        };

        const coloursAutoWidth = 76;
        const amountAutoWidth = 77;
        const biggerAmountAutoWidth = 116;

        const autoResizeColumns: IResizedColumns = {
            [amountId]: {
                width: amountAutoWidth,
                source: ColumnEventSourceType.AUTOSIZE_COLUMNS,
            },
            [coloursId]: {
                width: coloursAutoWidth,
                source: ColumnEventSourceType.AUTOSIZE_COLUMNS,
            },
            [biggerAmountId]: {
                width: biggerAmountAutoWidth,
                source: ColumnEventSourceType.AUTOSIZE_COLUMNS,
            },
        };

        const coloursGrowToFitWidth = 400;
        const amountGrowToFitWidth = 400;
        const biggerAmountGrowToFitWidth = 400;

        const growToFitResizeColumns: IResizedColumns = {
            [amountId]: {
                width: amountGrowToFitWidth,
                source: ColumnEventSourceType.FIT_GROW,
            },
            [coloursId]: {
                width: coloursGrowToFitWidth,
                source: ColumnEventSourceType.FIT_GROW,
            },
            [biggerAmountId]: {
                width: biggerAmountGrowToFitWidth,
                source: ColumnEventSourceType.FIT_GROW,
            },
        };

        const overLimitWidth = MANUALLY_SIZED_MAX_WIDTH + 100;

        const getGrowToFitResizeColumnsOverLimit = () => {
            return {
                ...growToFitResizeColumns,
                [amountId]: { width: overLimitWidth, source: ColumnEventSourceType.FIT_GROW },
            };
        };
        describe("manually resized", () => {
            it("should correctly enrich columns definition by manually resized columns, auto resize map is empty and growToFit off", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: coloursManualWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: amountManualWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: DEFAULT_COLUMN_WIDTH,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    manuallyResizedColumns,
                    {},
                    DEFAULT_COLUMN_WIDTH,
                    false,
                    {},
                );

                expect(result).toEqual(expectedColumnDefinition);
            });

            it("should correctly enrich columns definition by manually and auto resized columns and growToFit off", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: coloursManualWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: amountManualWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountAutoWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    manuallyResizedColumns,
                    autoResizeColumns,
                    DEFAULT_COLUMN_WIDTH,
                    false,
                    {},
                );

                expect(result).toEqual(expectedColumnDefinition);
            });

            it("should correctly enrich columns definition by manually and auto resized columns and growToFit on", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: coloursManualWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: true,
                        width: amountManualWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountGrowToFitWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    manuallyResizedColumns,
                    autoResizeColumns,
                    DEFAULT_COLUMN_WIDTH,
                    true,
                    growToFitResizeColumns,
                );

                expect(result).toEqual(expectedColumnDefinition);
            });
        });

        describe("auto resized", () => {
            it("should correctly enrich columns definition by auto resized columns, manual resize map is empty and growToFit off", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: coloursAutoWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: amountAutoWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountAutoWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    {},
                    autoResizeColumns,
                    DEFAULT_COLUMN_WIDTH,
                    false,
                    {},
                );

                expect(result).toEqual(expectedColumnDefinition);
            });

            it("should correctly enrich columns definition by auto resized columns, manual resize map is empty and growToFit on", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: coloursGrowToFitWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: amountGrowToFitWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountGrowToFitWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    {},
                    autoResizeColumns,
                    DEFAULT_COLUMN_WIDTH,
                    true,
                    growToFitResizeColumns,
                );

                expect(result).toEqual(expectedColumnDefinition);
            });
        });

        describe("growToFit", () => {
            it("should correctly enrich columns definition, manual resize map is empty by auto resized columns map is and growToFit on", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: coloursGrowToFitWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: amountGrowToFitWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountGrowToFitWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    {},
                    {},
                    DEFAULT_COLUMN_WIDTH,
                    true,
                    growToFitResizeColumns,
                );

                expect(result).toEqual(expectedColumnDefinition);
            });

            it("should set maxWidth to undefined when growToFit width si bigger than MANUALLY_SIZED_MAX_WIDTH", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: coloursGrowToFitWidth,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: undefined,
                        suppressSizeToFit: false,
                        width: overLimitWidth,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: biggerAmountGrowToFitWidth,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    {},
                    {},
                    DEFAULT_COLUMN_WIDTH,
                    true,
                    getGrowToFitResizeColumnsOverLimit(),
                );

                expect(result).toEqual(expectedColumnDefinition);
            });
        });

        describe("no column sizing", () => {
            it("should get column definitions with default width", async () => {
                const expectedColumnDefinition = [
                    {
                        ...coloursDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: DEFAULT_COLUMN_WIDTH,
                    },
                    {
                        ...amountDefinition,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: DEFAULT_COLUMN_WIDTH,
                    },
                    {
                        ...biggerAmount,
                        maxWidth: MANUALLY_SIZED_MAX_WIDTH,
                        suppressSizeToFit: false,
                        width: DEFAULT_COLUMN_WIDTH,
                    },
                ];

                const result = enrichColumnDefinitionsWithWidths(
                    columnDefinitions,
                    {},
                    {},
                    DEFAULT_COLUMN_WIDTH,
                    false,
                    getGrowToFitResizeColumnsOverLimit(),
                );

                expect(result).toEqual(expectedColumnDefinition);
            });
        });
    });

    function getFakeColumnApi(columnsMaps: { [id: string]: Column }): ColumnApi {
        const fakeColumnApi = {
            getColumn: (columnId: string) => {
                return columnsMaps[columnId];
            },
            setColumnWidth: (column: Column, width: number) => {
                columnsMaps[column.getColId()].getColDef().width = width;
            },
            getAllColumns: () => {
                return Object.keys(columnsMaps).map((colId: string) => columnsMaps[colId]);
            },
        };
        return fakeColumnApi as ColumnApi;
    }

    function getFakeColumn(columnDefinition: any): Column {
        const fakeColumn = {
            getColDef: () => {
                return columnDefinition;
            },
            getColId: () => {
                return columnDefinition.colId;
            },
        };

        return fakeColumn as Column;
    }

    const colId1 = "colId1";
    const colId2 = "colId2";
    const colId3 = "colId3";

    const oldResizeColumns: IResizedColumns = {
        [colId1]: {
            width: 100,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        [colId2]: {
            width: 200,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };
    const newResizeColumns: IResizedColumns = {
        [colId2]: {
            width: 400,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
        [colId3]: {
            width: 500,
            source: ColumnEventSourceType.UI_DRAGGED,
        },
    };

    describe("syncSuppressSizeToFitOnColumns", () => {
        it("should set correctly suppressSizeToFit for columns ", () => {
            const columnDef1 = { suppressSizeToFit: true, width: 100, colId: colId1 };
            const columnDef2 = { suppressSizeToFit: true, width: 200, colId: colId2 };
            const columnDef3 = { suppressSizeToFit: false, width: 200, colId: colId3 };

            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
            };

            const columnApi = getFakeColumnApi(columnsMaps);

            syncSuppressSizeToFitOnColumns(oldResizeColumns, newResizeColumns, columnApi);

            expect(columnDef1.suppressSizeToFit).toEqual(false);

            expect(columnDef2.suppressSizeToFit).toEqual(true);

            expect(columnDef3.suppressSizeToFit).toEqual(true);
        });
    });

    describe("resetColumnsWidthToDefault", () => {
        it("should set correctly widths for columns: manual>auto>default", () => {
            const columnDef1 = { suppressSizeToFit: true, width: 100, colId: colId1 };
            const columnDef2 = { suppressSizeToFit: true, width: 200, colId: colId2 };
            const columnDef3 = { suppressSizeToFit: false, width: 200, colId: colId3 };

            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
            };

            const columnApi = getFakeColumnApi(columnsMaps);

            const manualWidths = {
                colId1: {
                    width: 300,
                    source: ColumnEventSourceType.UI_DRAGGED,
                },
            };

            const autoWidths = {
                colId1: {
                    width: 150,
                    source: ColumnEventSourceType.UI_DRAGGED,
                },
                colId2: {
                    width: 400,
                    source: ColumnEventSourceType.UI_DRAGGED,
                },
            };
            const defaultWidth = 250;

            resetColumnsWidthToDefault(
                columnApi,
                columnApi.getAllColumns(),
                manualWidths,
                autoWidths,
                defaultWidth,
            );

            expect(columnDef1.width).toEqual(300);

            expect(columnDef2.width).toEqual(400);

            expect(columnDef3.width).toEqual(250);
        });
    });
});
