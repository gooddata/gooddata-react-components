// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import * as ReactDom from "react-dom";
import { AFM } from "@gooddata/typings";

import { getColumnAttributes, getRowAttributes, PluggablePivotTable } from "../PluggablePivotTable";
import * as testMocks from "../../../../mocks/testMocks";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import {
    IBucket,
    IBucketItem,
    IExtendedReferencePoint,
    IFilters,
    ILocale,
    IVisConstruct,
    IVisProps,
    IVisualizationPropertiesWrapper,
} from "../../../../interfaces/Visualization";
import { IDrillableItem } from "../../../../../interfaces/DrillEvents";
import { PivotTable } from "../../../../../components/core/PivotTable";
import { DEFAULT_LOCALE } from "../../../../../constants/localization";
import { IPivotTableConfig, IColumnSizing, ColumnWidthItem } from "../../../../../interfaces/PivotTable";
import noop = require("lodash/noop");
import cloneDeep = require("lodash/cloneDeep");
import SpyInstance = jest.SpyInstance;
import { VisualizationEnvironment } from "../../../../../components/uri/Visualization";
import {
    invalidAttributeColumnWidthItem,
    invalidMeasureColumnWidthItem,
    invalidMeasureColumnWidthItemInvalidAttribute,
    invalidMeasureColumnWidthItemLocatorsTooShort,
    invalidMeasureColumnWidthItemTooManyLocators,
    validAttributeColumnWidthItem,
    validMeasureColumnWidthItem,
    transformedWeakMeasureColumnWidth,
} from "./widthItemsMock";
import {
    invalidAttributeSort,
    invalidMeasureSortInvalidMeasure,
    invalidMeasureSortInvalidAttribute,
    invalidMeasureSortLocatorsTooShort,
    invalidMeasureSortTooManyLocators,
    validAttributeSort,
    validMeasureSort,
} from "./sortItemsMock";
import { getMockReferencePoint } from "./testHelper";

describe("PluggablePivotTable", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "#tableElement",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
            onError: noop,
            onLoadingChanged: noop,
        },
    };

    function createComponent(props: IVisConstruct = defaultProps) {
        // tslint:disable-next-line:no-inner-html
        document.body.innerHTML = '<div id="tableElement" />';
        return new PluggablePivotTable(props);
    }

    it("should create visualization", () => {
        const visualization = createComponent();
        expect(visualization).toBeTruthy();
    });

    describe("update", () => {
        function getDefaultOptions(): IVisProps {
            const locale: ILocale = DEFAULT_LOCALE;
            const drillableItems: IDrillableItem[] = [];
            return {
                dataSource: testMocks.dummyDataSource,
                resultSpec: testMocks.dummyTableResultSpec,
                locale,
                custom: {
                    drillableItems,
                },
                dimensions: {
                    width: 123,
                    height: 234,
                },
            };
        }

        function spyOnFakeElement() {
            const fakeElement: any = {};
            const createElementSpy = jest.spyOn(React, "createElement");
            createElementSpy.mockReturnValue(fakeElement);
            return createElementSpy;
        }

        function spyOnRender() {
            const renderSpy = jest.spyOn(ReactDom, "render");
            renderSpy.mockImplementation(noop);
            return renderSpy;
        }

        function spyOnCleanup(renderSpy: SpyInstance<any>, createElementSpy: SpyInstance<any>) {
            const targetNode = document.querySelector(defaultProps.element);
            expect(renderSpy).toHaveBeenCalledWith({}, targetNode);

            createElementSpy.mockRestore();
            renderSpy.mockRestore();
        }

        const emptyProperties = { properties: {} };

        it("should not render table when dataSource is missing", () => {
            const pivotTable = createComponent();

            const createElementSpy = spyOnFakeElement();
            const renderSpy = spyOnRender();

            const options = getDefaultOptions();
            pivotTable.update(
                { ...options, dataSource: null },
                emptyProperties,
                testMocks.emptyMdObject,
                null,
            );

            expect(renderSpy).toHaveBeenCalledTimes(0);

            createElementSpy.mockRestore();
            renderSpy.mockRestore();
        });

        it("should have correct props", () => {
            const pivotTable = createComponent();
            const options = getDefaultOptions();
            const defaultConfig = {
                menu: {
                    aggregations: true,
                    aggregationsSubMenu: true,
                },
            };
            const extendedConfig = {
                ...defaultConfig,
                maxHeight: 200,
            };
            const props = pivotTable.getExtendedPivotTableProps(options, extendedConfig);

            expect(props.dataSource).toEqual(testMocks.dummyDataSource);
            expect(props.resultSpec).toEqual(options.resultSpec);
            expect(props.locale).toEqual(options.locale);
            expect(props.config).toEqual(extendedConfig);
        });

        it("should handle column sizing when feature flag is active", () => {
            const pivotTable = createComponent({
                ...defaultProps,
                featureFlags: { enableTableColumnsAutoResizing: true },
            });
            const options = getDefaultOptions();
            const defaultConfig = {
                menu: {
                    aggregations: true,
                    aggregationsSubMenu: true,
                },
            };
            const extendedConfig: IPivotTableConfig = {
                ...defaultConfig,
                maxHeight: 200,
                columnSizing: { defaultWidth: "viewport" },
            };
            const props = pivotTable.getExtendedPivotTableProps(options, extendedConfig);

            expect(props.dataSource).toEqual(testMocks.dummyDataSource);
            expect(props.resultSpec).toEqual(options.resultSpec);
            expect(props.locale).toEqual(options.locale);
            expect(props.config).toEqual(extendedConfig);
        });

        it("should have onColumnResized callback when FF enableTableColumnsManualResizing is set to true", () => {
            const pivotTable = createComponent({
                ...defaultProps,
                featureFlags: { enableTableColumnsManualResizing: true },
            });

            const createElementSpy = spyOnFakeElement();
            const renderSpy = spyOnRender();

            const options = getDefaultOptions();
            pivotTable.update(options, emptyProperties, testMocks.emptyMdObject, null);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy.mock.calls[0][0]).toBe(PivotTable);

            const props: any = createElementSpy.mock.calls[0][1];
            expect(props.onColumnResized).toBeInstanceOf(Function);
            spyOnCleanup(renderSpy, createElementSpy);
        });

        it("should not have onColumnResized callback when FF enableTableColumnsManualResizing is set to false", () => {
            const pivotTable = createComponent({
                ...defaultProps,
                featureFlags: { enableTableColumnsManualResizing: false },
            });

            const createElementSpy = spyOnFakeElement();
            const renderSpy = spyOnRender();

            const options = getDefaultOptions();
            pivotTable.update(options, emptyProperties, testMocks.emptyMdObject, null);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy.mock.calls[0][0]).toBe(PivotTable);

            const props: any = createElementSpy.mock.calls[0][1];
            expect(props.onColumnResized).toBeUndefined();
            spyOnCleanup(renderSpy, createElementSpy);
        });

        it("should render PivotTable passing down all the necessary properties", () => {
            const pivotTable = createComponent();

            const createElementSpy = spyOnFakeElement();
            const renderSpy = spyOnRender();

            const options = getDefaultOptions();
            pivotTable.update(options, emptyProperties, testMocks.emptyMdObject, null);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy.mock.calls[0][0]).toBe(PivotTable);

            const defaultConfig = {
                menu: {
                    aggregations: true,
                    aggregationsSubMenu: true,
                },
            };
            const props: any = createElementSpy.mock.calls[0][1];
            expect(props.afterRender).toEqual(defaultProps.callbacks.afterRender);
            expect(props.dataSource).toEqual(testMocks.dummyDataSource);
            expect(props.drillableItems).toEqual(options.custom.drillableItems);
            expect(props.height).toEqual(options.dimensions.height);
            expect(props.locale).toEqual(options.locale);
            expect(props.config).toEqual(defaultConfig);
            expect(props.intl).toBeTruthy();
            expect(props.onError).toEqual(defaultProps.callbacks.onError);
            expect(props.onLoadingChanged).toEqual(defaultProps.callbacks.onLoadingChanged);
            expect(props.totals).toEqual([]);
            expect(props.totalsEditAllowed).toEqual(options.custom.totalsEditAllowed);
            expect(props.resultSpec).toEqual(options.resultSpec);
            expect(props.ErrorComponent).toEqual(null);
            expect(props.LoadingComponent).toEqual(null);

            spyOnCleanup(renderSpy, createElementSpy);
        });

        describe("Passing down columnSizing props", () => {
            const columnWidths = [
                {
                    attributeColumnWidthItem: {
                        width: 740,
                        attributeIdentifier: "a1",
                    },
                },
            ];

            it.each([
                [false, false, false, "none", undefined],
                [true, false, false, "none", { columnWidths }],
                [false, true, false, "none", { defaultWidth: "viewport" }],
                [false, false, true, "none", undefined],
                [true, true, false, "none", { columnWidths, defaultWidth: "viewport" }],
                [true, false, true, "none", { columnWidths }],
                [false, true, true, "none", { defaultWidth: "viewport" }],
                [true, true, true, "none", { defaultWidth: "viewport", columnWidths }],
                [false, false, false, "dashboards", undefined],
                [true, false, false, "dashboards", { columnWidths }],
                [false, true, false, "dashboards", { defaultWidth: "viewport" }],
                [false, false, true, "dashboards", { growToFit: true }],
                [true, true, false, "dashboards", { columnWidths, defaultWidth: "viewport" }],
                [true, false, true, "dashboards", { columnWidths, growToFit: true }],
                [false, true, true, "dashboards", { defaultWidth: "viewport", growToFit: true }],
                [true, true, true, "dashboards", { columnWidths, defaultWidth: "viewport", growToFit: true }],
            ])(
                "should render PivotTable passing down correct columnSizing config base on feature manualResizing:%s autoResizing:%s growToFit:%s in environment:%s",
                (
                    enableTableColumnsManualResizing: boolean,
                    enableTableColumnsAutoResizing: boolean,
                    enableTableColumnsGrowToFit: boolean,
                    environment: VisualizationEnvironment,
                    expectedColumnSizing: IColumnSizing,
                ) => {
                    const createTableSpy = jest.fn();

                    const pivotTable = createComponent({
                        ...defaultProps,
                        featureFlags: {
                            enableTableColumnsManualResizing,
                            enableTableColumnsAutoResizing,
                            enableTableColumnsGrowToFit,
                        },
                        environment,
                    });

                    (pivotTable as any).createTable = createTableSpy;

                    const visualizationProperties: IVisualizationPropertiesWrapper = {
                        properties: {
                            controls: {
                                columnWidths,
                            },
                        },
                    };

                    const options = getDefaultOptions();
                    pivotTable.update(
                        { ...options },
                        visualizationProperties,
                        testMocks.mdObjectAttributeOnly,
                        null,
                    );

                    const props: any = createTableSpy.mock.calls[0][0];

                    expect(props.config.columnSizing).toEqual(expectedColumnSizing);
                },
            );
        });
    });

    describe("getExtendedReferencePoint", () => {
        describe("given simpleStackedReferencePoint", () => {
            const pivotTable = createComponent();
            const sourceReferencePoint = referencePointMocks.simpleStackedReferencePoint;
            const mockPivotTableReferencePoint = getMockReferencePoint(
                sourceReferencePoint.buckets[0].items,
                sourceReferencePoint.buckets[1].items,
                sourceReferencePoint.buckets[2].items,
                [],
                [],
                true,
                [],
            );
            const extendedReferencePointPromise: Promise<
                IExtendedReferencePoint
            > = pivotTable.getExtendedReferencePoint(sourceReferencePoint);

            it("should return a new reference point with adapted buckets", () => {
                const expectedBuckets: IBucket[] = mockPivotTableReferencePoint.buckets;
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
            });

            it("should return a new reference point with identical filters", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedFilters: IFilters = sourceReferencePoint.filters;
                    expect(extendedReferencePoint.filters).toEqual(expectedFilters);
                });
            });

            it("should return a new reference point with pivotTable UI config", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.uiConfig).toEqual(mockPivotTableReferencePoint.uiConfig);
                });
            });

            it("should return a new reference point with filtered sortItems (in this case identical)", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedSortItems: AFM.SortItem[] = sourceReferencePoint.properties.sortItems;
                    expect(extendedReferencePoint.properties.sortItems).toEqual(expectedSortItems);
                });
            });

            it("should return a new reference point with columnWidths", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedColumnWidths: ColumnWidthItem[] =
                        sourceReferencePoint.properties.controls.columnWidths;
                    expect(extendedReferencePoint.properties.controls.columnWidths).toEqual(
                        expectedColumnWidths,
                    );
                });
            });
        });

        describe("given multipleMetricsAndCategoriesReferencePoint", () => {
            const pivotTable = createComponent();
            const sourceReferencePoint = referencePointMocks.multipleMetricsAndCategoriesReferencePoint;
            const mockPivotTableReferencePoint = getMockReferencePoint(
                sourceReferencePoint.buckets[0].items,
                sourceReferencePoint.buckets[1].items,
                sourceReferencePoint.buckets[2].items,
            );

            const extendedReferencePointPromise: Promise<
                IExtendedReferencePoint
            > = pivotTable.getExtendedReferencePoint(sourceReferencePoint);

            it("should return a new reference point with adapted buckets", () => {
                const expectedBuckets: IBucket[] = mockPivotTableReferencePoint.buckets;
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
            });

            it("should return a new reference point with identical filters", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedFilters: IFilters = sourceReferencePoint.filters;
                    expect(extendedReferencePoint.filters).toEqual(expectedFilters);
                });
            });

            it("should return a new reference point with pivotTable UI config", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.uiConfig).toEqual(uiConfigMocks.defaultPivotTableUiConfig);
                });
            });

            it("should return a new reference point with filtered sortItems (in this case identical)", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedSortItems: AFM.SortItem[] = sourceReferencePoint.properties.sortItems;
                    expect(extendedReferencePoint.properties.sortItems).toEqual(expectedSortItems);
                });
            });
        });

        it("should return a new reference point with invalid sortItems removed", () => {
            const pivotTable = createComponent();
            const sourceReferencePoint = referencePointMocks.simpleStackedReferencePoint;
            const mockPivotTableReferencePoint = getMockReferencePoint(
                sourceReferencePoint.buckets[0].items,
                sourceReferencePoint.buckets[1].items,
                sourceReferencePoint.buckets[2].items,
                [],
                [
                    invalidAttributeSort,
                    invalidMeasureSortInvalidMeasure,
                    invalidMeasureSortInvalidAttribute,
                    invalidMeasureSortLocatorsTooShort,
                    invalidMeasureSortTooManyLocators,
                    validAttributeSort,
                    validMeasureSort,
                ],
            );
            const expectedSortItems: AFM.SortItem[] = [validAttributeSort, validMeasureSort];

            const extendedReferencePointPromise: Promise<
                IExtendedReferencePoint
            > = pivotTable.getExtendedReferencePoint(mockPivotTableReferencePoint);
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.properties.sortItems).toEqual(expectedSortItems);
            });
        });

        it("should return a new reference point with invalid columnWidths removed", () => {
            const pivotTable = createComponent();
            const sourceReferencePoint = referencePointMocks.simpleStackedReferencePoint;
            const mockPivotTableReferencePoint: IExtendedReferencePoint = getMockReferencePoint(
                sourceReferencePoint.buckets[0].items,
                sourceReferencePoint.buckets[1].items,
                sourceReferencePoint.buckets[2].items,
                [],
                [],
                true,
                [
                    invalidAttributeColumnWidthItem,
                    invalidMeasureColumnWidthItem,
                    invalidMeasureColumnWidthItemInvalidAttribute,
                    invalidMeasureColumnWidthItemLocatorsTooShort,
                    invalidMeasureColumnWidthItemTooManyLocators,
                    validAttributeColumnWidthItem,
                    validMeasureColumnWidthItem,
                ],
            );
            const expectedColumnWidthItems: ColumnWidthItem[] = [
                transformedWeakMeasureColumnWidth,
                validAttributeColumnWidthItem,
                validMeasureColumnWidthItem,
            ];

            const extendedReferencePointPromise: Promise<
                IExtendedReferencePoint
            > = pivotTable.getExtendedReferencePoint(mockPivotTableReferencePoint);
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.properties.controls.columnWidths).toEqual(
                    expectedColumnWidthItems,
                );
            });
        });

        describe("given a reference point with duplicate attributes", () => {
            const pivotTable = createComponent();
            const sourceReferencePoint = referencePointMocks.sameCategoryAndStackReferencePoint;
            const mockReferencePoint = getMockReferencePoint(
                sourceReferencePoint.buckets[0].items,
                sourceReferencePoint.buckets[1].items,
                [],
                [],
                [],
                true,
            );

            const extendedReferencePointPromise = pivotTable.getExtendedReferencePoint(sourceReferencePoint);

            it("should return a new reference point without duplicates in buckets", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedBuckets: IBucket[] = mockReferencePoint.buckets;
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
            });
        });

        describe("given an empty reference point", () => {
            const pivotTable = createComponent();
            const mockReferencePoint = getMockReferencePoint();

            const extendedReferencePointPromise = pivotTable.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );

            it("should return a new reference point with empty buckets", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedBuckets: IBucket[] = mockReferencePoint.buckets;
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
            });

            it("should return a new reference point with empty filters", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    const expectedFilters: IFilters = { localIdentifier: "filters", items: [] };
                    expect(extendedReferencePoint.filters).toEqual(expectedFilters);
                });
            });

            it("should return a new reference point with pivotTable UI config", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.uiConfig).toEqual(mockReferencePoint.uiConfig);
                });
            });

            it("should return a new reference point without sortItems (default)", () => {
                return extendedReferencePointPromise.then(extendedReferencePoint => {
                    expect(extendedReferencePoint.properties.sortItems).toBeUndefined();
                });
            });
        });

        it("should return a new reference point with totals", () => {
            const pivotTable = createComponent();
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: cloneDeep(referencePointMocks.tableTotalsReferencePoint.buckets[0].items),
                },
                {
                    localIdentifier: "attribute",
                    items: cloneDeep(referencePointMocks.tableTotalsReferencePoint.buckets[1].items),
                    totals: [
                        {
                            measureIdentifier: "m1",
                            attributeIdentifier: "a2",
                            type: "sum",
                            alias: "Sum",
                        },
                        {
                            measureIdentifier: "m2",
                            attributeIdentifier: "a1",
                            type: "nat",
                        },
                    ],
                },
                {
                    localIdentifier: "columns",
                    items: [],
                },
            ];

            return pivotTable
                .getExtendedReferencePoint(
                    referencePointMocks.tableGrandAndSubtotalsReferencePoint,
                    referencePointMocks.tableTotalsReferencePoint,
                )
                .then(extendedReferencePoint => {
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
        });

        it("should return a new reference point without updating grand totals and subtotals", () => {
            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: cloneDeep(
                        referencePointMocks.tableGrandAndSubtotalsReferencePoint.buckets[0].items,
                    ),
                },
                {
                    localIdentifier: "attribute",
                    items: cloneDeep(
                        referencePointMocks.tableGrandAndSubtotalsReferencePoint.buckets[1].items,
                    ),
                    totals: [
                        {
                            measureIdentifier: "m1",
                            attributeIdentifier: "a2",
                            type: "sum",
                            alias: "Sum",
                        },
                        {
                            measureIdentifier: "m2",
                            attributeIdentifier: "a1",
                            type: "nat",
                        },
                    ],
                },
                {
                    localIdentifier: "columns",
                    items: [],
                },
            ];

            return createComponent()
                .getExtendedReferencePoint(referencePointMocks.tableGrandAndSubtotalsReferencePoint)
                .then(extendedReferencePoint => {
                    expect(extendedReferencePoint.buckets).toEqual(expectedBuckets);
                });
        });
    });
});

const measureReferenceBucketItem: IBucketItem = {
    type: "metric",
    localIdentifier: "measure",
    attribute: "aa5JBkFDa7sJ",
    granularity: null,
    filters: [],
};

const dateReferenceBucketItem: IBucketItem = {
    granularity: "GDC.time.year",
    localIdentifier: "date",
    type: "date",
    filters: [],
    attribute: "attr.datedataset",
};

const attributeReferenceBucketItem: IBucketItem = {
    aggregation: null,
    showInPercent: null,
    granularity: "attr.restaurantlocation.locationname",
    localIdentifier: "attribute",
    type: "attribute",
    filters: [],
    attribute: "attr.restaurantlocation.locationname",
};

// Creates a theoretical bucket with one of each bucketItemTypes
const createMockBucket = (type: string): IBucket => {
    return {
        localIdentifier: type,
        items: [
            {
                ...measureReferenceBucketItem,
                localIdentifier: `${measureReferenceBucketItem.localIdentifier}_${type}`,
            },
            {
                ...dateReferenceBucketItem,
                localIdentifier: `${dateReferenceBucketItem.localIdentifier}_${type}`,
            },
            {
                ...attributeReferenceBucketItem,
                localIdentifier: `${attributeReferenceBucketItem.localIdentifier}_${type}`,
            },
        ],
    };
};

const knownBucketNames = [
    "measures",
    "secondary_measures",
    "tertiary_measures",
    "attribute",
    "attributes",
    "view",
    "stack",
    "trend",
    "segment",
    "rows",
    "columns",
];

const allBucketTypes: IBucket[] = knownBucketNames.map(bucketName => createMockBucket(bucketName));

describe("getColumnAttributes", () => {
    it("should collect common and date attributes from buckets: columns, stack, segment", () => {
        expect(getColumnAttributes(allBucketTypes)).toEqual([
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_columns",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_columns",
                showInPercent: null,
                type: "attribute",
            },
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_stack",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_stack",
                showInPercent: null,
                type: "attribute",
            },
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_segment",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_segment",
                showInPercent: null,
                type: "attribute",
            },
        ]);
    });
});

describe("getRowAttributes", () => {
    it("should collect common and date attributes from buckets: attribute, attributes, view, trend", () => {
        expect(getRowAttributes(allBucketTypes)).toEqual([
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_attribute",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_attribute",
                showInPercent: null,
                type: "attribute",
            },
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_attributes",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_attributes",
                showInPercent: null,
                type: "attribute",
            },
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_view",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_view",
                showInPercent: null,
                type: "attribute",
            },
            {
                attribute: "attr.datedataset",
                filters: [],
                granularity: "GDC.time.year",
                localIdentifier: "date_trend",
                type: "date",
            },
            {
                aggregation: null,
                attribute: "attr.restaurantlocation.locationname",
                filters: [],
                granularity: "attr.restaurantlocation.locationname",
                localIdentifier: "attribute_trend",
                showInPercent: null,
                type: "attribute",
            },
        ]);
    });
});
