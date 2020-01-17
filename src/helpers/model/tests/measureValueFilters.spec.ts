// (C) 2019-2020 GoodData Corporation
import { AFM } from "@gooddata/typings";
import { measureValueFilter } from "../measureValueFilters";
import * as Operator from "../../../constants/measureValueFilterOperators";

describe("measureValueFilter", () => {
    it("should build filter without condition", () => {
        const filter = measureValueFilter("m2");

        const expectedAfmFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m2",
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmFilter);
    });

    it("should build comparison filter", () => {
        const comparisonValue = {
            value: 200,
        };

        const filter = measureValueFilter("m1").condition(Operator.EQUAL_TO, comparisonValue);

        const expectedAfmComparisonFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m1",
                },
                condition: {
                    comparison: {
                        operator: Operator.EQUAL_TO,
                        value: 200,
                    },
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmComparisonFilter);
    });

    it("should build range filter", () => {
        const rangeValue = {
            from: 100,
            to: 300,
        };

        const filter = measureValueFilter("m2").condition(Operator.BETWEEN, rangeValue);

        const expectedAfmRangeFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m2",
                },
                condition: {
                    range: {
                        operator: Operator.BETWEEN,
                        from: 100,
                        to: 300,
                    },
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmRangeFilter);
    });

    it("should return filter with zeros in condition when the values are not found in range input ", () => {
        const filter = measureValueFilter("m2").condition(Operator.BETWEEN, {});

        const expectedAfmFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m2",
                },
                condition: {
                    range: {
                        operator: Operator.BETWEEN,
                        from: 0,
                        to: 0,
                    },
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmFilter);
    });

    it("should return filter with zeros in condition when the values are not found in comparison input ", () => {
        const filter = measureValueFilter("m2").condition(Operator.GREATER_THAN, {});

        const expectedAfmFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m2",
                },
                condition: {
                    comparison: {
                        operator: Operator.GREATER_THAN,
                        value: 0,
                    },
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmFilter);
    });

    it("should return filter without condition when provided with unknown operator", () => {
        const rangeValue = {
            from: 100,
            to: 300,
        };

        const filter = measureValueFilter("m2").condition("blah", rangeValue);

        const expectedAfmFilter: AFM.IMeasureValueFilter = {
            measureValueFilter: {
                measure: {
                    localIdentifier: "m2",
                },
            },
        };
        expect(filter).toMatchObject(expectedAfmFilter);
    });
});
