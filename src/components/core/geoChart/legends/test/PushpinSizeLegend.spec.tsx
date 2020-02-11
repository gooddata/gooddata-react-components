// (C) 2020 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import PushpinSizeLegend, { IPushpinSizeLegendProps } from "../PushpinSizeLegend";

function createComponent(customProps: IPushpinSizeLegendProps): ShallowWrapper {
    const legendProps = {
        ...customProps,
    };
    return shallow(<PushpinSizeLegend {...legendProps} />);
}

describe("PushpinSizeLegend", () => {
    it("should render component with max, average and min value", () => {
        const sizes: number[] = [10, 6, 20];
        const props = {
            sizes,
            format: "#,##0.00",
            numericSymbols: ["k", "M", "G", "T", "P", "E"],
        };
        const wrapper = createComponent(props);
        expect(wrapper.hasClass("s-pushpin-size-legend")).toBe(true);
    });
    it("should not render component when min value is equal to max value", () => {
        const sizes: number[] = [1000, 1000, 1000];
        const props = {
            sizes,
            format: "#,##0.00",
            numericSymbols: ["k", "M", "G", "T", "P", "E"],
        };
        const wrapper = createComponent(props);
        expect(wrapper.hasClass("s-pushpin-size-legend")).toBe(false);
    });
});
