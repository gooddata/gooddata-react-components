// (C) 2020 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import { Execution } from "@gooddata/typings";
import { withIntl } from "../../../visualizations/utils/intlUtils";
import GeoChartLegendRenderer, { IGeoChartLegendRendererProps } from "../GeoChartLegendRenderer";
import PushpinSizeLegend from "../legends/PushpinSizeLegend";
import { getExecutionResult, getExecutionResponse, getGeoConfig } from "../../../../../stories/data/geoChart";

function createComponent(customProps: IGeoChartLegendRendererProps) {
    const legendProps = {
        ...customProps,
    };
    const Wrapped = withIntl(GeoChartLegendRenderer);
    return mount(<Wrapped {...legendProps} />);
}

describe("GeoChartLegendRenderer", () => {
    const execution: Execution.IExecutionResponses = {
        executionResponse: getExecutionResponse(true, false, false, true),
        executionResult: getExecutionResult(true, false, false, true),
    };
    const props: IGeoChartLegendRendererProps = {
        execution,
        config: getGeoConfig({ isWithLocation: true, isWithSize: true }),
        locale: "en-US",
    };
    it("should render component with PushpinSizeLegend", () => {
        const wrapper = createComponent(props);
        const legend = wrapper.find(PushpinSizeLegend);
        expect(wrapper.find(".s-geo-legend")).toHaveLength(1);
        expect(legend.length).toEqual(1);
    });
});
