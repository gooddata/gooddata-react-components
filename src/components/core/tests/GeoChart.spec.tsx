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
});
