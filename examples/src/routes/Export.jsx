// (C) 2007-2020 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";
import BarChartExportExample from "../components/BarChartExportExample";
import TableExportExample from "../components/TableExportExample";
import PivotTableExportExample from "../components/PivotTableExportExample";
import VisualizationColumnChartExportExample from "../components/VisualizationColumnChartExportExample";
import HeadlineExportExample from "../components/HeadlineExportExample";
import BulletExportExample from "../components/BulletExportExample";
import DropdownSource from "../components/utils/SourceDropdown";

import BarChartExportExampleSRC from "!raw-loader!../components/BarChartExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import TableExportExampleSRC from "!raw-loader!../components/TableExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import PivotTableExportExampleSRC from "!raw-loader!../components/PivotTableExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationColumnChartExportExampleSRC from "!raw-loader!../components/VisualizationColumnChartExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import HeadlineExportExampleSRC from "!raw-loader!../components/HeadlineExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import BulletExportExampleSRC from "!raw-loader!../components/BulletExportExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import ExampleWithExportSRC from "!raw-loader!../components/utils/ExampleWithExport"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const Export = () => (
    <div>
        <h1>Export</h1>
        <p>
            Each visualization lets you specify <code>onExportReady</code> callback, which the visualization
            will call once it is rendered and its underlying data is ready for export. The value passed
            through the callback is a function that can be used to trigger the exports. This allows for
            integration with wrapper components that can trigger exports for any visualization. For examples,
            see the attached source code below.
        </p>
        <DropdownSource source={ExampleWithExportSRC} />
        <p>
            These examples show how to export data for components like{" "}
            <code>ColumnChart, Table/Pivot Table or Visualization</code>.
        </p>

        <hr className="separator" />

        <h2>Export Chart Data</h2>
        <ExampleWithSource for={BarChartExportExample} source={BarChartExportExampleSRC} />

        <hr className="separator" />

        <h2>Export Table Data</h2>
        <ExampleWithSource for={TableExportExample} source={TableExportExampleSRC} />

        <hr className="separator" />

        <h2>Export Pivot Table Data</h2>
        <ExampleWithSource for={PivotTableExportExample} source={PivotTableExportExampleSRC} />

        <hr className="separator" />

        <h2>Export Visualization Data</h2>
        <ExampleWithSource
            for={VisualizationColumnChartExportExample}
            source={VisualizationColumnChartExportExampleSRC}
        />

        <hr className="separator" />

        <h2>Export Headline Data</h2>
        <ExampleWithSource for={HeadlineExportExample} source={HeadlineExportExampleSRC} />

        <hr className="separator" />

        <h2>Export Bullet Data</h2>
        <ExampleWithSource for={BulletExportExample} source={BulletExportExampleSRC} />
    </div>
);

export default Export;
