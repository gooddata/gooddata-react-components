// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import noop = require("lodash/noop");

import MVFDropdownFragment from "./fragments/MeasureValueFilter";
import { DropdownAfmWrapper, IDropdownProps } from "../DropdownAfmWrapper";
import * as Operator from "../../../../constants/measureValueFilterOperators";
import { withIntl } from "../../../visualizations/utils/intlUtils";
import * as Model from "../../../../helpers/model";

const renderComponent = (props?: Partial<IDropdownProps>) => {
    const defaultProps: IDropdownProps = {
        onApply: noop,
        onCancel: noop,
        filter: {
            measureValueFilter: {
                measure: {
                    localIdentifier: "myMeasure",
                },
            },
        },
    };
    const Wrapped = withIntl(DropdownAfmWrapper);
    return new MVFDropdownFragment(mount(<Wrapped {...defaultProps} {...props} />));
};

describe("Measure value filter AFM wrapper", () => {
    it("should render single value input when comparison type operator is selected", () => {
        const component = renderComponent();

        component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

        expect(component.getRangeFromInput().length).toEqual(0);
        expect(component.getRangeToInput().length).toEqual(0);
        expect(component.getComparisonValueInput().length).toEqual(1);
    });

    it("should render from and to inputs when range type operator is selected", () => {
        const component = renderComponent();

        component.openOperatorDropdown().selectOperator(Operator.BETWEEN);

        expect(component.getRangeFromInput().length).toEqual(1);
        expect(component.getRangeToInput().length).toEqual(1);
        expect(component.getComparisonValueInput().length).toEqual(0);
    });

    it("should have All operator preselected and no inputs rendered if there is no condition in the filter provided", () => {
        const component = renderComponent();

        expect(component.getSelectedOperatorTitle()).toEqual("All");
        expect(component.getRangeFromInput().length).toEqual(0);
        expect(component.getRangeToInput().length).toEqual(0);
        expect(component.getComparisonValueInput().length).toEqual(0);
    });

    it("should have given operator preselected and values filled if filter with condition is provided", () => {
        const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, { value: 100 });

        const component = renderComponent({ filter });

        expect(component.getSelectedOperatorTitle()).toEqual("Less than");
        expect(component.getComparisonValueInput().props().value).toEqual(100);
    });

    it("should have selected operator highlighted in operator dropdown", () => {
        const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, { value: 100 });

        const component = renderComponent({ filter });

        expect(
            component
                .openOperatorDropdown()
                .getOperator(Operator.LESS_THAN)
                .hasClass("is-selected"),
        ).toEqual(true);
    });

    it("should render an input suffix for comparison value input field to display percentage sign if the measure is native percent", () => {
        const component = renderComponent({ usePercentage: true });

        component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

        expect(component.getInputSuffixes().length).toEqual(1);
    });

    it("should render an input suffix for each range value input field to display percentage sign if the measure is native percent", () => {
        const component = renderComponent({ usePercentage: true });

        component.openOperatorDropdown().selectOperator(Operator.BETWEEN);

        expect(component.getInputSuffixes().length).toEqual(2);
    });

    it("should not render warning message if not provided", () => {
        const component = renderComponent();

        expect(component.getWarningMessage().length).toEqual(0);
    });

    it("should render warning message if provided", () => {
        const warningMessage = "The filter uses actual measure values, not percentage.";

        const component = renderComponent({ warningMessage });

        expect(component.getWarningMessage().length).toEqual(1);
        expect(component.getWarningMessageText()).toEqual(warningMessage);
    });

    describe("tooltip", () => {
        const component = renderComponent();

        const hasTooltipClass = (operator: string) =>
            component
                .openOperatorDropdown()
                .getOperator(operator)
                .find(".tooltip-bubble")
                .exists();

        it.each`
            operator                             | showTooltip
            ${Operator.BETWEEN}                  | ${true}
            ${Operator.NOT_BETWEEN}              | ${true}
            ${Operator.ALL}                      | ${false}
            ${Operator.GREATER_THAN}             | ${false}
            ${Operator.GREATER_THAN_OR_EQUAL_TO} | ${false}
            ${Operator.LESS_THAN}                | ${false}
            ${Operator.LESS_THAN_OR_EQUAL_TO}    | ${false}
            ${Operator.EQUAL_TO}                 | ${false}
            ${Operator.NOT_EQUAL_TO}             | ${false}
        `("should return $showTooltip when operator is $operator", ({ operator, showTooltip }) => {
            expect(hasTooltipClass(operator)).toEqual(showTooltip);
        });
    });

    describe("onApply callback", () => {
        it("should be called with comparison type measure value filter when comparison operator is selected and value is filled", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.GREATER_THAN)
                .setComparisonValue("100")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.GREATER_THAN, { value: 100 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with range type measure value filter when range operator is selected and both values are filled", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.BETWEEN)
                .setRangeFrom("100")
                .setRangeTo("200")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.BETWEEN, { from: 100, to: 200 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with filter without condition when All operator is applied", () => {
            const onApply = jest.fn();
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, {
                value: 100,
            });
            const component = renderComponent({ filter, onApply });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.ALL)
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure").getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with raw value when the measure is displayed as percentage with a comparison type measure value filter", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply, usePercentage: true });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.GREATER_THAN)
                .setComparisonValue("100")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.GREATER_THAN, { value: 1 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with raw value when the measure is displayed as percentage with a range type measure value filter", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply, usePercentage: true });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.BETWEEN)
                .setRangeFrom("100")
                .setRangeTo("200")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.BETWEEN, { from: 1, to: 2 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with filter without condition when All operator is applied when the measure is displayed as percentage", () => {
            const onApply = jest.fn();
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, {
                value: 100,
            });
            const component = renderComponent({ filter, onApply, usePercentage: true });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.ALL)
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure").getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        describe("empty values", () => {
            it("should be called with comparison type measure value filter with 'value' set to 0 if 'value' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.GREATER_THAN)
                    .clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.GREATER_THAN, { value: 0 })
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should be called with range type measure value filter with 'from' set to 0 if 'from' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.BETWEEN)
                    .setRangeTo("100")
                    .clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.BETWEEN, { from: 0, to: 100 })
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should be called with range type measure value filter with 'to' set to 0 if 'to' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.BETWEEN)
                    .setRangeFrom("100")
                    .clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.BETWEEN, {
                        from: 100,
                        to: 0,
                    })
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expect.objectContaining(expectedFilter));
            });

            it("should be called with empty condition when ALL was selected", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.ALL)
                    .clickApply();

                const expectedFilter = {
                    measureValueFilter: {
                        measure: {
                            localIdentifier: "myMeasure",
                        },
                    },
                };
                expect(onApply).toBeCalledWith(expectedFilter);
            });
        });
    });

    describe("onCancel feedback", () => {
        it("should be called when cancelled", () => {
            const onCancel = jest.fn();
            const component = renderComponent({ onCancel });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.BETWEEN)
                .setRangeFrom("100")
                .clickCancel();

            expect(onCancel).toBeCalled();
        });
    });
});
