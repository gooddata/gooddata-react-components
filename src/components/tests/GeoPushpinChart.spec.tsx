// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";
import { factory } from "@gooddata/gooddata-js";
import { AFM, VisualizationObject } from "@gooddata/typings";

import { GeoPushpinChart } from "../GeoPushpinChart";
import { Model } from "../../../src";
import { IGeoConfig, IGeoPushpinChartProps } from "../../interfaces/GeoChart";

describe("Geo Pushpin Chart", () => {
    const size: VisualizationObject.IMeasure = Model.measure("measure_size").localIdentifier("size");

    const color: VisualizationObject.IMeasure = Model.measure("measure_color").localIdentifier("color");

    const location: VisualizationObject.IVisualizationAttribute = Model.attribute(
        "attribute_location",
    ).localIdentifier("location");

    const segmentBy: VisualizationObject.IVisualizationAttribute = Model.attribute(
        "attribute_segmentBy",
    ).localIdentifier("segmentBy");

    const chartConfig: IGeoConfig = {
        tooltipText: Model.attribute("attribute_tooltip").localIdentifier("tooltipText"),
    };
    function renderShallowComponent(customProps: Partial<IGeoPushpinChartProps>) {
        const defaultProps: IGeoPushpinChartProps = {
            projectId: "geoPushpinChart",
            location,
        };
        return shallow(<GeoPushpinChart projectId="geoPushpinChart" {...defaultProps} {...customProps} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderShallowComponent({ sdk: factory({ domain: "example.com" }) });
        expect(wrapper).toHaveLength(1);
    });
    it("should render component with Size, Location and convert the bucket to AFM and resultSpec", () => {
        const wrapper = renderShallowComponent({ size });
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
        const wrapper = renderShallowComponent({ size, color, segmentBy, config: chartConfig });
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

    it("should render component with Location, Color, SegmentBy, ToolTip and convert the bucket to AFM and resultSpec", () => {
        const wrapper = renderShallowComponent({ color, segmentBy, config: chartConfig });
        const expectedAfm: AFM.IAfm = {
            measures: [
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
});
