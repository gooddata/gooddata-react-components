// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { shallow } from "enzyme";

import { PyramidChart } from "../PyramidChart";
import { BaseChart } from "../base/BaseChart";
import { emptyDataSource } from "../../tests/mocks";

describe("Pyramid Chart", () => {
    it("should render BaseChart", () => {
        const wrapper = shallow(<PyramidChart dataSource={emptyDataSource} />);
        expect(wrapper.find(BaseChart).length).toBe(1);
    });
});
