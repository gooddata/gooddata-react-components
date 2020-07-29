// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";
import PivotTableSizingWithSubtotalsExample from "../components/PivotTableSizingWithSubtotalsExample";
import PivotTableSizingWithSubtotalsExampleSRC from "!raw-loader!../components/PivotTableSizingWithSubtotalsExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSizingWithAttributeFilterExample from "../components/PivotTableSizingWithAttributeFilterExample";
import PivotTableSizingWithAttributeFilterExampleSRC from "!raw-loader!../components/PivotTableSizingWithAttributeFilterExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSizingExample from "../components/PivotTableSizingExample";
import PivotTableSizingExampleSRC from "!raw-loader!../components/PivotTableSizingExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSizingComplexExample from "../components/PivotTableSizingComplexExample";
import PivotTableSizingComplexExampleSRC from "!raw-loader!../components/PivotTableSizingComplexExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSizingWithMultipleMeasuresExample from "../components/PivotTableSizingWithMultipleMeasuresExample";
import PivotTableSizingWithMultipleMeasuresExampleSRC from "!raw-loader!../components/PivotTableSizingWithMultipleMeasuresExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const PivotTableSizing = () => (
    <div>
        <h1>Pivot Table Sizing</h1>

        <hr className="separator" />

        <h2 id="simple-table">Simple table</h2>
        <ExampleWithSource for={() => <PivotTableSizingExample />} source={PivotTableSizingExampleSRC} />

        <hr className="separator" />

        <h2 id="table-with-subtotals">Table with subtotals</h2>
        <ExampleWithSource
            for={() => <PivotTableSizingWithSubtotalsExample withAttributes withMeasures withPivot />}
            source={PivotTableSizingWithSubtotalsExampleSRC}
        />

        <hr className="separator" />

        <h2 id="table-with-attribute-filter">Table with attribute filter</h2>
        <ExampleWithSource
            for={() => <PivotTableSizingWithAttributeFilterExample withAttributes withMeasures withPivot />}
            source={PivotTableSizingWithAttributeFilterExampleSRC}
        />

        <h2 id="simple-table">Sizing complex example</h2>
        <ExampleWithSource
            for={() => <PivotTableSizingComplexExample />}
            source={PivotTableSizingComplexExampleSRC}
        />

        <h2 id="table-with-multiple-measures">Table with multiple measures</h2>
        <ExampleWithSource
            for={() => <PivotTableSizingWithMultipleMeasuresExample />}
            source={PivotTableSizingWithMultipleMeasuresExampleSRC}
        />
    </div>
);

export default PivotTableSizing;
