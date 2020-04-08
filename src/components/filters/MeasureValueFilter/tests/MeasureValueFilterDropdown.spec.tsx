// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import noop = require("lodash/noop");

import MVFDropdownFragment from "./fragments/MeasureValueFilterDropdown";
import { MeasureValueFilterDropdown, IMeasureValueFilterDropdownProps } from "../MeasureValueFilterDropdown";
import * as Operator from "../../../../constants/measureValueFilterOperators";
import { withIntl } from "../../../visualizations/utils/intlUtils";
import * as Model from "../../../../helpers/model";

const renderComponent = (props?: Partial<IMeasureValueFilterDropdownProps>) => {
    const defaultProps: IMeasureValueFilterDropdownProps = {
        onApply: noop,
        onCancel: noop,
        filter: Model.measureValueFilter("myMeasure"),
    };
    const Wrapped = withIntl(MeasureValueFilterDropdown);
    return new MVFDropdownFragment(mount(<Wrapped {...defaultProps} {...props} />));
};

describe("Measure value filter dropdown", () => {
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
        expect(component.getComparisonValueInput().props().value).toEqual("100");
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

        it("should compensate for JavaScript division result precision problem for comparison filter", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply, usePercentage: true });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.GREATER_THAN)
                .setComparisonValue("42.1")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.GREATER_THAN, { value: 0.421 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should compensate for JavaScript division result precision problem for range filter", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply, usePercentage: true });

            component
                .openOperatorDropdown()
                .selectOperator(Operator.BETWEEN)
                .setRangeFrom("42.1")
                .setRangeTo("1151.545")
                .clickApply();

            const expectedFilter = Model.measureValueFilter("myMeasure")
                .condition(Operator.BETWEEN, { from: 0.421, to: 11.51545 })
                .getAfmMeasureValueFilter();
            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should compensate for JavaScript multiplication result precision problem for comparison filter", () => {
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, {
                value: 46.001,
            });

            const component = renderComponent({ filter, usePercentage: true });

            expect(component.getComparisonValueInput().props().value).toEqual("4,600.1");
        });

        it("should compensate for JavaScript multiplication result precision problem for range filter", () => {
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.NOT_BETWEEN, {
                from: 1.11,
                to: 4.44,
            });

            const component = renderComponent({ filter, usePercentage: true });

            expect(component.getRangeFromInput().props().value).toEqual("111");
            expect(component.getRangeToInput().props().value).toEqual("444");
        });

        describe("filter with treat-null-values-as", () => {
            it("should contain 'treatNullValuesAs' property if checked", () => {
                const onApply = jest.fn();
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.GREATER_THAN, {
                    value: 100,
                });

                const component = renderComponent({
                    filter,
                    onApply,
                    displayTreatNullAsZeroOption: true,
                });

                component.toggleTreatNullAsCheckbox().clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.GREATER_THAN, { value: 100 }, true)
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should contain 'treatNullValuesAs' equal to 0 if checked, but no 'treatNullAsZeroDefaultValue' was provided", () => {
                const onApply = jest.fn();
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.GREATER_THAN, {
                    value: 100,
                });

                const component = renderComponent({
                    filter,
                    onApply,
                    displayTreatNullAsZeroOption: true,
                });

                component.toggleTreatNullAsCheckbox().clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.GREATER_THAN, { value: 100 }, true)
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should be called with filter not containing 'treatNullValuesAs' property if treat-null-values-as checkbox was unchecked", () => {
                const onApply = jest.fn();

                const filterWithTreatNullValuesAsZero = Model.measureValueFilter("myMeasure").condition(
                    Operator.GREATER_THAN,
                    { value: 100 },
                    true,
                );

                const component = renderComponent({
                    filter: filterWithTreatNullValuesAsZero,
                    onApply,
                    displayTreatNullAsZeroOption: true,
                });

                component.toggleTreatNullAsCheckbox().clickApply();

                const expectedFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.GREATER_THAN, { value: 100 })
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedFilter);
            });
        });

        describe("apply button", () => {
            it("should disable apply button when opened with all operator", () => {
                const filter = Model.measureValueFilter("myMeasure");
                const component = renderComponent({ filter });

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it("should enable apply button when operator is changed to all from comparison operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.EQUAL_TO, {
                    value: 10,
                });
                const component = renderComponent({ filter });

                component.openOperatorDropdown().selectOperator(Operator.ALL);

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should enable apply button when value changes with comparison operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.EQUAL_TO, {
                    value: 10,
                });
                const component = renderComponent({ filter });

                component.setComparisonValue("1000");

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should disable apply button when value is empty with comparison operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.EQUAL_TO, {
                    value: 10,
                });
                const component = renderComponent({ filter });

                component.setComparisonValue("");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it("should disable apply button when value is equal to prop value with comparison operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.EQUAL_TO, {
                    value: 10,
                });
                const component = renderComponent({ filter });

                component.setComparisonValue("100").setComparisonValue("10");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it('should enable apply button when "from" value changes', () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 10,
                });
                const component = renderComponent({ filter });

                component.setRangeFrom("100");

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it('should enable apply button when "to" value changes', () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 10,
                });
                const component = renderComponent({ filter });

                component.setRangeTo("100");

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should disable apply button when value is equal to prop value with comparison operator using percentage values", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.EQUAL_TO, {
                    value: 10,
                });
                const component = renderComponent({ filter, usePercentage: true });

                component.setComparisonValue("100").setComparisonValue("1000");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it('should disable apply button when "to" value is empty', () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 10,
                });
                const component = renderComponent({ filter });

                component.setRangeTo("");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it('should disable apply button when "from" value is empty', () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 10,
                });
                const component = renderComponent({ filter });

                component.setRangeFrom("");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it("should disable apply button when value is equal to prop value with range operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 20,
                });
                const component = renderComponent({ filter });

                component.setRangeTo("200").setRangeTo("20");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it("should disable apply button when value is equal to prop value with range operator using percentage values", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 20,
                });
                const component = renderComponent({ filter, usePercentage: true });

                component.setRangeFrom("100").setRangeFrom("1000");

                expect(component.isApplyButtonDisabled()).toEqual(true);
            });

            it("should enable apply button when operator is changed but value is same with comparison operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, {
                    value: 10,
                });

                const component = renderComponent({ filter });

                component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should enable apply button when operator is changed but value is same with range operator", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.BETWEEN, {
                    from: 10,
                    to: 10,
                });

                const component = renderComponent({ filter });

                component.openOperatorDropdown().selectOperator(Operator.NOT_BETWEEN);

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should enable apply button when operator and value is unchanged, but treat-null-values-as checkbox has been toggled", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.GREATER_THAN, {
                    value: 10,
                });

                const component = renderComponent({ filter, displayTreatNullAsZeroOption: true });

                expect(component.isApplyButtonDisabled()).toEqual(true);

                component.toggleTreatNullAsCheckbox();

                expect(component.isApplyButtonDisabled()).toEqual(false);
            });

            it("should handle the change from comparison to range filter", () => {
                const onApply = jest.fn();
                const component = renderComponent({ usePercentage: true, onApply });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.GREATER_THAN)
                    .setComparisonValue("100")
                    .clickApply();

                const expectedComparisonFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.GREATER_THAN, {
                        value: 1,
                    })
                    .getAfmMeasureValueFilter();
                expect(onApply).toBeCalledWith(expectedComparisonFilter);

                component
                    .openOperatorDropdown()
                    .selectOperator(Operator.BETWEEN)
                    .setRangeFrom("200")
                    .setRangeTo("500")
                    .clickApply();

                const expectedRangeFilter = Model.measureValueFilter("myMeasure")
                    .condition(Operator.BETWEEN, {
                        from: 2,
                        to: 5,
                    })
                    .getAfmMeasureValueFilter();
                expect(onApply).nthCalledWith(2, expectedRangeFilter);
            });
        });
    });

    describe("press enter", () => {
        it("should be able to press enter to apply when apply button is enabled", () => {
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, { value: 10 });
            const onApply = jest.fn();
            const component = renderComponent({ filter, onApply });

            component.setComparisonValue("20").pressEnterInComparisonInput();

            expect(onApply).toHaveBeenCalledTimes(1);
        });

        it("should not be able to press enter to apply when apply button is disabled", () => {
            const filter = Model.measureValueFilter("myMeasure").condition(Operator.LESS_THAN, { value: 10 });
            const onApply = jest.fn();
            const component = renderComponent({ filter, onApply });

            component.pressEnterInComparisonInput();

            expect(onApply).toHaveBeenCalledTimes(0);
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

    describe("treat-null-values-as checkbox", () => {
        it("should not be displayed by default", () => {
            const component = renderComponent();

            expect(component.getTreatNullAsCheckbox().exists()).toEqual(false);
        });

        it("should not be displayed when all operator is selected", () => {
            const component = renderComponent({ displayTreatNullAsZeroOption: true });

            expect(component.getTreatNullAsCheckbox().exists()).toEqual(false);
        });

        it("should be displayed when enabled by 'displayOptionTreatNullValuesAs' prop and all operator is not selected", () => {
            const component = renderComponent({ displayTreatNullAsZeroOption: true });

            component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

            expect(component.getTreatNullAsCheckbox().exists()).toEqual(true);
        });

        describe("checked state", () => {
            const renderComponentWithTreatNullAsZeroOption = (
                props?: Partial<IMeasureValueFilterDropdownProps>,
            ) => renderComponent({ displayTreatNullAsZeroOption: true, ...props });

            it("should be checked when passed filter is empty and 'treatNullAsZeroDefaultValue' property is truthy", () => {
                const filter = Model.measureValueFilter("myMeasure");
                const component = renderComponentWithTreatNullAsZeroOption({
                    treatNullAsZeroDefaultValue: true,
                    filter,
                });

                component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

                expect(component.getTreatNullAsCheckbox().props().checked).toEqual(true);
            });

            it("should not be checked when passed filter is empty and 'treatNullAsZeroDefaultValue' property is set to false", () => {
                const filter = Model.measureValueFilter("myMeasure");
                const component = renderComponentWithTreatNullAsZeroOption({
                    treatNullAsZeroDefaultValue: false,
                    filter,
                });

                component.openOperatorDropdown().selectOperator(Operator.GREATER_THAN);

                expect(component.getTreatNullAsCheckbox().props().checked).toEqual(false);
            });

            it("should be checked when passed filter has a condition with 'treatNullValuesAsZero' property set to true", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(
                    Operator.GREATER_THAN,
                    { value: 100 },
                    true,
                );
                const component = renderComponentWithTreatNullAsZeroOption({ filter });

                expect(component.getTreatNullAsCheckbox().props().checked).toEqual(true);
            });

            it("should not be checked when passed filter has a condition without 'treatNullValuesAsZero' property even if 'treatNullAsZeroDefaultValue' property is truthy", () => {
                const filter = Model.measureValueFilter("myMeasure").condition(Operator.GREATER_THAN, {
                    value: 100,
                });
                const component = renderComponentWithTreatNullAsZeroOption({ filter });

                expect(component.getTreatNullAsCheckbox().props().checked).toEqual(false);
            });
        });
    });
});
