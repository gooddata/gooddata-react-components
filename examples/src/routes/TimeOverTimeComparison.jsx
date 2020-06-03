// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import SamePeriodColumnChartExample from "../components/SamePeriodColumnChartExample";
import PreviousPeriodHeadlineExample from "../components/PreviousPeriodHeadlineExample";
import SamePeriodPivotTableExample from "../components/SamePeriodPivotTableExample";
import SamePeriodBarChartExample from "../components/SamePeriodBarChartExample";
import SamePeriodLineChartExample from "../components/SamePeriodLineChartExample";
import SamePeriodComboChartExample from "../components/SamePeriodComboChartExample";
import SamePeriodHeadLineExample from "../components/SamePeriodHeadLineExample";
import SamePeriodBulletChartExample from "../components/SamePeriodBulletChartExample";

import SamePeriodColumnChartExampleSrc from "!raw-loader!../components/SamePeriodColumnChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PreviousPeriodHeadlineExampleSrc from "!raw-loader!../components/PreviousPeriodHeadlineExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodPivotTableExampleSrc from "!raw-loader!../components/SamePeriodPivotTableExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodBarChartExampleSrc from "!raw-loader!../components/SamePeriodBarChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodLineChartExampleSrc from "!raw-loader!../components/SamePeriodLineChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodComboChartExampleSrc from "!raw-loader!../components/SamePeriodComboChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodHeadLineExampleSrc from "!raw-loader!../components/SamePeriodHeadLineExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import SamePeriodBulletChartExampleSrc from "!raw-loader!../components/SamePeriodBulletChartExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const TimeOverTimeComparison = () => (
    <div>
        <h1>Time Over Time Comparison</h1>
        <p>
            These examples show how to configure visual components like column charts or headlines to show
            data compared to the previous period or to the same period of the previous year.
        </p>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in column chart</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-1">
            <ExampleWithSource for={SamePeriodColumnChartExample} source={SamePeriodColumnChartExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in pivot table</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-2">
            <ExampleWithSource for={SamePeriodPivotTableExample} source={SamePeriodPivotTableExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in bar chart</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-3">
            <ExampleWithSource for={SamePeriodBarChartExample} source={SamePeriodBarChartExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in line chart</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-4">
            <ExampleWithSource for={SamePeriodLineChartExample} source={SamePeriodLineChartExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in combo chart</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-5">
            <ExampleWithSource for={SamePeriodComboChartExample} source={SamePeriodComboChartExampleSrc} />
        </div>
        <hr className="separator" />

        <h2>Comparing to the same period previous year in head line</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-6">
            <ExampleWithSource for={SamePeriodHeadLineExample} source={SamePeriodHeadLineExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the same period previous year in bullet chart</h2>
        <div className="s-compare-to-the-same-period-previous-year-example-7">
            <ExampleWithSource for={SamePeriodBulletChartExample} source={SamePeriodBulletChartExampleSrc} />
        </div>

        <hr className="separator" />

        <h2>Comparing to the previous period in head line</h2>
        <ExampleWithSource for={PreviousPeriodHeadlineExample} source={PreviousPeriodHeadlineExampleSrc} />
    </div>
);

export default TimeOverTimeComparison;
