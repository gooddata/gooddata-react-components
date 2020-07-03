// (C) 2007-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import {
    convertColumnWidthsToMap,
    getColumnWidthsFromMap,
    enrichColumnDefinitionsWithWidths,
    MANUALLY_SIZED_MAX_WIDTH,
    syncSuppressSizeToFitOnColumns,
    resetColumnsWidthToDefault,
    getWeakColumnWidthsFromMap,
    resizeWeakMeasureColumns,
} from "../agGridColumnSizing";
import { ColumnWidthItem, IAbsoluteColumnWidth, IResizedColumns } from "../../../../interfaces/PivotTable";
import { IGridHeader } from "../agGridTypes";
import { DEFAULT_COLUMN_WIDTH } from "../../PivotTable";

import { oneColumnAttributeNoMeasureResponse } from "../../../../execution/fixtures/ExecuteAfm.fixtures";
import {
    ResizedColumnsStore,
    IWeakMeasureColumnWidthItemsMap,
    IResizedColumnsCollection,
} from "../ResizedColumnsStore";
import { MEASURE_COLUMN, COLUMN_ATTRIBUTE_COLUMN, ROW_ATTRIBUTE_COLUMN } from "../agGridConst";
import { getFakeColumn, getFakeColumnApi } from "./agGridMock";

describe("agGridColumnSizing", () => {
    const columnWidths: ColumnWidthItem[] = [
        {
            measureColumnWidthItem: {
                width: {
                    value: 60,
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
                    value: 400,
                },
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

    const widthValidator = (width: IAbsoluteColumnWidth): IAbsoluteColumnWidth => {
        if (Number(width.value) === width.value) {
            return {
                ...width,
                value: Math.min(Math.max(width.value, MIN_WIDTH), MAX_WIDTH),
            };
        }
        return width;
    };

    const expectedColumnMap = {
        m_0: {
            width: {
                value: 60,
            },
            measureIdentifier: "m1",
        },
        a_4DOTdf: {
            width: {
                value: 400,
            },
        },
    };

    const expectedColumnMapValidated = {
        m_0: {
            width: {
                value: MIN_WIDTH,
            },
            measureIdentifier: "m1",
        },
        a_4DOTdf: {
            width: {
                value: MAX_WIDTH,
            },
        },
    };

    describe("convertColumnWidthsToMap", () => {
        it("should return correct IResizedColumnsCollection map", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse);
            expect(result).toEqual(expectedColumnMap);
        });

        it("should return correct IResizedColumnsCollection map and validate range of widths", async () => {
            const result = convertColumnWidthsToMap(columnWidths, executionResponse, widthValidator);
            expect(result).toEqual(expectedColumnMapValidated);
        });

        it("should return correct IResizedColumnsCollection map for measureColumnWidthItem with missing IMeasureLocatorItem", async () => {
            const executionResponseNoMeasures: Execution.IExecutionResponse = {
                dimensions: [
                    {
                        headers: [],
                    },
                    {
                        headers: [
                            {
                                attributeHeader: {
                                    name: "Forecast Category",
                                    localIdentifier: "a1",
                                    uri: "/gdc/md/lmnivlu3sowt63jvr2mo1wlse5fyv203/obj/64727",
                                    identifier: "label.opportunitysnapshot.forecastcategory",
                                    formOf: {
                                        name: "Forecast Category",
                                        uri: "/gdc/md/lmnivlu3sowt63jvr2mo1wlse5fyv203/obj/64726",
                                        identifier: "attr.opportunitysnapshot.forecastcategory",
                                    },
                                },
                            },
                        ],
                    },
                ],
                links: {
                    executionResult: "resultUrl",
                },
            };

            const noMeasureColumnWidths: ColumnWidthItem[] = [
                {
                    measureColumnWidthItem: {
                        width: {
                            value: 155,
                        },
                        locators: [
                            {
                                attributeLocatorItem: {
                                    attributeIdentifier: "a1",
                                    element:
                                        "/gdc/md/lmnivlu3sowt63jvr2mo1wlse5fyv203/obj/64726/elements?id=966650",
                                },
                            },
                        ],
                    },
                },
            ];

            const expectedResult: IResizedColumnsCollection = {
                a_64726_966650: { width: { value: 155 } },
            };

            const result = convertColumnWidthsToMap(
                noMeasureColumnWidths,
                executionResponseNoMeasures,
                widthValidator,
            );
            expect(result).toEqual(expectedResult);
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
                    width: {
                        value: 400,
                    },
                },
            };
            const { executionResponse } = oneColumnAttributeNoMeasureResponse;
            const expectedColumnWidths: ColumnWidthItem[] = [
                {
                    measureColumnWidthItem: {
                        width: {
                            value: 400,
                        },
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

    describe("getWeakColumnWidthsFromMap", () => {
        const weakColumnWidthsMap: IWeakMeasureColumnWidthItemsMap = {
            m1: {
                measureColumnWidthItem: {
                    width: { value: 250 },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "m1",
                        },
                    },
                },
            },
            m2: {
                measureColumnWidthItem: {
                    width: { value: 350 },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "m2",
                        },
                    },
                },
            },
        };

        const expectedColumnWidths: ColumnWidthItem[] = [
            {
                measureColumnWidthItem: {
                    width: { value: 250 },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "m1",
                        },
                    },
                },
            },
            {
                measureColumnWidthItem: {
                    width: { value: 350 },
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: "m2",
                        },
                    },
                },
            },
        ];
        it("should return columnWidths array", () => {
            expect(getWeakColumnWidthsFromMap(weakColumnWidthsMap)).toEqual(expectedColumnWidths);
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
            type: MEASURE_COLUMN,
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
            type: MEASURE_COLUMN,
            measureIndex: 1,
            index: 2,
        };

        const columnDefinitions: IGridHeader[] = [coloursDefinition, amountDefinition, biggerAmount];

        const coloursManualWidth = 400;
        const amountManualWidth = 100;

        const columDefAmount = {
            suppressSizeToFit: false,
            width: amountManualWidth,
            colId: "m_0",
            type: MEASURE_COLUMN,
        };
        const columDefColours = {
            suppressSizeToFit: false,
            width: coloursManualWidth,
            colId: coloursId,
            type: COLUMN_ATTRIBUTE_COLUMN,
        };

        const manuallyResizedColumns = new ResizedColumnsStore();
        manuallyResizedColumns.addToManuallyResizedColumn(getFakeColumn(columDefAmount));
        manuallyResizedColumns.addToManuallyResizedColumn(getFakeColumn(columDefColours));

        const coloursAutoWidth = 76;
        const amountAutoWidth = 77;
        const biggerAmountAutoWidth = 116;

        const autoResizeColumns: IResizedColumns = {
            [amountId]: {
                width: amountAutoWidth,
            },
            [coloursId]: {
                width: coloursAutoWidth,
            },
            [biggerAmountId]: {
                width: biggerAmountAutoWidth,
            },
        };

        const coloursGrowToFitWidth = 400;
        const amountGrowToFitWidth = 400;
        const biggerAmountGrowToFitWidth = 400;

        const growToFitResizeColumns: IResizedColumns = {
            [amountId]: {
                width: amountGrowToFitWidth,
            },
            [coloursId]: {
                width: coloursGrowToFitWidth,
            },
            [biggerAmountId]: {
                width: biggerAmountGrowToFitWidth,
            },
        };

        const overLimitWidth = MANUALLY_SIZED_MAX_WIDTH + 100;

        const getGrowToFitResizeColumnsOverLimit = () => {
            return {
                ...growToFitResizeColumns,
                [amountId]: { width: overLimitWidth },
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
                    new ResizedColumnsStore(),
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
                    new ResizedColumnsStore(),
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
                    new ResizedColumnsStore(),
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
                    new ResizedColumnsStore(),
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
                    new ResizedColumnsStore(),
                    {},
                    DEFAULT_COLUMN_WIDTH,
                    false,
                    getGrowToFitResizeColumnsOverLimit(),
                );

                expect(result).toEqual(expectedColumnDefinition);
            });
        });
    });

    const colId1 = "colId1";
    const colId2 = "colId2";
    const colId3 = "colId3";
    const colId4 = "colId4";

    describe("syncSuppressSizeToFitOnColumns", () => {
        it("should set correctly suppressSizeToFit for columns ", () => {
            const columnDef1 = { suppressSizeToFit: true, width: 100, colId: colId1, type: MEASURE_COLUMN };
            const columnDef2 = { suppressSizeToFit: true, width: 200, colId: colId2, type: MEASURE_COLUMN };
            const columnDef3 = { suppressSizeToFit: false, width: 200, colId: colId3, type: MEASURE_COLUMN };

            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
            };

            const columnApi = getFakeColumnApi(columnsMaps);

            const manuallyResizedColumns = new ResizedColumnsStore();
            manuallyResizedColumns.addToManuallyResizedColumn(columnsMaps.colId2);
            manuallyResizedColumns.addToManuallyResizedColumn(columnsMaps.colId3);

            syncSuppressSizeToFitOnColumns(manuallyResizedColumns, columnApi);

            expect(columnApi.getColumn(colId1).getColDef().suppressSizeToFit).toEqual(false);

            expect(columnApi.getColumn(colId2).getColDef().suppressSizeToFit).toEqual(true);

            expect(columnApi.getColumn(colId3).getColDef().suppressSizeToFit).toEqual(true);
        });
    });

    describe("resetColumnsWidthToDefault", () => {
        it("should set correctly widths for columns: manual>auto>default", () => {
            const columnDef1 = { suppressSizeToFit: true, width: 100, colId: colId1, type: MEASURE_COLUMN };
            const columnDef2 = { suppressSizeToFit: true, width: 200, colId: colId2, type: MEASURE_COLUMN };
            const columnDef3 = { suppressSizeToFit: false, width: 200, colId: colId3, type: MEASURE_COLUMN };

            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
            };

            const columnApi = getFakeColumnApi(columnsMaps);

            const manuallyResizedColumns = new ResizedColumnsStore();
            manuallyResizedColumns.addToManuallyResizedColumn(
                getFakeColumn({ suppressSizeToFit: true, width: 300, colId: colId1, type: MEASURE_COLUMN }),
            );

            const autoWidths = {
                colId1: {
                    width: 150,
                },
                colId2: {
                    width: 400,
                },
            };
            const defaultWidth = 250;

            resetColumnsWidthToDefault(
                columnApi,
                columnApi.getAllColumns(),
                manuallyResizedColumns,
                autoWidths,
                defaultWidth,
            );

            expect(columnApi.getAllColumns()[0].getActualWidth()).toEqual(300);

            expect(columnApi.getAllColumns()[1].getActualWidth()).toEqual(400);

            expect(columnApi.getAllColumns()[2].getActualWidth()).toEqual(250);
        });
    });

    describe("resizeWeakMeasureColumns", () => {
        const drillItems = [
            {
                measureHeaderItem: {
                    localIdentifier: "m1",
                    name: "Amount",
                    format: "#.##x",
                },
            },
        ];

        const columnDef1 = {
            suppressSizeToFit: true,
            width: 100,
            colId: colId1,
            type: MEASURE_COLUMN,
            drillItems,
        };
        const columnDef2 = { suppressSizeToFit: true, width: 200, colId: colId2, type: MEASURE_COLUMN };
        const columnDef3 = {
            suppressSizeToFit: false,
            width: 200,
            colId: colId3,
            type: MEASURE_COLUMN,
            drillItems,
        };
        const columnDef4 = {
            suppressSizeToFit: false,
            width: 222,
            colId: colId4,
            type: ROW_ATTRIBUTE_COLUMN,
        };

        const resizedColumnDef = {
            suppressSizeToFit: false,
            width: 333,
            colId: colId1,
            type: MEASURE_COLUMN,
            drillItems,
        };

        it("should resize all matching measure columns to the size of resized measure column", () => {
            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
                colId4: getFakeColumn(columnDef4),
            };
            const columnApi = getFakeColumnApi(columnsMaps);
            resizeWeakMeasureColumns(columnApi, new ResizedColumnsStore(), getFakeColumn(resizedColumnDef));
            expect(columnApi.getAllColumns().map(column => column.getActualWidth())).toEqual([
                333,
                200,
                333,
                222,
            ]);
        });

        it("should ignore resize of attribute column", () => {
            const columnsMaps = {
                colId1: getFakeColumn(columnDef1),
                colId2: getFakeColumn(columnDef2),
                colId3: getFakeColumn(columnDef3),
                colId4: getFakeColumn(columnDef4),
            };
            const columnApi = getFakeColumnApi(columnsMaps);
            const resizedAttrColumnDef = {
                suppressSizeToFit: false,
                width: 333,
                colId: colId1,
                type: ROW_ATTRIBUTE_COLUMN,
                drillItems,
            };

            resizeWeakMeasureColumns(
                columnApi,
                new ResizedColumnsStore(),
                getFakeColumn(resizedAttrColumnDef),
            );
            expect(columnApi.getAllColumns().map(column => column.getActualWidth())).toEqual([
                100,
                200,
                200,
                222,
            ]);
        });
    });
});
