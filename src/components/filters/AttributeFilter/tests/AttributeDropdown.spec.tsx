// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import * as ReactTestUtils from "react-dom/test-utils";
import { mount } from "enzyme";
import { DropdownButton } from "@gooddata/goodstrap/lib/Dropdown/Dropdown";
import { testUtils } from "@gooddata/js-utils";

import { AttributeDropdown, VISIBLE_ITEMS_COUNT } from "../AttributeDropdown";
import { IntlWrapper } from "../../../core/base/IntlWrapper";
import {
    createMetadataMock,
    waitFor,
    ATTRIBUTE_DISPLAY_FORM_URI,
    ATTRIBUTE_DISPLAY_FORM_IDENTIFIER,
} from "./utils";

const delayOffset = 250; // Magic constant inside Goodstrap FLEX_DIMENSIONS_THROTTLE :(
const increment = 100;
const maxDelay = 2000;

describe("AttributeDropdown", () => {
    function renderComponent(props: any = {}) {
        const {
            projectId = "storybook",
            onApply = (f: (...params: any[]) => any /* TODO: make the types more specific (FET-282) */) => f,
            metadata = createMetadataMock(),
        } = props;
        return mount(
            <IntlWrapper locale="en-US">
                <AttributeDropdown {...{ ...props, projectId, onApply, metadata }} />
            </IntlWrapper>,
        );
    }

    function createADF() {
        return {
            content: {
                expression: "[/gdc/md/storybook/obj/123]",
                formOf: "/gdc/md/storybook/obj/3",
            },
            links: {
                elements: "/gdc/md/storybook/obj/3/elements",
            },
            meta: {
                category: "attributeDisplayForm",
                identifier: ATTRIBUTE_DISPLAY_FORM_IDENTIFIER,
                title: "Country",
                uri: ATTRIBUTE_DISPLAY_FORM_URI,
            },
        };
    }

    afterEach(() => {
        // tslint:disable-next-line:no-inner-html
        document.body.innerHTML = "";
    });

    it("should render attribute as default title", () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({ attributeDisplayForm });
        expect(wrapper.find(".gd-attribute-filter .gd-button-text").text()).toBe(
            attributeDisplayForm.meta.title,
        );
    });

    it("should render custom title if provided", () => {
        const attributeDisplayForm = createADF();
        const title = "Custom title";
        const wrapper = renderComponent({ attributeDisplayForm, title });
        expect(wrapper.find(".gd-attribute-filter .gd-button-text").text()).toBe(title);
    });

    it("should render overlay on click and display loading", () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({ attributeDisplayForm });
        wrapper.find("button.s-country").simulate("click");
        expect(document.querySelectorAll(".s-isLoading")).toHaveLength(1);
    });

    const waitForItemsLoaded = () => {
        return document.querySelectorAll(".s-attribute-filter-list-item").length !== 0;
    };

    it("should render overlay with loaded items", async done => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({ attributeDisplayForm });

        // wait for the plugin to initialize before click
        await testUtils.delay(600);
        wrapper.find(DropdownButton).simulate("click");

        const testItems = () => {
            expect(document.querySelectorAll(".s-attribute-filter-list-item").length).toBeGreaterThanOrEqual(
                VISIBLE_ITEMS_COUNT,
            );
            // not every loaded item is visible, it depends on list height and internal fixed-data-table implementation
            done();
        };

        const longerMaxDelay = 5000;
        await waitFor(waitForItemsLoaded, longerMaxDelay, delayOffset, increment).then(testItems, testItems);
    });

    it("should run onApply with current selection", async done => {
        const attributeDisplayForm = createADF();
        const onApply = jest.fn((selection, isInverted) => {
            expect(selection).toEqual([
                {
                    uri: "/gdc/md/projectId/object/123?id=0",
                    title: "Afghanistan",
                },
            ]);
            expect(isInverted).toBeTruthy();
        });
        const wrapper = renderComponent({
            attributeDisplayForm,
            onApply,
        });
        // wait for the plugin to initialize before click
        await testUtils.delay(600);
        wrapper.find(DropdownButton).simulate("click");

        const testItems = () => {
            // If tests fail here, it is probably because of the FLEX_DIMENSIONS_THROTTLE,
            // that is randomly delaying the display of .s-attribute-filter-list-item
            // try adjusting the maxDelay or other constants
            const itemElement = document.querySelector(".s-attribute-filter-list-item");
            ReactTestUtils.Simulate.click(itemElement);
            const applyElement = document.querySelector(".s-apply");
            ReactTestUtils.Simulate.click(applyElement);
            expect(onApply).toHaveBeenCalledTimes(1);
            done();
        };

        waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment).then(testItems, testItems);
    });

    it("should keep selection after Apply", async () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({
            attributeDisplayForm,
        });

        wrapper.find(".s-country.dropdown-button").simulate("click");
        await waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment);
        const dropdownItems = document.querySelectorAll(".s-attribute-filter-list-item");
        ReactTestUtils.Simulate.click(dropdownItems[0]);
        ReactTestUtils.Simulate.click(dropdownItems[1]);
        ReactTestUtils.Simulate.click(dropdownItems[2]);

        wrapper.find("button.s-apply").simulate("click");
        wrapper.find(".s-country.dropdown-button").simulate("click");

        const selectedItemElements = document.querySelectorAll(
            ".s-attribute-filter-list-item .gd-input-checkbox:checked",
        );
        expect(selectedItemElements.length).toBe(8);
    });

    it("should reset selection on Cancel", async () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({
            attributeDisplayForm,
        });

        wrapper.find(".s-country.dropdown-button").simulate("click");
        await waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment);
        const dropdownItems = document.querySelectorAll(".s-attribute-filter-list-item");
        ReactTestUtils.Simulate.click(dropdownItems[0]);
        ReactTestUtils.Simulate.click(dropdownItems[1]);
        ReactTestUtils.Simulate.click(dropdownItems[2]);
        wrapper.find("button.s-cancel").simulate("click");

        wrapper.find(".s-country.dropdown-button").simulate("click");

        const selectedItemElements = document.querySelectorAll(
            ".s-attribute-filter-list-item .gd-input-checkbox:checked",
        );
        expect(selectedItemElements.length).toBe(11);
    });

    it("should limit items by search string", async () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({
            attributeDisplayForm,
        });

        wrapper.find(".s-country.dropdown-button").simulate("click");
        await waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment);
        wrapper.find("input").simulate("change", { target: { value: "Afghanistan" } });
        await waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment);
        const dropdownItems = document.querySelectorAll(".s-attribute-filter-list-item");
        expect(dropdownItems.length).toBe(1);
    });

    it("should reset search string on Cancel", async () => {
        const attributeDisplayForm = createADF();
        const wrapper = renderComponent({
            attributeDisplayForm,
        });

        wrapper.find(".s-country.dropdown-button").simulate("click");

        await waitFor(waitForItemsLoaded, maxDelay, delayOffset, increment);
        const onSearchCallback: (search: string) => void = wrapper.find("InvertableList").prop("onSearch");
        onSearchCallback("Afghanistan");
        // wait for debounce
        await testUtils.delay(300);
        wrapper.update();
        expect(wrapper.find("InvertableList").prop("searchString")).toBe("Afghanistan");
        wrapper.find("button.s-cancel").simulate("click");
        wrapper.update();
        wrapper.find(".s-country.dropdown-button").simulate("click");
        expect(wrapper.find("InvertableList").prop("searchString")).toBe("");
    });
});
