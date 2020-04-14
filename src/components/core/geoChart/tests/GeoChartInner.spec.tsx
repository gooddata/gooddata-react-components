// (C) 2020 GoodData Corporation
import * as React from "react";
import { ShallowWrapper, shallow } from "enzyme";
import { GeoChartInner, IGeoChartInnerProps, IGeoChartInnerOptions } from "../GeoChartInner";
import { IGeoConfig } from "../../../../interfaces/GeoChart";
import { getExecutionResponse, getExecutionResult, getGeoConfig } from "../../../../../stories/data/geoChart";
import { getGeoData } from "../../../../helpers/geoChart/data";
import { DEFAULT_COLOR_PALETTE } from "../../../visualizations/utils/color";
import { FLUID_LEGEND_THRESHOLD } from "../../../../constants/legend";
import { LEFT, RIGHT, TOP, BOTTOM } from "../../../visualizations/chart/legend/PositionTypes";
import { PositionType } from "../../../visualizations/typings/legend";
import { buildMockColorStrategy } from "./mock";

const execution = {
    executionResponse: getExecutionResponse(true, true, true, true),
    executionResult: getExecutionResult(true, true, true, true, true),
};
const config = getGeoConfig({ isWithLocation: true, isWithSize: true, isWithSegment: true });
const { mdObject: { buckets = [] } = {} } = config;

function buildGeoChartOptions(): IGeoChartInnerOptions {
    const mockColorStrategy = buildMockColorStrategy();
    const geoData = getGeoData(buckets, execution);
    const categoryItems = [
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
        {
            name: "Speciality",
            legendIndex: 2,
            color: "rgb(229,77,66)",
            isVisible: true,
        },
        {
            name: "Convenience",
            legendIndex: 3,
            color: "rgb(241,134,0)",
            isVisible: true,
        },
    ];

    return {
        geoData,
        categoryItems,
        colorStrategy: mockColorStrategy,
        colorPalette: DEFAULT_COLOR_PALETTE,
    };
}

describe("GeoChartInner", () => {
    function renderComponent(
        customProps: Partial<IGeoChartInnerProps> = {},
        customConfig: Partial<IGeoConfig> = {},
    ): ShallowWrapper {
        const defaultProps: Partial<IGeoChartInnerProps> = {
            config: {
                mapboxToken: "",
                ...customConfig,
            },
            execution: {
                executionResponse: getExecutionResponse(true),
                executionResult: getExecutionResult(true),
            },
            geoChartOptions: buildGeoChartOptions(),
            height: 600,
        };
        return shallow(<GeoChartInner {...defaultProps} {...customProps} />);
    }
    it("should render GeoChartInner", async () => {
        const wrapper = renderComponent();
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
        expect(legendRenderer).toHaveBeenCalledWith({
            categoryItems: [
                { color: "rgb(20,178,226)", isVisible: true, legendIndex: 0, name: "General Goods" },
                { color: "rgb(0,193,141)", isVisible: true, legendIndex: 1, name: "Toy Store" },
                { color: "rgb(229,77,66)", isVisible: true, legendIndex: 2, name: "Speciality" },
                { color: "rgb(241,134,0)", isVisible: true, legendIndex: 3, name: "Convenience" },
            ],
            colorLegendValue: "rgb(20,178,226)",
            format: "#,##0",
            geoData: {
                location: {
                    data: [
                        { lat: 44.5, lng: -89.5 },
                        { lat: 39, lng: -80.5 },
                        { lat: 44, lng: -72.699997 },
                        { lat: 31, lng: -100 },
                        { lat: 44.5, lng: -100 },
                        { lat: 41.700001, lng: -71.5 },
                        { lat: 44, lng: -120.5 },
                        { lat: 43, lng: -75 },
                        { lat: 44, lng: -71.5 },
                        { lat: 41.5, lng: -100 },
                        { lat: 38.5, lng: -98 },
                        { lat: 33, lng: -90 },
                        { lat: 40, lng: -89 },
                        { lat: 39, lng: -75.5 },
                        { lat: 41.599998, lng: -72.699997 },
                        { lat: 34.799999, lng: -92.199997 },
                        { lat: 40.273502, lng: -86.126976 },
                        { lat: 38.573936, lng: -92.60376 },
                        { lat: 27.994402, lng: -81.760254 },
                        { lat: 39.876019, lng: -117.224121 },
                        { lat: 45.367584, lng: -68.972168 },
                        { lat: 44.182205, lng: -84.506836 },
                        { lat: 33.247875, lng: -83.441162 },
                        { lat: 35.860119, lng: -86.660156 },
                        { lat: 37.926868, lng: -78.024902 },
                        { lat: 39.833851, lng: -74.871826 },
                        { lat: 37.839333, lng: -84.27002 },
                        { lat: 47.650589, lng: -100.437012 },
                        { lat: 46.39241, lng: -94.63623 },
                        { lat: 36.084621, lng: -96.921387 },
                        { lat: 46.96526, lng: -109.533691 },
                        { lat: 47.751076, lng: -120.740135 },
                        { lat: 39.41922, lng: -111.950684 },
                        { lat: 39.113014, lng: -105.358887 },
                        { lat: 40.367474, lng: -82.996216 },
                        { lat: 32.31823, lng: -86.902298 },
                        { lat: 42.032974, lng: -93.581543 },
                        { lat: 34.307144, lng: -106.018066 },
                        { lat: 33.836082, lng: -81.163727 },
                        { lat: 41.203323, lng: -77.194527 },
                        { lat: 34.048927, lng: -111.093735 },
                        { lat: 39.045753, lng: -76.641273 },
                        { lat: 42.407211, lng: -71.382439 },
                        { lat: 36.778259, lng: -119.417931 },
                        { lat: 44.068203, lng: -114.742043 },
                        { lat: 43.07597, lng: -107.290283 },
                        { lat: 35.782169, lng: -80.793457 },
                        { lat: 30.39183, lng: -92.329102 },
                    ],
                    index: 0,
                    name: "State",
                },
                segment: {
                    data: [
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "General Goods",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Toy Store",
                        "Speciality",
                        "Speciality",
                        "Speciality",
                        "Speciality",
                        "Speciality",
                        "Speciality",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                        "Convenience",
                    ],
                    index: 1,
                    name: "Type",
                },
                size: {
                    data: [
                        1005,
                        943,
                        NaN,
                        4726,
                        1719,
                        2844,
                        838,
                        3060,
                        709,
                        772,
                        3949,
                        1766,
                        1560,
                        1938,
                        3836,
                        5302,
                        3310,
                        3500,
                        2288,
                        11564,
                        1381,
                        2627,
                        8732,
                        570,
                        1121,
                        1605,
                        NaN,
                        869,
                        12064,
                        596,
                        2299,
                        335,
                        1782,
                        1242,
                        NaN,
                        5602,
                        2282,
                        18,
                        22220,
                        7520,
                        1047,
                        NaN,
                        116,
                        957,
                        8340,
                        3294,
                        6832,
                        528,
                    ],
                    format: "#,##0",
                    index: 0,
                    name: "Population",
                },
            },
            height: 600,
            locale: "en-US",
            onItemClick: expect.any(Function),
            position: "top",
            responsive: false,
            showFluidLegend: true,
        });
    });

    it("should return enabledLegendItems with length equal categories length", () => {
        const wrapper = renderComponent();
        expect(wrapper.state("enabledLegendItems")).toEqual([true, true, true, true]);
    });

    it("should call pushData", () => {
        const pushData = jest.fn();
        const props: Partial<IGeoChartInnerProps> = {
            pushData,
        };
        renderComponent(props);
        expect(pushData).toBeCalledTimes(1);
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

        const getCustomComponentProps = (props: ICustomComponentProps): Partial<IGeoChartInnerProps> => {
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
            const customProps = getCustomComponentProps({ position: TOP });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-column")).toBe(true);
        });

        it("should set flex-direction-column class for legend position BOTTOM", () => {
            const customProps = getCustomComponentProps({ position: BOTTOM });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-column")).toBe(true);
        });

        it("should set flex-direction-row class for legend position LEFT", () => {
            const customProps = getCustomComponentProps({ position: LEFT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set flex-direction-column class for legend position LEFT and height is not enough", () => {
            const customProps = getCustomComponentProps({ height: 100, position: LEFT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set flex-direction-row class for legend position RIGHT", () => {
            const customProps = getCustomComponentProps({ position: RIGHT });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("flex-direction-row")).toBe(true);
        });

        it("should set responsive-legend class for responsive legend", () => {
            const customProps = getCustomComponentProps({ responsive: true });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("responsive-legend")).toBe(true);
        });

        it("should set non-responsive-legend class for non responsive legend", () => {
            const customProps = getCustomComponentProps({ responsive: false });
            const wrapper = renderComponent(customProps);
            expect(wrapper.hasClass("non-responsive-legend")).toBe(true);
        });

        it("should render responsive legend for mobile", () => {
            const documentObj = {
                documentElement: {
                    clientWidth: FLUID_LEGEND_THRESHOLD - 10,
                },
            };
            const customProps = getCustomComponentProps({ responsive: true, documentObj });

            const wrapper = renderComponent(customProps);
            expect(wrapper.state("showFluidLegend")).toBeTruthy();
        });

        it("should render StaticLegend on desktop", () => {
            const documentObj = {
                documentElement: {
                    clientWidth: FLUID_LEGEND_THRESHOLD + 10,
                },
            };
            const customProps = getCustomComponentProps({ responsive: true, documentObj });

            const wrapper = renderComponent(customProps);
            expect(wrapper.state("showFluidLegend")).toBeFalsy();
        });
    });
});
