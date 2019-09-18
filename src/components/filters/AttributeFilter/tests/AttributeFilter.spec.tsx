// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import { testUtils } from "@gooddata/js-utils";
import { AttributeFilter } from "../AttributeFilter";
import { AttributeDropdown } from "../AttributeDropdown";
import { createMetadataMock, waitFor } from "./utils";
import * as Model from "../../../../helpers/model";
import { AttributeLoader } from "../AttributeLoader";

describe("AttributeFilter", () => {
    const uri = "/gdc/md/projectId/obj/123";
    const identifier = "id123";

    function renderComponent(customProps = {}) {
        const sdk = {
            md: createMetadataMock(),
            clone: () => sdk,
            config: {
                setJsPackage: () => false,
                setRequestHeader: () => false,
            },
        };

        const props = {
            projectId: "storybook",
            onApply: () => ({}),
            sdk,
            ...customProps,
        };
        return mount(<AttributeFilter {...props as any} />);
    }

    it("should render loading button after mount", () => {
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(uri, []),
        });
        expect(wrapper.find(".s-button-loading")).toHaveLength(1);
    });

    it("should detect usage of identifier and pass it to the AttributeDropdown", () => {
        const wrapper = renderComponent({ filter: Model.negativeAttributeFilter(identifier, []) });

        return testUtils.delay().then(() => {
            wrapper.update();
            expect(wrapper.find(AttributeDropdown).prop("isUsingIdentifier")).toBeTruthy();
        });
    });

    it("should detect deprecated attribute definition", () => {
        const warnMock = jest.fn();
        // tslint:disable-next-line:no-console
        console.warn = warnMock;
        renderComponent({ identifier });
        expect(warnMock).toHaveBeenCalledWith(
            "Definition of an attribute using 'uri' or 'identifier' is deprecated, use 'filter' property instead. Please see the documentation of [AttributeFilter component](https://sdk.gooddata.com/gooddata-ui/docs/attribute_filter_component.html) for further details.",
        );
        warnMock.mockRestore();
    });

    it("should detect multiple attribute definition", () => {
        expect(() => renderComponent({ identifier, uri })).toThrow();
    });

    it("should handle attribute definition by uri", () => {
        const wrapper = renderComponent({ uri });
        expect(wrapper.find(AttributeLoader).prop("uri")).toEqual(uri);
    });

    it("should handle attribute definition by identifier", () => {
        const wrapper = renderComponent({ identifier });
        expect(wrapper.find(AttributeLoader).prop("identifier")).toEqual(identifier);
    });

    it("should handle attribute definition by filter with uri", () => {
        const wrapper = renderComponent({ filter: Model.negativeAttributeFilter(uri, []) });
        expect(wrapper.find(AttributeLoader).prop("uri")).toEqual(uri);
    });

    it("should handle attribute definition by filter with identifier", () => {
        const wrapper = renderComponent({ filter: Model.negativeAttributeFilter(identifier, []) });
        expect(wrapper.find(AttributeLoader).prop("identifier")).toEqual(identifier);
    });

    it("should extract selection from filter definition with text values", async () => {
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["element1"], true),
        });
        const waitForAttributeDropdown = () => {
            wrapper.update();
            return wrapper.find(AttributeDropdown).length !== 0;
        };
        await waitFor(waitForAttributeDropdown);
        expect(wrapper.find(AttributeDropdown).prop("selection")).toEqual([{ title: "element1" }]);
    });

    it("should extract selection from filter definition with uris", async () => {
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["/gdc/md/projectId/obj/123/elements?id=1"]),
        });
        const waitForAttributeDropdown = () => {
            wrapper.update();
            return wrapper.find(AttributeDropdown).length !== 0;
        };
        await waitFor(waitForAttributeDropdown);
        expect(wrapper.find(AttributeDropdown).prop("selection")).toEqual([
            { uri: "/gdc/md/projectId/obj/123/elements?id=1" },
        ]);
    });
});
