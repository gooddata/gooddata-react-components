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
    it("should render component", () => {
        const sizes: number[] = [10000, 3666.66, 1000];
        const props = {
            sizes,
            format: "#,##0.00",
            numericSymbols: ["k", "M", "G", "T", "P", "E"],
        };
        const wrapper = createComponent(props);
        expect(wrapper.hasClass("s-pushpin-size-legend")).toBe(true);
    });
});
