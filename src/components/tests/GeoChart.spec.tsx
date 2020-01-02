// (C) 2019 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { AFM, VisualizationObject } from "@gooddata/typings";

import { GeoChart } from "../GeoChart";
import { IChartConfig } from "../../interfaces/Config";

describe("Geo Chart", () => {
    const size: VisualizationObject.IMeasure = {
        measure: {
            localIdentifier: "size",
            definition: {
                measureDefinition: {
                    item: {
                        identifier: "measure_size",
                    },
                },
            },
        },
    };
    const color: VisualizationObject.IMeasure = {
        measure: {
            localIdentifier: "color",
            definition: {
                measureDefinition: {
                    item: {
                        identifier: "measure_color",
                    },
                },
            },
        },
    };
    const location: VisualizationObject.IVisualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "location",
            displayForm: {
                identifier: "attribute_location",
            },
        },
    };

    const segmentBy: VisualizationObject.IVisualizationAttribute = {
        visualizationAttribute: {
            localIdentifier: "segmentBy",
            displayForm: {
                identifier: "attribute_segmentBy",
            },
        },
    };
    const chartConfig: IChartConfig = {
        tooltipText: {
            visualizationAttribute: {
                localIdentifier: "tooltipText",
                displayForm: {
                    identifier: "attribute_tooltip",
                },
            },
        },
    };
    it("should render with custom SDK", () => {
        const wrapper = shallow(
            <GeoChart projectId="geoChart" size={size} sdk={factory({ domain: "example.com" })} />,
        );
        expect(wrapper).toHaveLength(1);
    });
    it("should render component with Size, Location and convert the bucket to AFM and resultSpec", () => {
        const wrapper = shallow(<GeoChart projectId="geoChart" size={size} location={location} />);
        const expectedAfm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "size",
                    definition: { measure: { item: { identifier: "measure_size" } } },
                },
            ],
            attributes: [
                {
                    localIdentifier: "location",
                    displayForm: { identifier: "attribute_location" },
                },
            ],
        };

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["location"],
                },
            ],
        };

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });

    it("should render component with Size, Color, Location, SegmentBy, ToolTip and convert the bucket to AFM and resultSpec", () => {
        const wrapper = shallow(
            <GeoChart
                projectId="geoChart"
                size={size}
                color={color}
                segmentBy={segmentBy}
                location={location}
                config={chartConfig}
            />,
        );
        const expectedAfm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "size",
                    definition: { measure: { item: { identifier: "measure_size" } } },
                },
                {
                    localIdentifier: "color",
                    definition: { measure: { item: { identifier: "measure_color" } } },
                },
            ],
            attributes: [
                {
                    localIdentifier: "location",
                    displayForm: { identifier: "attribute_location" },
                },
                {
                    localIdentifier: "segmentBy",
                    displayForm: { identifier: "attribute_segmentBy" },
                },
                {
                    localIdentifier: "tooltipText",
                    displayForm: { identifier: "attribute_tooltip" },
                },
            ],
        };

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["location", "segmentBy", "tooltipText"],
                },
            ],
        };
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });

    it("should render component with Color, SegmentBy, ToolTip and convert the bucket to AFM and resultSpec", () => {
        const wrapper = shallow(
            <GeoChart projectId="geoChart" color={color} segmentBy={segmentBy} config={chartConfig} />,
        );
        const expectedAfm: AFM.IAfm = {
            measures: [
                {
                    localIdentifier: "color",
                    definition: { measure: { item: { identifier: "measure_color" } } },
                },
            ],
            attributes: [
                {
                    localIdentifier: "segmentBy",
                    displayForm: { identifier: "attribute_segmentBy" },
                },
                {
                    localIdentifier: "tooltipText",
                    displayForm: { identifier: "attribute_tooltip" },
                },
            ],
        };

        const expectedResultSpec = {
            dimensions: [
                {
                    itemIdentifiers: ["measureGroup"],
                },
                {
                    itemIdentifiers: ["segmentBy", "tooltipText"],
                },
            ],
        };
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop("afm")).toEqual(expectedAfm);
        expect(wrapper.prop("resultSpec")).toEqual(expectedResultSpec);
    });
});
