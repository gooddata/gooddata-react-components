// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";
import PivotTableDrillExample from "../components/PivotTableDrillExample";
import PivotTableDrillExampleSRC from "!raw-loader!../components/PivotTableDrillExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSortingExample from "../components/PivotTableSortingExample";
import PivotTableSortingExampleSRC from "!raw-loader!../components/PivotTableSortingExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableTotalsExample from "../components/PivotTableTotalsExample";
import PivotTableTotalsExampleSRC from "!raw-loader!../components/PivotTableTotalsExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableRowGroupingExample from "../components/PivotTableRowGroupingExample";
import PivotTableRowGroupingExampleSRC from "!raw-loader!../components/PivotTableRowGroupingExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSubtotalsExample from "../components/PivotTableSubtotalsExample";
import PivotTableSubtotalsExampleSRC from "!raw-loader!../components/PivotTableSubtotalsExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSortingAggregationExample from "../components/PivotTableSortingAggregationExample";
import PivotTableSortingAggregationExampleSRC from "!raw-loader!../components/PivotTableSortingAggregationExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSizingExample from "../components/PivotTableSizingExample";
import PivotTableSizingExampleSRC from "!raw-loader!../components/PivotTableSizingExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableColumnsGrowToFitExample from "../components/PivotTableColumnsGrowToFitExample";
import PivotTableColumnsGrowToFitExampleSRC from "!raw-loader!../components/PivotTableColumnsGrowToFitExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableManualResizingExample from "../components/PivotTableManualResizingExample";
import PivotTableManualResizingExampleSRC from "!raw-loader!../components/PivotTableManualResizingExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const PivotTableDemo = () => (
    <div>
        <h1>Pivot Table</h1>

        <hr className="separator" />

        <h2>Example of presorted pivot table</h2>
        <div id="measures-row-attributes-and-column-attributes">
            <ExampleWithSource
                for={() => <PivotTableSortingExample />}
                source={PivotTableSortingExampleSRC}
            />
        </div>
        <hr className="separator" />

        <h2>Example of pivot table with totals</h2>
        <div id="table-with-totals">
            <ExampleWithSource for={() => <PivotTableTotalsExample />} source={PivotTableTotalsExampleSRC} />
        </div>
        <hr className="separator" />

        <h2>Example of drill event</h2>
        <div id="table-with-drill-events">
            <ExampleWithSource for={() => <PivotTableDrillExample />} source={PivotTableDrillExampleSRC} />
        </div>
        <hr className="separator" />

        <h2>Example of rows grouping</h2>
        <div id="table-with-row-grouping">
            <ExampleWithSource
                for={() => <PivotTableRowGroupingExample />}
                source={PivotTableRowGroupingExampleSRC}
            />
        </div>
        <hr className="separator" />

        <h2>Example of subtotals</h2>
        <div id="table-with-subtotals">
            <ExampleWithSource
                for={() => <PivotTableSubtotalsExample />}
                source={PivotTableSubtotalsExampleSRC}
            />
        </div>
        <hr className="separator" />

        <h2>Example of sort with aggregation</h2>
        <div id="table-with-sort-aggregation">
            <ExampleWithSource
                for={() => <PivotTableSortingAggregationExample />}
                source={PivotTableSortingAggregationExampleSRC}
            />
        </div>
        <hr className="separator" />

        <h2>Example of table column sizing</h2>
        <div id="table-with-column-sizing">
            <ExampleWithSource for={() => <PivotTableSizingExample />} source={PivotTableSizingExampleSRC} />
        </div>
        <hr className="separator" />

        <h2 id="table-with-column-sizing">Example of table grow to fit container</h2>
        <ExampleWithSource
            for={() => <PivotTableColumnsGrowToFitExample />}
            source={PivotTableColumnsGrowToFitExampleSRC}
        />

        <h2 id="table-with-column-sizing">Example of pivot table with manual resizing</h2>
        <ExampleWithSource
            for={() => <PivotTableManualResizingExample />}
            source={PivotTableManualResizingExampleSRC}
        />
    </div>
);

export default PivotTableDemo;
