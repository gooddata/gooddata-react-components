// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { VisualizationObject } from "@gooddata/typings";

import { GeoChartInner, IGeoChartInnerProps } from "../GeoChart";
import { createIntlMock } from "../../visualizations/utils/intlUtils";
import * as BucketNames from "../../../constants/bucketNames";
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
    function renderComponent(customProps: Partial<IGeoChartInnerProps> = {}): ShallowWrapper {
        const defaultProps: Partial<IGeoChartInnerProps> = {
            config: {
                mdObject,
                mapboxToken: "",
            },
            execution: {
                executionResponse: getExecutionResponse(true),
                executionResult: getExecutionResult(true),
            },
            intl,
        };
        return shallow(<GeoChartInner {...defaultProps} {...customProps} />);
    }

    it("should render GeoChartInner", async () => {
        const wrapper = renderComponent();
        await testUtils.delay();
        wrapper.update();
        expect(wrapper.find(".s-gd-geo-component").length).toBe(1);
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
});
