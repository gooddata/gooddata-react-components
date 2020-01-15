// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import noop = require("lodash/noop");
import { mount } from "enzyme";
import { VisualizationTypes } from "../../../../../constants/visualizationTypes";
import Legend from "../Legend";
import HeatmapLegend from "../HeatmapLegend";
import { withIntl } from "../../../utils/intlUtils";
import LegendItem from "../LegendItem";

describe("Legend", () => {
    const series = [
        {
            name: "series1",
            color: "#333333",
        },
        {
            name: "series2",
            color: "#222222",
        },
        {
            name: "series3",
            color: "#111111",
        },
        {
            name: "series4",
            color: "#000000",
        },
    ];

    function createComponent(userProps = {}) {
        const props = {
            chartType: VisualizationTypes.BAR,
            legendLayout: "vertical",
            series,
            onItemClick: noop,
            validateOverHeight: noop,
            position: "top",
            ...userProps,
        };

        const Wrapped = withIntl(Legend);

        return mount(<Wrapped {...props} />);
    }

    it("should render StaticLegend on desktop", () => {
        const legend = createComponent({
            showFluidLegend: false,
        });
        expect(legend.find(".viz-static-legend-wrap")).toHaveLength(1);
    });

    it("should render fluid legend on mobile", () => {
        const legend = createComponent({
            showFluidLegend: true,
            responsive: true,
        });
        expect(legend.find(".viz-fluid-legend-wrap")).toHaveLength(1);
    });

    it("should render heat map legend when type is heatmap", () => {
        const wrapper = createComponent({ chartType: VisualizationTypes.HEATMAP });
        expect(wrapper.find(HeatmapLegend).length).toEqual(1);
    });

    describe("`onItemClick` callback", () => {
        it("should be called by default", () => {
            const onItemClick = jest.fn();
            const wrapper = createComponent({ onItemClick });
            wrapper
                .find(LegendItem)
                .first()
                .simulate("click");
            expect(onItemClick).toHaveBeenCalled();
        });

        it("should not be called when `interactive` prop is falsy", () => {
            const onItemClick = jest.fn();
            const wrapper = createComponent({ onItemClick, interactive: false });
            wrapper
                .find(LegendItem)
                .first()
                .simulate("click");
            expect(onItemClick).not.toHaveBeenCalled();
        });
    });
});
