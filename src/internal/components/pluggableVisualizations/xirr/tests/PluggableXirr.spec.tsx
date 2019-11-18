// (C) 2019 GoodData Corporation
import * as React from "react";
import * as ReactDom from "react-dom";
import cloneDeep = require("lodash/cloneDeep");
import { PluggableXirr } from "../PluggableXirr";
import {
    IVisConstruct,
    IVisualizationProperties,
    IVisProps,
    IBucket,
    IFilters,
} from "../../../../interfaces/Visualization";
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import * as testMocks from "../../../../mocks/testMocks";
import { Xirr } from "../../../../../components/core/Xirr";

describe("PluggableXirr", () => {
    const defaultProps = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: "invalid",
        callbacks: {
            afterRender: jest.fn(),
            pushData: jest.fn(),
            onLoadingChanged: jest.fn(),
            onError: jest.fn(),
        },
    };

    function createComponent(customProps: Partial<IVisConstruct> = {}) {
        return new PluggableXirr({
            ...defaultProps,
            ...customProps,
        });
    }

    describe("init", () => {
        it("should not call pushData during init", () => {
            const pushData = jest.fn();

            createComponent({
                callbacks: {
                    pushData,
                },
            });

            expect(pushData).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        const getTestOptions = (): IVisProps => ({
            dataSource: testMocks.dummyDataSource,
            resultSpec: testMocks.dummyTableResultSpec,
            dimensions: {
                width: 12,
                height: 14,
            },
            custom: {
                stickyHeaderOffset: 0,
                drillableItems: [],
            },
            locale: "en-US",
        });

        it("should not render xirr when dataSource is missing", () => {
            const fakeElement: any = "fake element";
            const reactCreateElementSpy = jest
                .spyOn(React, "createElement")
                .mockImplementation(() => fakeElement);
            const reactRenderSpy = jest.spyOn(ReactDom, "render").mockImplementation(jest.fn());

            const headline = createComponent();

            const properties: IVisualizationProperties = {};
            const options: IVisProps = getTestOptions();

            headline.update({ ...options, dataSource: null }, properties, testMocks.emptyMdObject);

            expect(reactRenderSpy).toHaveBeenCalledTimes(0);

            reactCreateElementSpy.mockReset();
            reactRenderSpy.mockReset();
        });

        const createExpectedProps = (options: IVisProps, overrides = {}) => ({
            projectId: "PROJECTID",
            config: undefined as any,
            drillableItems: options.custom.drillableItems,
            locale: options.locale,
            dataSource: options.dataSource,
            resultSpec: {
                ...options.resultSpec,
                dimensions: [{ itemIdentifiers: ["measureGroup"] }],
            },
            afterRender: defaultProps.callbacks.afterRender,
            onLoadingChanged: defaultProps.callbacks.onLoadingChanged,
            pushData: defaultProps.callbacks.pushData,
            onError: defaultProps.callbacks.onError,
            ErrorComponent: null as any,
            LoadingComponent: null as any,
            ...overrides,
        });

        it("should render XIRR by react to given element passing down properties", () => {
            const fakeElement: any = "fake element";
            const reactCreateElementSpy = jest
                .spyOn(React, "createElement")
                .mockImplementation(() => fakeElement);
            const reactRenderSpy = jest.spyOn(ReactDom, "render").mockImplementation(jest.fn());

            const headline = createComponent();
            const options: IVisProps = getTestOptions();

            headline.update(options, null, testMocks.emptyMdObject);

            expect(reactCreateElementSpy.mock.calls[0][0]).toBe(Xirr);
            expect(reactCreateElementSpy.mock.calls[0][1]).toEqual(createExpectedProps(options));
            expect(reactRenderSpy).toHaveBeenCalledWith(
                fakeElement,
                document.querySelector(defaultProps.element),
            );

            reactCreateElementSpy.mockReset();
            reactRenderSpy.mockReset();
        });

        it("should correctly set config.disableDrillUnderline from FeatureFlag disableKpiDashboardHeadlineUnderline", () => {
            const fakeElement: any = "fake element";
            const reactCreateElementSpy = jest
                .spyOn(React, "createElement")
                .mockImplementation(() => fakeElement);
            const reactRenderSpy = jest.spyOn(ReactDom, "render").mockImplementation(jest.fn());

            const headline = createComponent({
                featureFlags: {
                    disableKpiDashboardHeadlineUnderline: true,
                },
            });

            const options: IVisProps = getTestOptions();

            headline.update(options, null, testMocks.emptyMdObject);

            expect(reactCreateElementSpy.mock.calls[0][0]).toBe(Xirr);
            expect(reactCreateElementSpy.mock.calls[0][1]).toEqual(
                createExpectedProps(options, {
                    config: {
                        disableDrillUnderline: true,
                    },
                }),
            );

            reactCreateElementSpy.mockReset();
            reactRenderSpy.mockReset();
        });
    });

    describe("getExtendedReferencePoint", () => {
        it("should return proper extended reference point", async () => {
            const extendedReferencePoint = await createComponent().getExtendedReferencePoint(
                referencePointMocks.measuresAndDateReferencePoint,
            );

            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: referencePointMocks.measuresAndDateReferencePoint.buckets[0].items.slice(0, 1),
                },
                {
                    localIdentifier: "attribute",
                    items: referencePointMocks.measuresAndDateReferencePoint.buckets[1].items.slice(0, 1),
                },
            ];

            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };

            expect(extendedReferencePoint).toEqual({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: uiConfigMocks.fullySpecifiedXirrUiConfig,
            });
        });

        it("should correctly process empty reference point", async () => {
            const headline = createComponent();
            const extendedReferencePoint = await headline.getExtendedReferencePoint(
                referencePointMocks.emptyReferencePoint,
            );

            const expectedBuckets: IBucket[] = [
                {
                    localIdentifier: "measures",
                    items: [],
                },
                {
                    localIdentifier: "attribute",
                    items: [],
                },
            ];

            const expectedFilters: IFilters = {
                localIdentifier: "filters",
                items: [],
            };

            const expectedUiConfig = cloneDeep(uiConfigMocks.fullySpecifiedXirrUiConfig);
            expectedUiConfig.buckets.measures.canAddItems = true;
            expectedUiConfig.buckets.attribute.canAddItems = true;

            expect(extendedReferencePoint).toMatchObject({
                buckets: expectedBuckets,
                filters: expectedFilters,
                properties: {},
                uiConfig: expectedUiConfig,
            });
        });
    });
});
