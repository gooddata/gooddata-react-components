// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { ExtendedDateFilters } from "@gooddata/typings";
import { IntlDecorator } from "../../utils/IntlDecorators";
import { DateFilterButtonLocalized } from "../../../src/components/filters/DateFilter/DateFilterButtonLocalized/DateFilterButtonLocalized";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

const granularities: ExtendedDateFilters.DateFilterGranularity[] = [
    "GDC.time.date",
    "GDC.time.week_us",
    "GDC.time.month",
    "GDC.time.quarter",
    "GDC.time.year",
];

const RelativeFormButton: React.FC<{
    from: number;
    to: number;
    selectedGranularity: ExtendedDateFilters.DateFilterGranularity;
}> = ({ from, to, selectedGranularity }) =>
    IntlDecorator(
        <DateFilterButtonLocalized
            dateFilterOption={{
                localIdentifier: "RELATIVE_FORM",
                from,
                to,
                granularity: selectedGranularity,
                type: "relativeForm",
                availableGranularities: granularities,
                visible: true,
                name: "Floating range",
            }}
            isMobile={false}
        />,
    );

const RelativePresetButton: React.FC<{
    from: number;
    to: number;
    granularity: ExtendedDateFilters.DateFilterGranularity;
    name?: string;
}> = ({ from, to, granularity, name }) =>
    IntlDecorator(
        <DateFilterButtonLocalized
            dateFilterOption={{
                localIdentifier: "relativePreset",
                type: "relativePreset",
                name,
                granularity,
                from,
                to,
                visible: true,
            }}
            isMobile={false}
        />,
    );

const AbsolutePresetButton: React.FC<{
    from: ExtendedDateFilters.DateString;
    to: ExtendedDateFilters.DateString;
    name?: string;
}> = ({ from, to, name }) =>
    IntlDecorator(
        <DateFilterButtonLocalized
            dateFilterOption={{
                localIdentifier: "ABSOLUTE_PRESET",
                type: "absolutePreset",
                name,
                from,
                to,
                visible: true,
            }}
            isMobile={false}
        />,
    );

storiesOf("Internal/DateFilter/DateFilterButtonLocalized", module)
    .add("allTime", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {IntlDecorator(
                    <DateFilterButtonLocalized
                        dateFilterOption={{
                            localIdentifier: "ALL_TIME",
                            type: "allTime",
                            name: "All time",
                            visible: true,
                        }}
                        isMobile={false}
                    />,
                )}
            </div>,
        ),
    )

    .add("absoluteForm", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {IntlDecorator(
                    <DateFilterButtonLocalized
                        dateFilterOption={{
                            from: new Date(Date.UTC(2018, 4, 1)).toISOString(),
                            to: new Date(Date.UTC(2019, 3, 30)).toISOString(),
                            localIdentifier: "ABSOLUTE_FORM",
                            type: "absoluteForm",
                            name: "Static period",
                            visible: true,
                        }}
                        isMobile={false}
                    />,
                )}
                {IntlDecorator(
                    <DateFilterButtonLocalized
                        dateFilterOption={{
                            from: new Date(Date.UTC(2018, 4, 1)).toISOString(),
                            to: new Date(Date.UTC(2018, 4, 1)).toISOString(),
                            localIdentifier: "ABSOLUTE_FORM",
                            type: "absoluteForm",
                            name: "Static period",
                            visible: true,
                        }}
                        isMobile={false}
                    />,
                )}
            </div>,
        ),
    )

    .add("relativeForm", () => {
        type FromTo = [number, number];
        const fromToPairs: FromTo[] = [
            [0, 0],
            [1, 1],
            [-1, -1],

            [0, 9],
            [-9, 0],

            [1, 10],
            [5, 10],
            [-10, -1],
            [-10, -5],
            [-1, 1],
            [-10, 1],
            [-1, 10],
            [-10, 10],
        ];

        return screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                {fromToPairs.map(([from, to], index) => (
                    <React.Fragment key={`${from}-${to}`}>
                        {index > 0 ? <hr /> : null}
                        {granularities.map(g => (
                            <RelativeFormButton key={g} from={from} to={to} selectedGranularity={g} />
                        ))}
                    </React.Fragment>
                ))}
            </div>,
        );
    })

    .add("absolutePreset", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <AbsolutePresetButton
                    from={new Date(Date.UTC(2018, 11, 20)).toISOString()}
                    to={new Date(Date.UTC(2018, 11, 30)).toISOString()}
                    name="Filter name when name is specified"
                />

                <AbsolutePresetButton
                    from={new Date(Date.UTC(2018, 11, 20)).toISOString()}
                    to={new Date(Date.UTC(2018, 11, 30)).toISOString()}
                />
            </div>,
        ),
    )

    .add("relativePreset", () =>
        screenshotWrap(
            <div style={wrapperStyle} className="screenshot-target">
                <RelativePresetButton
                    from={-6}
                    to={0}
                    granularity="GDC.time.date"
                    name="Filter name when name is specified"
                />

                <RelativePresetButton from={-6} to={0} granularity="GDC.time.date" />
            </div>,
        ),
    );
