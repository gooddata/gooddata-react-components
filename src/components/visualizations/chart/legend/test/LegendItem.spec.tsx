// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import LegendItem from "../LegendItem";

describe("LegendItem", () => {
    const item = {
        name: "Foo",
        color: "red",
        isVisible: true,
    };

    function createComponent(props: any = {}) {
        const defaultProps = {
            item,
            chartType: "bar",
            onItemClick: jest.fn(),
        };
        return mount(<LegendItem {...defaultProps} {...props} />);
    }

    it("should render item", () => {
        const wrapper = createComponent();
        expect(wrapper.find(".series-item").text()).toEqual("Foo");
    });

    describe("onItemClick callback", () => {
        it("should be called when `interactive` prop is not set, therefore it's truthy", () => {
            const onItemClick = jest.fn();
            const wrapper = createComponent({ onItemClick });

            wrapper.find(".series-item").simulate("click");
            expect(onItemClick).toHaveBeenCalled();
        });

        it("should be called when `interactive` prop is truthy", () => {
            const onItemClick = jest.fn();
            const wrapper = createComponent({ onItemClick, interactive: true });

            wrapper.find(".series-item").simulate("click");
            expect(onItemClick).toHaveBeenCalled();
        });

        it("should not be called when `interactive` prop is falsy", () => {
            const onItemClick = jest.fn();
            const wrapper = createComponent({ onItemClick, interactive: false });

            wrapper.find(".series-item").simulate("click");
            expect(onItemClick).not.toHaveBeenCalled();
        });
    });

    describe("cursor style", () => {
        const assertCursorStyle = (wrapper: ReactWrapper, className: string, cursorStyle: string) => {
            const style = wrapper.find(`.${className}`).get(0).props.style;
            expect(style).toMatchObject({ cursor: cursorStyle });
        };

        it("should be `initial` when `interactive` prop is not set, therefore it's truthy", () => {
            const wrapper = createComponent();
            assertCursorStyle(wrapper, "series-item", "");
            assertCursorStyle(wrapper, "series-icon", "");
            assertCursorStyle(wrapper, "series-name", "");
        });

        it("should be `initial` when `interactive` prop is truthy", () => {
            const wrapper = createComponent({ interactive: true });
            assertCursorStyle(wrapper, "series-item", "");
            assertCursorStyle(wrapper, "series-icon", "");
            assertCursorStyle(wrapper, "series-name", "");
        });

        it("should be empty when `interactive` prop is falsy", () => {
            const wrapper = createComponent({ interactive: false });
            assertCursorStyle(wrapper, "series-item", "initial");
            assertCursorStyle(wrapper, "series-icon", "initial");
            assertCursorStyle(wrapper, "series-name", "initial");
        });
    });

    it.each([
        ["enable", "line", undefined, "50%"],
        ["enable", "area", undefined, "50%"],
        ["enable", "combo", "line", "50%"],
        ["enable", "combo", "area", "50%"],
        ["disable", "column", undefined, "0"],
        ["disable", "combo", "column", "0"],
    ])(
        "should %s border radius for %s chart with itemType=%s",
        (_des: string, chartType: string, type: string, expected: string) => {
            const props = {
                item: {
                    ...item,
                    type,
                },
                chartType,
            };
            const component = createComponent(props);
            const seriesIconStyle = component.find(".series-icon").get(0).props.style;

            expect(seriesIconStyle).toMatchObject({ borderRadius: expected });
        },
    );
});
