// (C) 2019 GoodData Corporation
import * as React from "react";
import noop = require("lodash/noop");
import { mount } from "enzyme";
import XirrTransformation from "../XirrTransformation";
import Headline from "../../headline/Headline";
import { withIntl } from "../../utils/intlUtils";
import {
    BASIC_EXECUTION_REQUEST,
    BASIC_EXECUTION_RESPONSE,
    BASIC_EXECUTION_RESULT,
    DRILL_EVENT_DATA,
    MEASURE_URI,
} from "./fixtures/XirrTransformation.fixtures";
import { IHeadlineTransformationProps } from "../types";

describe("XirrTransformation", () => {
    function createComponent(props: IHeadlineTransformationProps) {
        const WrappedXirrTransformation = withIntl(XirrTransformation);
        return mount(<WrappedXirrTransformation {...props} />);
    }

    it("should pass default props to Headline component", () => {
        const wrapper = createComponent({
            executionRequest: BASIC_EXECUTION_REQUEST,
            executionResponse: BASIC_EXECUTION_RESPONSE,
            executionResult: BASIC_EXECUTION_RESULT,
        });

        const props = wrapper.find(Headline).props();
        expect(props.onAfterRender).toEqual(noop);
    });

    it("should pass disableDrillUnderline prop from config.disableDrillUnderline", () => {
        const wrapper = createComponent({
            executionRequest: BASIC_EXECUTION_REQUEST,
            executionResponse: BASIC_EXECUTION_RESPONSE,
            executionResult: BASIC_EXECUTION_RESULT,
            config: {
                disableDrillUnderline: true,
            },
        });

        const headlineComponent = wrapper.find(Headline);
        expect(headlineComponent.prop("disableDrillUnderline")).toBeTruthy();
    });

    it("should pass all required props to Headline component and enable drilling identified by uri", () => {
        const onAfterRender = jest.fn();
        const drillableItems = [{ uri: MEASURE_URI }];
        const wrapper = createComponent({
            executionRequest: BASIC_EXECUTION_REQUEST,
            executionResponse: BASIC_EXECUTION_RESPONSE,
            executionResult: BASIC_EXECUTION_RESULT,
            drillableItems,
            onAfterRender,
        });

        const props = wrapper.find(Headline).props();
        expect(props.data).toEqual({
            primaryItem: {
                localIdentifier: "m_1",
                title: "Sum of Cashflow",
                value: "0.05958953474733984",
                format: "#,##0.00",
                isDrillable: true,
            },
        });
        expect(props.onAfterRender).toEqual(onAfterRender);
        expect(props.onFiredDrillEvent).toBeDefined();
    });

    it("should call afterRender callback on componentDidMount & componentDidUpdate", () => {
        const onAfterRender = jest.fn();
        const wrapper = createComponent({
            executionRequest: BASIC_EXECUTION_REQUEST,
            executionResponse: BASIC_EXECUTION_RESPONSE,
            executionResult: BASIC_EXECUTION_RESULT,
            onAfterRender,
        });

        expect(onAfterRender).toHaveBeenCalledTimes(1);

        wrapper.setProps({
            executionRequest: BASIC_EXECUTION_REQUEST,
        });

        expect(onAfterRender).toHaveBeenCalledTimes(2);
    });

    describe("drill eventing", () => {
        it("should dispatch drill event and post message", () => {
            const drillEventFunction = jest.fn(() => true);

            const wrapper = createComponent({
                executionRequest: BASIC_EXECUTION_REQUEST,
                executionResponse: BASIC_EXECUTION_RESPONSE,
                executionResult: BASIC_EXECUTION_RESULT,
                drillableItems: [{ uri: MEASURE_URI }],
                onFiredDrillEvent: drillEventFunction,
            });

            const primaryValue = wrapper.find(".s-headline-primary-item .headline-value-wrapper");
            const clickEvent = { target: { dispatchEvent: jest.fn() } };
            primaryValue.simulate("click", clickEvent);

            expect(drillEventFunction).toHaveBeenCalledTimes(1);
            expect(drillEventFunction).toBeCalledWith(DRILL_EVENT_DATA);

            expect(clickEvent.target.dispatchEvent).toHaveBeenCalledTimes(1);
            const customEvent = clickEvent.target.dispatchEvent.mock.calls[0][0];
            expect(customEvent.bubbles).toBeTruthy();
            expect(customEvent.type).toEqual("drill");
            expect(customEvent.detail).toEqual(DRILL_EVENT_DATA);
        });

        it("should dispatch only drill event", () => {
            const drillEventFunction = jest.fn(() => false);

            const wrapper = createComponent({
                executionRequest: BASIC_EXECUTION_REQUEST,
                executionResponse: BASIC_EXECUTION_RESPONSE,
                executionResult: BASIC_EXECUTION_RESULT,
                drillableItems: [{ uri: MEASURE_URI }],
                onFiredDrillEvent: drillEventFunction,
            });

            const primaryValue = wrapper.find(".s-headline-primary-item .headline-value-wrapper");
            const clickEvent = { target: { dispatchEvent: jest.fn() } };
            primaryValue.simulate("click", clickEvent);

            expect(drillEventFunction).toHaveBeenCalledTimes(1);
            expect(drillEventFunction).toBeCalledWith(DRILL_EVENT_DATA);

            expect(clickEvent.target.dispatchEvent).toHaveBeenCalledTimes(0);
        });
    });
});
