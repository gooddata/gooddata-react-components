// (C) 2019 GoodData Corporation
import moment from "moment";
import { ExtendedDateFilters } from "@gooddata/typings";
import { convertDateFilterConfigToDateFilterOptions } from "../DateFilterConfigConversions";
import { platformDateFormat } from "../../../constants/Platform";

describe("convertDateFilterConfigToDateFilterOptions", () => {
    it("should convert the config properly", () => {
        const input: ExtendedDateFilters.IDateFilterConfigContent = {
            allTime: {
                localIdentifier: "ALL_TIME",
                name: "",
                visible: true,
            },
            absoluteForm: {
                localIdentifier: "ABSOLUTE_FORM",
                name: "",
                visible: true,
            },
            absolutePresets: [
                {
                    from: "2019-01-01",
                    localIdentifier: "YEAR_2019",
                    name: "The year 2019",
                    to: "2019-12-31",
                    visible: true,
                },
            ],
            relativeForm: {
                granularities: ["GDC.time.date"],
                localIdentifier: "RELATIVE_FORM",
                name: "",
                visible: true,
            },
            relativePresets: [
                {
                    from: 0,
                    granularity: "GDC.time.month",
                    localIdentifier: "THIS_MONTH",
                    to: 0,
                    name: "",
                    visible: true,
                },
            ],
            selectedOption: "ALL_TIME",
        };

        const expected: ExtendedDateFilters.IDateFilterOptionsByType = {
            allTime: {
                localIdentifier: "ALL_TIME",
                name: "",
                type: "allTime",
                visible: true,
            },
            absoluteForm: {
                from: moment()
                    .subtract(1, "month")
                    .startOf("day")
                    .format(platformDateFormat),
                localIdentifier: "ABSOLUTE_FORM",
                name: "",
                to: moment()
                    .startOf("day")
                    .format(platformDateFormat),
                type: "absoluteForm",
                visible: true,
            },
            absolutePreset: [
                {
                    from: "2019-01-01",
                    localIdentifier: "YEAR_2019",
                    name: "The year 2019",
                    to: "2019-12-31",
                    type: "absolutePreset",
                    visible: true,
                },
            ],
            relativeForm: {
                availableGranularities: ["GDC.time.date"],
                granularity: "GDC.time.date",
                localIdentifier: "RELATIVE_FORM",
                name: "",
                type: "relativeForm",
                visible: true,
            },
            relativePreset: {
                "GDC.time.month": [
                    {
                        from: 0,
                        granularity: "GDC.time.month",
                        localIdentifier: "THIS_MONTH",
                        to: 0,
                        name: "",
                        type: "relativePreset",
                        visible: true,
                    },
                ],
            },
        };

        expect(convertDateFilterConfigToDateFilterOptions(input)).toEqual(expected);
    });
});
