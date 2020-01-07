// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { testUtils } from "@gooddata/js-utils";

import { GeoChartInner, IGeoChartInnerProps } from "../GeoChart";
import { createIntlMock } from "../../visualizations/utils/intlUtils";

const intl = createIntlMock();

describe("GeoChart", () => {
    function renderComponent(customProps: Partial<IGeoChartInnerProps> = {}): ReactWrapper {
        const defaultProps: Partial<IGeoChartInnerProps> = {
            execution: {
                executionResponse: undefined,
                executionResult: undefined,
            },
            intl,
        };
        return mount(<GeoChartInner {...defaultProps} {...customProps} />);
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
});
