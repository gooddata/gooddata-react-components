// (C) 2019-2020 GoodData Corporation
import { measureValueFilter } from "../measureValueFilters";
import * as Operator from "../../../constants/measureValueFilterOperators";

describe("measureValueFilter", () => {
    it("should build filter without condition", () => {
        const filter = measureValueFilter("m2");
        expect(filter).toMatchSnapshot();
    });

    it("should build comparison filter", () => {
        const comparisonValue = {
            value: 200,
        };
        const filter = measureValueFilter("m1").condition(Operator.EQUAL_TO, comparisonValue);
        expect(filter).toMatchSnapshot();
    });

    it("should build range filter", () => {
        const rangeValue = {
            from: 100,
            to: 300,
        };
        const filter = measureValueFilter("m2").condition(Operator.BETWEEN, rangeValue);
        expect(filter).toMatchSnapshot();
    });

    it("should return filter with zeros in condition when the values are not found in range input ", () => {
        const filter = measureValueFilter("m2").condition(Operator.BETWEEN, {});
        expect(filter).toMatchSnapshot();
    });

    it("should return filter with zeros in condition when the values are not found in comparison input ", () => {
        const filter = measureValueFilter("m2").condition(Operator.GREATER_THAN, {});
        expect(filter).toMatchSnapshot();
    });

    it("should return filter without condition when provided with unknown operator", () => {
        const rangeValue = {
            from: 100,
            to: 300,
        };
        const filter = measureValueFilter("m2").condition("blah", rangeValue);
        expect(filter).toMatchSnapshot();
    });

    it("should build comparison filter with treat null values as zero", () => {
        const comparisonValue = {
            value: 200,
        };
        const filter = measureValueFilter("m1").condition(Operator.EQUAL_TO, comparisonValue, true);
        expect(filter).toMatchSnapshot();
    });

    it("should build range filter with threat null values as zero", () => {
        const rangeValue = {
            from: 100,
            to: 300,
        };
        const filter = measureValueFilter("m2").condition(Operator.BETWEEN, rangeValue, true);
        expect(filter).toMatchSnapshot();
    });
});
