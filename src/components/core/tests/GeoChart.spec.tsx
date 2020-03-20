// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { VisualizationObject } from "@gooddata/typings";

import { GeoChartInner, IGeoChartInnerProps } from "../GeoChart";
import { TOP, BOTTOM, LEFT, RIGHT } from "../../visualizations/chart/legend/PositionTypes";
import { PositionType } from "../../visualizations/typings/legend";
import { createIntlMock } from "../../visualizations/utils/intlUtils";
import * as BucketNames from "../../../constants/bucketNames";
import { FLUID_LEGEND_THRESHOLD } from "../../../constants/legend";
import { IGeoConfig } from "../../../interfaces/GeoChart";
import { getExecutionResponse, getExecutionResult, getGeoConfig } from "../../../../stories/data/geoChart";

const intl = createIntlMock();
const mdObject: VisualizationObject.IVisualizationObjectContent = {
    buckets: [
        {
            localIdentifier: BucketNames.LOCATION,
            items: [
                {
                    visualizationAttribute: {
                        localIdentifier: "a_State",
                        displayForm: {
                            uri: "/gdc/md/project/obj/1027",
                        },
                    },
                },
            ],
        },
    ],
    visualizationClass: {
        uri: "/gdc/md/mockproject/obj/column",
    },
};

describe("GeoChart", () => {
    function renderComponent(
        customProps: Partial<IGeoChartInnerProps> = {},
        customConfig: Partial<IGeoConfig> = {},
    ): ShallowWrapper {
        const defaultProps: Partial<IGeoChartInnerProps> = {
            config: {
                mdObject,
                mapboxToken: "",
                ...customConfig,
            },
            execution: {
                executionResponse: getExecutionResponse(true),
                executionResult: getExecutionResult(true),
            },
            height: 600,
            intl,
        };
        return shallow(<GeoChartInner {...defaultProps} {...customProps} />);
    }

    it("should render GeoChartInner", async () => {
        const wrapper = renderComponent();
        await testUtils.delay();
        wrapper.update();
        expect(wrapper.find(".s-gd-geo-component").length).toBe(1);
        expect(wrapper.hasClass("flex-direction-column")).toBe(true);
    });

    it("should render GeoChartInner has flex-direction-row class", async () => {
        const props: Partial<IGeoChartInnerProps> = {
            config: {
                legend: {
                    position: "right",
                },
                mapboxToken: "",
            },
        };
        const wrapper = renderComponent(props);
        expect(wrapper.hasClass("flex-direction-row")).toBe(true);
    });

    it("should render GeoChartInner has flex-direction-column class", async () => {
        const props: Partial<IGeoChartInnerProps> = {
            config: {
                legend: {
                    position: "bottom",
                },
                mapboxToken: "",
            },
        };
        const wrapper = renderComponent(props);
        expect(wrapper.hasClass("flex-direction-column")).toBe(true);
    });

    it("should use custom Chart renderer", () => {
        const chartRenderer = jest.fn().mockReturnValue(<div />);
        renderComponent({ chartRenderer });
        expect(chartRenderer).toHaveBeenCalledTimes(1);
    });

    it("should use custom Legend renderer", () => {
        const legendRenderer = jest.fn().mockReturnValue(<div />);
        renderComponent({ legendRenderer });
        expect(legendRenderer).toHaveBeenCalledTimes(1);
    });

    it("should call onDataTooLarge", () => {
        const onDataTooLarge = jest.fn();
        const initProps: Partial<IGeoChartInnerProps> = {
            config: { ...getGeoConfig({ isWithLocation: true }), limit: 5, mapboxToken: "" },
            execution: null,
            onDataTooLarge,
        };
        const props: Partial<IGeoChartInnerProps> = {
            config: { ...getGeoConfig({ isWithLocation: true }), limit: 5, mapboxToken: "" },
            onDataTooLarge,
            execution: {
                executionResponse: getExecutionResponse(true),
                executionResult: getExecutionResult(true),
            },
        };
        const component = renderComponent(initProps);
        component.setProps(props);
        expect(onDataTooLarge).toBeCalled();
    });

    it("should update GeoChartInner’s state with new props", () => {
        const initProps: Partial<IGeoChartInnerProps> = {
            config: getGeoConfig({ isWithLocation: true, isWithSegment: true, isWithSize: true }),
            execution: null,
        };
        const props: Partial<IGeoChartInnerProps> = {
            config: getGeoConfig({ isWithLocation: true, isWithSegment: true, isWithSize: true }),
            execution: {
                executionResponse: getExecutionResponse(true, true, false, true),
                executionResult: getExecutionResult(true, true, false, true),
            },
        };
        const expectedState = [
            {
                name: "General Goods",
                legendIndex: 0,
                color: "rgb(20,178,226)",
                isVisible: true,
            },
            {
                name: "Toy Store",
                legendIndex: 1,
                color: "rgb(0,193,141)",
                isVisible: true,
            },
        ];
        const wrapper = renderComponent(initProps);
        wrapper.setProps(props);
        expect(wrapper.state("enabledLegendItems")).toEqual(expectedState);
    });

    describe("GeoChart Legend", () => {
        const defaultDocumentObj: any = {
            documentElement: {
                clientWidth: FLUID_LEGEND_THRESHOLD,
            },
        };

        interface ICustomComponentProps {
            documentObj?: any;
            height?: number;
            position?: PositionType;
            responsive?: boolean;
        }

        const customComponentProps = (props: ICustomComponentProps): Partial<IGeoChartInnerProps> => {
            const { height = 600, position, responsive = false, documentObj = defaultDocumentObj } = props;
            return {
                documentObj,
                config: {
                    legend: {
                        enabled: true,
                        position,
                        responsive,
                    },
                    mapboxToken: "",
                },
                height,
            };
        };

        it("should not render if legend is disabled", () => {
            const legendRenderer = jest.fn().mockReturnValue(<div />);
            renderComponent({ legendRenderer }, { legend: { enabled: false } });
            expect(legendRenderer).toHaveBeenCalledTimes(0);
        });

        it("should set flex-direction-column class for legend position TOP", () => {
            const customProps = customComponentProps({ position: TOP });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-column")).toBe(true);
        });

        it("should set flex-direction-column class for legend position BOTTOM", () => {
            const customProps = customComponentProps({ position: BOTTOM });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-column")).toBe(true);
        });

        it("should set flex-direction-row class for legend position LEFT", () => {
            const customProps = customComponentProps({ position: LEFT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set flex-direction-column class for legend position LEFT and height is not enough", () => {
            const customProps = customComponentProps({ height: 100, position: LEFT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set flex-direction-row class for legend position RIGHT", () => {
            const customProps = customComponentProps({ position: RIGHT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set responsive-legend class for responsive legend", () => {
            const customProps = customComponentProps({ responsive: true });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("responsive-legend")).toBe(true);
        });

        it("should set non-responsive-legend class for non responsive legend", () => {
            const customProps = customComponentProps({ responsive: false });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("non-responsive-legend")).toBe(true);
        });

        it("should render responsive legend for mobile", () => {
            const documentObj = {
                documentElement: {
                    clientWidth: FLUID_LEGEND_THRESHOLD - 10,
                },
            };
            const customProps = customComponentProps({ responsive: true, documentObj });

            const wrapper = renderComponent(customProps);
            expect(wrapper.state("showFluidLegend")).toBeTruthy();
        });

        it("should render StaticLegend on desktop", () => {
            const documentObj = {
                documentElement: {
                    clientWidth: FLUID_LEGEND_THRESHOLD + 10,
                },
            };
            const customProps = customComponentProps({ responsive: true, documentObj });

            const wrapper = renderComponent(customProps);
            expect(wrapper.state("showFluidLegend")).toBeFalsy();
        });
    });
});
