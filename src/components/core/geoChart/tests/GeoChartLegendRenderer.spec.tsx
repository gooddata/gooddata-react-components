// (C) 2020 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import { withIntl } from "../../../visualizations/utils/intlUtils";
import GeoChartLegendRenderer, { IGeoChartLegendRendererProps } from "../GeoChartLegendRenderer";
import { getExecutionResult, getGeoConfig } from "../../../../../stories/data/geoChart";
import { IGeoData } from "../../../../interfaces/GeoChart";
import { calculateLegendData } from "../geoChartDataSource";

interface ILegendFlags {
    hasSizeLegend?: boolean;
    hasColorLegend?: boolean;
}

function createComponent(customProps: IGeoChartLegendRendererProps) {
    const legendProps = {
        ...customProps,
    };
    const Wrapped = withIntl(GeoChartLegendRenderer);
    return mount(<Wrapped {...legendProps} />);
}

function getLegendProps(legendFlags: ILegendFlags): IGeoChartLegendRendererProps {
    const { hasSizeLegend = false, hasColorLegend = false } = legendFlags;
    const geoData: IGeoData = {
        size: hasSizeLegend
            ? {
                  index: 0,
                  name: "size",
              }
            : undefined,
        color: hasColorLegend
            ? {
                  index: hasSizeLegend ? 1 : 0,
                  name: "color",
              }
            : undefined,
        location: {
            index: 0,
            name: "location",
        },
    };
    const executionResult = getExecutionResult(true, false, false, hasSizeLegend, hasColorLegend);
    const { sizeData, colorData } = calculateLegendData(executionResult, geoData);
    const sizeFormat = "#,##0";
    const colorFormat = "#,##0";
    return {
        sizeData,
        sizeFormat,
        colorData,
        colorFormat,
        isColorLegendVisible: hasColorLegend,
        config: getGeoConfig({ isWithLocation: true, isWithSize: hasSizeLegend }),
    };
}

describe("GeoChartLegendRenderer", () => {
    it("should not render component", () => {
        const wrapper = createComponent(getLegendProps({}));
        expect(wrapper.find(".s-geo-legend")).toHaveLength(0);
    });

    it("should render component with PushpinSizeLegend", async () => {
        const wrapper = createComponent(getLegendProps({ hasSizeLegend: true }));
        expect(await wrapper.find(".s-geo-legend")).toHaveLength(1);
        expect(await wrapper.find(".s-pushpin-size-legend")).toHaveLength(1);
    });

    it("should render component with color legend", async () => {
        const wrapper = createComponent(getLegendProps({ hasColorLegend: true }));
        expect(await wrapper.find(".s-geo-legend")).toHaveLength(1);
        expect(await wrapper.find(".color-legend")).toHaveLength(1);
    });

    it("should render component with size and color legend", async () => {
        const wrapper = createComponent(getLegendProps({ hasColorLegend: true, hasSizeLegend: true }));
        expect(await wrapper.find(".s-geo-legend")).toHaveLength(1);
        expect(await wrapper.find(".color-legend")).toHaveLength(1);
        expect(await wrapper.find(".s-pushpin-size-legend")).toHaveLength(1);
    });
});
