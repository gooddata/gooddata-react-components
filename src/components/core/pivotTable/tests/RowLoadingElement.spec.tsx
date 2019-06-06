// (C) 2019 GoodData Corporation
import { shallow } from "enzyme";
import * as React from "react";
import { LoadingComponent } from "../../../../components/simple/LoadingComponent";
import { RowLoadingElement } from "../RowLoadingElement";
import { ICellRendererParams } from "ag-grid-community";
import noop = require("lodash/noop");

describe("RowLoadingElement", () => {
    it("should show LoadingComponent for empty cell", async () => {
        const props: ICellRendererParams = {
            node: {},
            value: 123,
            valueFormatted: noop,
        } as any;
        const wrapper = shallow(<RowLoadingElement {...props} />);
        expect(wrapper.find(LoadingComponent)).toHaveLength(1);
    });

    it("should show formatted value for existing data", async () => {
        const props: ICellRendererParams = {
            node: { id: 1 },
            value: Math.PI,
            formatValue: (value: number) => value.toFixed(2),
        } as any;
        const wrapper = shallow(<RowLoadingElement {...props} />);
        expect(wrapper.html()).toEqual('<span class="s-value s-loading-done">3.14</span>');
    });
});
