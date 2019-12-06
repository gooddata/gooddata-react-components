// (C) 2019 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";
import noop = require("lodash/noop");

import MVFDropdownFragment from "./fragments/MeasureValueFilter";
import { DropdownAfmWrapper, IDropdownProps } from "../DropdownAfmWrapper";
import * as Operators from "../../../../constants/measureValueFilterOperators";
import { withIntl } from "../../../visualizations/utils/intlUtils";
import { measureValueFilter } from "../../../../helpers/model/measureValueFilters";

const renderComponent = (props?: Partial<IDropdownProps>) => {
    const defaultProps: IDropdownProps = {
        onApply: noop,
        onCancel: noop,
        measureIdentifier: "myMeasure",
    };
    const Wrapped = withIntl(DropdownAfmWrapper);
    return new MVFDropdownFragment(mount(<Wrapped {...defaultProps} {...props} />));
};

describe("Measure value filter", () => {
    it("should render single value input when comparison type operator is selected", () => {
        const component = renderComponent();

        component.openOperatorDropdown().selectOperator(Operators.GREATER_THAN);

        expect(component.getRangeFromInput().length).toEqual(0);
        expect(component.getRangeToInput().length).toEqual(0);
        expect(component.getComparisonValueInput().length).toEqual(1);
    });

    it("should render from and to inputs when range type operator is selected", () => {
        const component = renderComponent();

        component.openOperatorDropdown().selectOperator(Operators.BETWEEN);

        expect(component.getRangeFromInput().length).toEqual(1);
        expect(component.getRangeToInput().length).toEqual(1);
        expect(component.getComparisonValueInput().length).toEqual(0);
    });

    it("should have All operator preselected and no inputs rendered if there is no filter provided", () => {
        const component = renderComponent();

        expect(component.getSelectedOperatorTitle()).toEqual("All");
        expect(component.getRangeFromInput().length).toEqual(0);
        expect(component.getRangeToInput().length).toEqual(0);
        expect(component.getComparisonValueInput().length).toEqual(0);
    });

    it("should have given operator preselected and values filled if filter is provided", () => {
        const filter = measureValueFilter.getFilter("myMeasure", Operators.LESS_THAN, { value: 100 });
        const component = renderComponent({ filter });

        expect(component.getSelectedOperatorTitle()).toEqual("Less than");
        expect(component.getComparisonValueInput().props().value).toEqual(100);
    });

    it("should have selected operator highlighted in operator dropdown", () => {
        const filter = measureValueFilter.getFilter("myMeasure", Operators.LESS_THAN, { value: 100 });
        const component = renderComponent({ filter });

        expect(
            component
                .openOperatorDropdown()
                .getOperator(Operators.LESS_THAN)
                .hasClass("is-selected"),
        ).toEqual(true);
    });

    describe("onApply callback", () => {
        it("should be called with comparison type measure value filter when comparison operator is selected and value is filled", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            const expectedFilter = measureValueFilter.getFilter("myMeasure", Operators.GREATER_THAN, {
                value: 100,
            });

            component
                .openOperatorDropdown()
                .selectOperator(Operators.GREATER_THAN)
                .setComparisonValue("100")
                .clickApply();

            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with range type measure value filter when range operator is selected and both values are filled", () => {
            const onApply = jest.fn();
            const component = renderComponent({ onApply });

            const expectedFilter = measureValueFilter.getFilter("myMeasure", Operators.BETWEEN, {
                from: 100,
                to: 200,
            });

            component
                .openOperatorDropdown()
                .selectOperator(Operators.BETWEEN)
                .setRangeFrom("100")
                .setRangeTo("200")
                .clickApply();

            expect(onApply).toBeCalledWith(expectedFilter);
        });

        it("should be called with null value when All operator is applied", () => {
            const onApply = jest.fn();
            const filter = measureValueFilter.getFilter("myMeasure", Operators.LESS_THAN, { value: 100 });
            const component = renderComponent({ filter, onApply });

            component
                .openOperatorDropdown()
                .selectOperator(Operators.ALL)
                .clickApply();

            expect(onApply).toBeCalledWith(null);
        });

        describe("empty values", () => {
            it("should be called with comparison type measure value filter with 'value' set to 0 if 'value' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                const expectedFilter = measureValueFilter.getFilter("myMeasure", Operators.GREATER_THAN, {
                    value: 0,
                });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operators.GREATER_THAN)
                    .clickApply();

                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should be called with range type measure value filter with 'from' set to 0 if 'from' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                const expectedFilter = measureValueFilter.getFilter("myMeasure", Operators.BETWEEN, {
                    from: 0,
                    to: 100,
                });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operators.BETWEEN)
                    .setRangeTo("100")
                    .clickApply();

                expect(onApply).toBeCalledWith(expectedFilter);
            });

            it("should be called with range type measure value filter with 'to' set to 0 if 'to' input is empty", () => {
                const onApply = jest.fn();
                const component = renderComponent({ onApply });

                const expectedFilter = measureValueFilter.getFilter("myMeasure", Operators.BETWEEN, {
                    from: 100,
                    to: 0,
                });

                component
                    .openOperatorDropdown()
                    .selectOperator(Operators.BETWEEN)
                    .setRangeFrom("100")
                    .clickApply();

                expect(onApply).toBeCalledWith(expectedFilter);
            });
        });
    });
});
