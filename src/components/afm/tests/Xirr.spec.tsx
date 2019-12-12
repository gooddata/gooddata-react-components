// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { Xirr as AfmXirr } from "../Xirr";
import { Xirr } from "../../core/Xirr";
import { dummyXirrExecuteAfmAdapterFactory } from "./utils/DummyXirrExecuteAfmAdapter";
import { executionRequest } from "./utils/dummyXirrFixture";

describe("Xirr", () => {
    it("should provide default resultSpec to core Xirr with measures", () => {
        const wrapper = mount(
            <AfmXirr
                projectId="prId"
                afm={executionRequest.execution.afm}
                resultSpec={{}}
                adapterFactory={dummyXirrExecuteAfmAdapterFactory}
            />,
        );

        return testUtils.delay().then(() => {
            wrapper.update();
            const dimensions = wrapper.find(Xirr).props().resultSpec.dimensions;
            expect(dimensions).toEqual([
                {
                    itemIdentifiers: ["measureGroup", "a_1"],
                },
            ]);
        });
    });
});
