// (C) 2019 GoodData Corporation
import { getHeadlineData, applyDrillableItems } from "../XirrTransformationUtils";
import {
    BASIC_EXECUTION_REQUEST,
    BASIC_EXECUTION_RESPONSE,
    BASIC_EXECUTION_RESULT,
    MEASURE_URI,
} from "../../test/fixtures/XirrTransformation.fixtures";
import { IHeadlineData } from "../../../../../interfaces/Headlines";
import * as headerPredicateFactory from "../../../../../factory/HeaderPredicateFactory";

describe("XirrTransformationUtils", () => {
    describe("getData", () => {
        it("should set primary item data from the execution", () => {
            const data = getHeadlineData(BASIC_EXECUTION_RESPONSE, BASIC_EXECUTION_RESULT);
            expect(data).toEqual({
                primaryItem: {
                    localIdentifier: "m_1",
                    title: "Sum of Cashflow",
                    value: "0.05958953474733984",
                    format: "#,##0.00",
                    isDrillable: false,
                },
            });
        });
    });

    describe("applyDrillableItems", () => {
        it("should NOT throw any error when drillable items do not match defined headline or execution data", () => {
            const headlineData = {};
            const data = applyDrillableItems(
                headlineData as IHeadlineData,
                [headerPredicateFactory.uriMatch("some-uri")],
                BASIC_EXECUTION_REQUEST,
                BASIC_EXECUTION_RESPONSE,
            );
            expect(data).toEqual({});
        });

        it("should reset drilling state of every item when drillable items does not match any header item", () => {
            const data = {
                primaryItem: {
                    localIdentifier: "m_1",
                    title: "Sum of Cashflow",
                    value: "0.05958953474733984",
                    format: "0.00%",
                    isDrillable: true,
                },
            };
            const updatedData = applyDrillableItems(
                data,
                [headerPredicateFactory.uriMatch("some-uri")],
                BASIC_EXECUTION_REQUEST,
                BASIC_EXECUTION_RESPONSE,
            );

            expect(updatedData).toEqual({
                primaryItem: {
                    localIdentifier: "m_1",
                    title: "Sum of Cashflow",
                    value: "0.05958953474733984",
                    format: "0.00%",
                    isDrillable: false,
                },
            });
        });

        it("should enable drilling of the primary item identified by the drillable item uri", () => {
            const data = applyDrillableItems(
                {
                    primaryItem: {
                        localIdentifier: "m_1",
                        title: "Sum of Cashflow",
                        value: "0.05958953474733984",
                        format: "0.00%",
                        isDrillable: false,
                    },
                },
                [headerPredicateFactory.uriMatch(MEASURE_URI)],
                BASIC_EXECUTION_REQUEST,
                BASIC_EXECUTION_RESPONSE,
            );

            expect(data).toEqual({
                primaryItem: {
                    localIdentifier: "m_1",
                    title: "Sum of Cashflow",
                    value: "0.05958953474733984",
                    format: "0.00%",
                    isDrillable: true,
                },
            });
        });
    });
});
