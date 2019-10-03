// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import { VisualizationInput } from "@gooddata/typings";
import { AttributeFilter, createAfmFilter, createOldFilterDefinition } from "../AttributeFilter";
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

    const waitForAttributeDropdown = (
        wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}>>,
    ) => () => {
        wrapper.update();
        return wrapper.find(AttributeDropdown).length !== 0;
    };

    it("should extract selection from filter definition with text values", async () => {
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["element1"], true),
        });
        await waitFor(waitForAttributeDropdown(wrapper));
        expect(wrapper.find(AttributeDropdown).prop("selection")).toEqual([{ title: "element1" }]);
    });

    it("should extract selection from filter definition with uris", async () => {
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["/gdc/md/projectId/obj/123/elements?id=1"]),
        });
        await waitFor(waitForAttributeDropdown(wrapper));
        expect(wrapper.find(AttributeDropdown).prop("selection")).toEqual([
            { uri: "/gdc/md/projectId/obj/123/elements?id=1" },
        ]);
    });

    it("should run onApply with current selection in old format", async () => {
        const onApply = jest.fn();
        const expectedFilter = {
            id: identifier,
            type: "attribute",
            notIn: ["element2"],
        };
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["element1"], true),
            onApply,
        });
        await waitFor(waitForAttributeDropdown(wrapper));
        wrapper.find(AttributeDropdown).prop("onApply")(
            [
                {
                    uri: "gdc/md",
                    title: "element2",
                },
            ],
            true,
        );
        expect(onApply).toHaveBeenCalledWith(expectedFilter);
    });

    it("should run onApplyWithFilterDefinition with current selection as AFM filter", async () => {
        const onApplyWithFilterDefinition = jest.fn();
        const expectedFilter: VisualizationInput.INegativeAttributeFilter = {
            negativeAttributeFilter: {
                displayForm: {
                    identifier,
                },
                notIn: ["element2"],
                textFilter: true,
            },
        };
        const wrapper = renderComponent({
            filter: Model.negativeAttributeFilter(identifier, ["element1"], true),
            onApplyWithFilterDefinition,
        });
        await waitFor(waitForAttributeDropdown(wrapper));
        wrapper.find(AttributeDropdown).prop("onApply")(
            [
                {
                    uri: "gdc/md",
                    title: "element2",
                },
            ],
            true,
        );
        expect(onApplyWithFilterDefinition).toHaveBeenCalledWith(expectedFilter);
    });
});

describe("createOldFilterDefinition", () => {
    const id = "foo";
    const selection = [
        {
            uri: "/gdc/md/projectId/obj/1?id=1",
            title: "A",
        },
        {
            uri: "/gdc/md/projectId/obj/1?id=2",
            title: "B",
        },
    ];

    it("should create filter from selection", () => {
        expect(createOldFilterDefinition(id, selection, false)).toEqual({
            id: "foo",
            in: ["1", "2"],
            type: "attribute",
        });
    });

    it("should create filter from inverted selection", () => {
        expect(createOldFilterDefinition(id, selection, true)).toEqual({
            id: "foo",
            notIn: ["1", "2"],
            type: "attribute",
        });
    });

    it("should create filter from selection by text values", () => {
        expect(createOldFilterDefinition(id, selection, false, true)).toEqual({
            id: "foo",
            in: ["A", "B"],
            type: "attribute",
        });
    });
});

describe("createAfmFilter", () => {
    const id = "foo";
    const selection = [
        {
            uri: "/gdc/md/projectId/obj/1?id=1",
            title: "1",
        },
        {
            uri: "/gdc/md/projectId/obj/1?id=2",
            title: "2",
        },
    ];

    it("should create filter from selection", () => {
        expect(createAfmFilter(id, selection, false)).toEqual({
            positiveAttributeFilter: {
                displayForm: {
                    identifier: "foo",
                },
                in: ["/gdc/md/projectId/obj/1?id=1", "/gdc/md/projectId/obj/1?id=2"],
            },
        });
    });

    it("should create filter from inverted selection", () => {
        expect(createAfmFilter(id, selection, true)).toEqual({
            negativeAttributeFilter: {
                displayForm: {
                    identifier: "foo",
                },
                notIn: ["/gdc/md/projectId/obj/1?id=1", "/gdc/md/projectId/obj/1?id=2"],
            },
        });
    });
});
