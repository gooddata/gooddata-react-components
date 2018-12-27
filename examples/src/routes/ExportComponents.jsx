// (C) 2007-2018 GoodData Corporation
import React from 'react';

import ExportExample from '../components/utils/ExportExample';

import BarChartExample from '../components/BarChartExample';
import TableExample from '../components/TableExample';
import PivotTableSortingExample from '../components/PivotTableSortingExample';

import BarChartExampleSRC from '!raw-loader!../components/BarChartExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import TableExampleSRC from '!raw-loader!../components/TableExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableSortingExampleSRC from '!raw-loader!../components/PivotTableTotalsExample'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const ExportComponents = () => (
    <div>
        <h1>Export Components</h1>

        <hr className="separator" />

        <h2 id="bar-chart">Bar chart</h2>
        <ExportExample for={BarChartExample} source={BarChartExampleSRC} />

        <hr className="separator" />

        <h2 id="table">Table</h2>
        <ExportExample for={TableExample} source={TableExampleSRC} />

        <hr className="separator" />

        <h2 id="measures-row-attributes-and-column-attributes">
            Example of Presorted Pivot Table
        </h2>
        <ExportExample
            for={PivotTableSortingExample}
            source={PivotTableSortingExampleSRC}
            showExportDialog
        />
    </div>
);

export default ExportComponents;
