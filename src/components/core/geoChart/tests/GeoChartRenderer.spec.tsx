// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import GeoChartRenderer, { IGeoChartRendererProps } from "../GeoChartRenderer";

function createComponent(customProps: Partial<IGeoChartRendererProps> = {}): ShallowWrapper {
    const chartProps = {
        ...customProps,
    };
    return shallow(<GeoChartRenderer {...chartProps} />, { disableLifecycleMethods: true });
}

describe("GeoChartRenderer", () => {
    it("should render component", () => {
        const wrapper = createComponent();
        expect(wrapper.hasClass("s-gd-geo-chart-renderer")).toBe(true);
    });
});
