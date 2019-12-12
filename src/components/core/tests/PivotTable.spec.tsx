// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { oneAttributeOneMeasureSortByMeasureExecutionObject } from "../../../execution/fixtures/ExecuteAfm.fixtures";
import { createIntlMock } from "../../visualizations/utils/intlUtils";
import noop = require("lodash/noop");

import {
    PivotTable,
    PivotTableInner,
    IPivotTableInnerProps,
    WATCHING_TABLE_RENDERED_INTERVAL,
    WATCHING_TABLE_RENDERED_MAX_TIME,
} from "../PivotTable";
import {
    oneMeasureDataSource,
    oneAttributeOneMeasureDataSource,
    twoMeasuresOneDimensionDataSource,
    executionObjectWithTotalsDataSource,
} from "../../tests/mocks";
import { getParsedFields } from "../pivotTable/agGridUtils";
import { GroupingProviderFactory } from "../pivotTable/GroupingProvider";
import * as stickyRowHandler from "../pivotTable/stickyRowHandler";
import agGridApiWrapper from "../pivotTable/agGridApiWrapper";
import { AgGridReact } from "ag-grid-react";
import { waitFor } from "../../filters/AttributeFilter/tests/utils";
import { IGridCellEvent } from "../pivotTable/agGridTypes";
import { IDrillEventExtended } from "../../../interfaces/DrillEvents";
import { Execution } from "@gooddata/typings";

const intl = createIntlMock();

const waitForDataLoaded = (wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}>>) => () => {
    wrapper.update();
    const table = wrapper.find(PivotTableInner);
    return table.prop("execution") !== null;
};

describe("PivotTable", () => {
    function renderComponent(
        customProps: Partial<IPivotTableInnerProps> = {},
        dataSource = oneMeasureDataSource,
    ) {
        return mount(
            <PivotTable
                dataSource={dataSource}
                updateTotals={noop as any}
                getPage={noop as any}
                intl={intl}
                {...customProps}
            />,
        );
    }

    function getTableInstance(customProps: Partial<IPivotTableInnerProps> = {}) {
        const wrapper = renderComponent(customProps);
        const table = wrapper.find(PivotTableInner);
        return table.instance() as any;
    }

    function getTableInstanceFromWrapper(wrapper: ReactWrapper) {
        const table = wrapper.find(PivotTableInner);
        return table.instance() as any;
    }

    it("should render PivotTableInner", () => {
        const wrapper = renderComponent();
        expect(wrapper.find(PivotTableInner)).toHaveLength(1);
    });

    describe("cellClick", () => {
        const measureCellEvent: Partial<IGridCellEvent> = {
            colDef: {
                drillItems: [
                    {
                        measureHeaderItem: {
                            format: "#,##0.00",
                            identifier: "1",
                            localIdentifier: "m1",
                            name: "Amount",
                            uri: "/gdc/md/storybook/obj/1",
                        },
                    },
                ],
                field: "m_0",
            },
            rowIndex: 0,
            data: {
                headerItemMap: {
                    a_4DOTdf: {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                },
                a_4DOTdf: "Pink",
                m_0: "100",
            },
        };

        const attributeCellEvent: Partial<IGridCellEvent> = {
            colDef: {
                drillItems: [
                    {
                        attributeHeader: {
                            formOf: { uri: "/gdc/md/storybook/obj/4", identifier: "4", name: "Colours" },
                            identifier: "4.df",
                            localIdentifier: "a1",
                            name: "Colours",
                            uri: "/gdc/md/storybook/obj/4.df",
                        },
                    },
                ],
                field: "a_4DOTdf",
            },
            rowIndex: 0,
            data: {
                headerItemMap: {
                    a_4DOTdf: {
                        attributeHeaderItem: {
                            uri: "/gdc/md/storybook/obj/4/elements?id=1",
                            name: "Pink",
                        },
                    },
                },
                a_4DOTdf: "Pink",
                m_0: "100",
            },
        };
        it("should not call onDrill callback when drill is NOT active", async () => {
            const onDrill = jest.fn();
            const wrapper = renderComponent(
                {
                    onDrill,
                    onFiredDrillEvent: () => false, // to turn off legacy drill callback
                },
                oneAttributeOneMeasureDataSource,
            );
            await waitFor(waitForDataLoaded(wrapper));

            const table = getTableInstanceFromWrapper(wrapper);
            table.cellClicked(measureCellEvent as any);

            expect(onDrill).not.toHaveBeenCalled();
        });

        it("should call provided onDrill callback when drill is active", async () => {
            const onDrill = jest.fn();
            const drillableItems = [
                {
                    uri: "/gdc/md/storybook/obj/1",
                },
                {
                    uri: "/gdc/md/storybook/obj/4.df",
                },
            ];

            const expectedDrillEvent: IDrillEventExtended = {
                executionContext: oneAttributeOneMeasureDataSource.getAfm(),
                drillContext: {
                    columnIndex: 1,
                    element: "cell",
                    intersection: [
                        {
                            header: {
                                ...(measureCellEvent.colDef.drillItems[0] as Execution.IMeasureHeaderItem),
                            },
                        },
                        {
                            header: {
                                ...measureCellEvent.data.headerItemMap.a_4DOTdf,
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
                        },
                    ],
                    row: [
                        {
                            id: "1",
                            name: "Pink",
                        },
                        "100",
                    ],
                    rowIndex: 0,
                    type: "table",
                },
            };
            const wrapper = renderComponent(
                {
                    drillableItems,
                    onDrill,
                    onFiredDrillEvent: () => false, // to turn off legacy drill callback
                },
                oneAttributeOneMeasureDataSource,
            );
            await waitFor(waitForDataLoaded(wrapper));

            const table = getTableInstanceFromWrapper(wrapper);
            table.cellClicked(measureCellEvent as any);

            expect(onDrill).toHaveBeenCalledWith(expectedDrillEvent);
        });

        it("should call onDrill on attribute item cell click", async () => {
            const onDrill = jest.fn();
            const drillableItems = [
                {
                    uri: "/gdc/md/storybook/obj/4.df",
                },
            ];

            const expectedDrillEvent: IDrillEventExtended = {
                executionContext: oneAttributeOneMeasureDataSource.getAfm(),
                drillContext: {
                    columnIndex: 0,
                    element: "cell",
                    intersection: [
                        {
                            header: {
                                ...attributeCellEvent.data.headerItemMap.a_4DOTdf,
                                ...attributeCellEvent.colDef.drillItems[0],
                            },
                        },
                    ],
                    row: [
                        {
                            id: "1",
                            name: "Pink",
                        },
                        "100",
                    ],
                    rowIndex: 0,
                    type: "table",
                },
            };
            const wrapper = renderComponent(
                {
                    drillableItems,
                    onDrill,
                    onFiredDrillEvent: () => false, // to turn off legacy drill callback
                },
                oneAttributeOneMeasureDataSource,
            );
            await waitFor(waitForDataLoaded(wrapper));

            const table = getTableInstanceFromWrapper(wrapper);
            table.cellClicked(attributeCellEvent as any);

            expect(onDrill).toHaveBeenCalledWith(expectedDrillEvent);
        });
    });

    describe("groupRows for attribute columns", () => {
        let createProvider: jest.SpyInstance;

        function renderComponentForGrouping(customProps: Partial<IPivotTableInnerProps> = {}) {
            return renderComponent(customProps, oneAttributeOneMeasureDataSource);
        }

        beforeEach(() => {
            createProvider = jest.spyOn(GroupingProviderFactory, "createProvider");
        });

        afterEach(() => {
            createProvider.mockRestore();
        });

        // tslint:disable-next-line:max-line-length
        it("should group rows when sorted by first attribute (default sort)", () => {
            renderComponentForGrouping();

            expect(createProvider).toHaveBeenCalledTimes(1);
            expect(createProvider).toHaveBeenCalledWith(true);
        });

        it("should NOT group rows when not sorted by first attribute", done => {
            // check second async invocation since we are waiting for datasource to be updated with specified resultSpec
            const onDataSourceUpdateSuccess = () => {
                expect(createProvider).toHaveBeenCalledTimes(2);
                expect(createProvider).toHaveBeenNthCalledWith(2, false);
                done();
            };

            renderComponentForGrouping({
                resultSpec: oneAttributeOneMeasureSortByMeasureExecutionObject.execution.resultSpec,
                onDataSourceUpdateSuccess,
            });
        });

        it("should NOT group rows when grouping switched by property after render", () => {
            const wrapper = renderComponentForGrouping();

            wrapper.setProps({
                groupRows: false,
            });

            expect(createProvider).toHaveBeenCalledTimes(2);
            expect(createProvider).toHaveBeenNthCalledWith(2, false);
        });
    });

    describe("isTableHidden", () => {
        it("should return true if columnDefs are empty", () => {
            const table = getTableInstance();
            expect(table.isTableHidden()).toEqual(true);
        });

        it("should return false if columnDefs are not empty", () => {
            const table = getTableInstance();
            table.setState({ columnDefs: [{ field: "field_id" }] });
            expect(table.isTableHidden()).toEqual(false);
        });
    });

    describe("onModelUpdated", () => {
        let updateStickyRowPosition: jest.SpyInstance;
        let getPinnedTopRowElement: jest.SpyInstance;

        beforeEach(() => {
            getPinnedTopRowElement = jest.spyOn(agGridApiWrapper, "getPinnedTopRowElement");
            updateStickyRowPosition = jest.spyOn(stickyRowHandler, "updateStickyRowPosition");
            updateStickyRowPosition.mockImplementation(noop);
        });

        afterEach(() => {
            updateStickyRowPosition.mockRestore();
            getPinnedTopRowElement.mockRestore();
        });

        it("should not update sticky row when sticky element does not exist", () => {
            const tableInstance = getTableInstance();
            jest.spyOn(tableInstance, "getGridApi").mockImplementation(() => ({}));
            const updateStickyRow = jest.spyOn(tableInstance, "updateStickyRowContent");
            getPinnedTopRowElement.mockImplementation(() => undefined);

            tableInstance.onModelUpdated();

            expect(updateStickyRow).toHaveBeenCalledTimes(0);
            expect(updateStickyRowPosition).toHaveBeenCalledTimes(0);
        });

        it("should update sticky row when sticky element exists", () => {
            const tableInstance = getTableInstance();

            jest.spyOn(tableInstance, "getGridApi").mockImplementation(() => ({}));
            const updateStickyRow = jest.spyOn(tableInstance, "updateStickyRowContent");
            updateStickyRow.mockImplementation(noop);
            getPinnedTopRowElement.mockImplementation(() => ({}));

            tableInstance.onModelUpdated();

            expect(updateStickyRow).toHaveBeenCalledTimes(1);
            expect(updateStickyRowPosition).toHaveBeenCalledTimes(1);
        });
    });

    describe("onFirstDataRendered", () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        it("should start watching table rendered", () => {
            const table = getTableInstance();
            table.onFirstDataRendered();
            expect(setInterval).toHaveBeenCalledWith(
                table.startWatchingTableRendered,
                WATCHING_TABLE_RENDERED_INTERVAL,
            );
        });

        it("should set timeout for watching", () => {
            const table = getTableInstance();
            table.onFirstDataRendered();
            expect(setTimeout).toHaveBeenCalledWith(
                table.stopWatchingTableRendered,
                WATCHING_TABLE_RENDERED_MAX_TIME,
            );
        });

        it("should stop watching with unmounted table", () => {
            const table = getTableInstance();
            table.containerRef = null;
            table.watchingIntervalId = 123;
            jest.spyOn(table, "stopWatchingTableRendered");

            table.startWatchingTableRendered();
            expect(table.stopWatchingTableRendered).toHaveBeenCalledTimes(1);
            expect(clearInterval).toHaveBeenCalledTimes(1);
        });

        it("should call afterRender after table rendered", () => {
            const afterRender = jest.fn();

            const table = getTableInstance({ afterRender });
            table.isTableHidden = jest.fn().mockReturnValueOnce(false);
            table.watchingIntervalId = 123;
            table.watchingTimeoutId = 456;
            jest.spyOn(table, "stopWatchingTableRendered");

            table.startWatchingTableRendered();

            expect(table.stopWatchingTableRendered).toHaveBeenCalledTimes(1);

            expect(clearInterval).toHaveBeenNthCalledWith(1, 123);
            expect(clearTimeout).toHaveBeenNthCalledWith(1, 456);

            expect(afterRender).toHaveBeenCalledTimes(1);
        });

        it("should call afterRender after timeout", () => {
            const afterRender = jest.fn();

            const table = getTableInstance({ afterRender });
            table.watchingIntervalId = 123;
            table.watchingTimeoutId = 456;

            table.stopWatchingTableRendered();

            expect(clearInterval).toHaveBeenNthCalledWith(1, 123);
            expect(clearTimeout).toHaveBeenNthCalledWith(1, 456);

            expect(table.watchingIntervalId).toBe(null);
            expect(table.watchingTimeoutId).toBe(null);

            expect(afterRender).toHaveBeenCalledTimes(1);
        });
    });

    describe("Reset agGridReact", () => {
        it("should reset component when datasource AFM has changed except nativeTotals", () => {
            const wrapper = renderComponent({
                dataSource: twoMeasuresOneDimensionDataSource,
            });

            const agGridComponent = wrapper.find(AgGridReact);
            const agGridComponentKey = agGridComponent.key();

            wrapper.setProps({
                dataSource: executionObjectWithTotalsDataSource,
            });

            const currentInnerComponent = wrapper.find(AgGridReact);
            expect(currentInnerComponent.key()).not.toEqual(agGridComponentKey);
        });

        it("should NOT reset component when datasource AFM has not changed", () => {
            const wrapper = renderComponent();

            const agGridComponent = wrapper.find(AgGridReact);
            const agGridComponentKey = agGridComponent.key();

            wrapper.setProps({
                resultSpec: { dimensions: [] },
            });

            const currentInnerComponent = wrapper.find(AgGridReact);
            expect(currentInnerComponent.key()).toEqual(agGridComponentKey);
        });
    });
});

describe("getParsedFields", () => {
    it("should return last parsed field from colId", () => {
        expect(getParsedFields("a_2009")).toEqual([["a", "2009"]]);
        expect(getParsedFields("a_2009_4-a_2071_12")).toEqual([["a", "2009", "4"], ["a", "2071", "12"]]);
        expect(getParsedFields("a_2009_4-a_2071_12-m_3")).toEqual([
            ["a", "2009", "4"],
            ["a", "2071", "12"],
            ["m", "3"],
        ]);
    });
});
