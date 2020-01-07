// (C) 2007-2020 GoodData Corporation
import Factory from "../measureValueFilterFactory";
import { getDefaultFilter } from "../../helpers/model/measureValueFilters";
import * as Operator from "../../constants/measureValueFilterOperators";

describe("measureValueFilterFactory", () => {
    describe("buildFilter", () => {
        const defaultFilter = getDefaultFilter("franchisedSales");

        it("shoud return filter without condition property if we sent ALL property", () => {
            const filter = Factory.buildFilter(defaultFilter, "ALL");
            expect(filter).toEqual({
                measureValueFilter: {
                    measure: { localIdentifier: "franchisedSales" },
                },
            });
        });

        describe("comparation filter", () => {
            it.each`
                operator
                ${Operator.GREATER_THAN}
                ${Operator.GREATER_THAN_OR_EQUAL_TO}
                ${Operator.LESS_THAN}
                ${Operator.LESS_THAN_OR_EQUAL_TO}
                ${Operator.EQUAL_TO}
                ${Operator.NOT_EQUAL_TO}
            `("should build new comparation filter if we sent $operator operator", ({ operator }) => {
                const filter = Factory.buildFilter(defaultFilter, operator, {
                    value: 2000,
                });
                expect(filter).toEqual({
                    measureValueFilter: {
                        measure: { localIdentifier: "franchisedSales" },
                        condition: { comparison: { operator, value: 2000 } },
                    },
                });
            });
        });

        describe("range filter", () => {
            it.each`
                operator
                ${Operator.BETWEEN}
                ${Operator.NOT_BETWEEN}
            `("should build new ragne filter if we sent $operator operator", ({ operator }) => {
                const filter = Factory.buildFilter(defaultFilter, operator, {
                    from: 500000,
                    to: 800000,
                });
                expect(filter).toEqual({
                    measureValueFilter: {
                        measure: { localIdentifier: "franchisedSales" },
                        condition: { range: { operator, from: 500000, to: 800000 } },
                    },
                });
            });
        });
    });
});
