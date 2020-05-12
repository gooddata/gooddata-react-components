// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";

import { Model, PivotTable } from "../../../src";
import { onErrorHandler } from "../../mocks";
import { GERMAN_SEPARATORS } from "../../data/numberFormat";
import {
    ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
    ARITHMETIC_MEASURE_USING_ARITHMETIC,
    ATTRIBUTE_1,
    ATTRIBUTE_1_WITH_ALIAS,
    ATTRIBUTE_2,
    ATTRIBUTE_3,
    ATTRIBUTE_COUNTRY,
    GRAND_TOTALS_WITH_SUBTOTALS,
    MEASURE_1,
    MEASURE_1_WITH_ALIAS,
    MEASURE_2,
    MEASURE_2_WITH_FORMAT,
    MEASURE_WITH_NULLS,
    TOTAL_M1_A1,
    TOTAL_M2_A1,
} from "../../data/componentProps";
import { VisualizationInput } from "@gooddata/typings";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../../utils/ScreenshotReadyWrapper";

function logTotalsChange(data: any) {
    if (data.properties && data.properties.totals) {
        action("totals changed")(data.properties.totals);
    }
}

const wrapperStyle = { width: 1200, height: 300 };

storiesOf("Core components/PivotTable/PivotTable", module)
    .add("two measures, one attribute", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("renamed measure and renamed attribute", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1_WITH_ALIAS]}
                        rows={[ATTRIBUTE_1_WITH_ALIAS]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("only measures", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("two measures, 2 row attributes", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("two measures, 2 column attributes", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        columns={[ATTRIBUTE_1, ATTRIBUTE_2]}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("two measures, 1 column attribute, 1 row attribute", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        columns={[ATTRIBUTE_1]}
                        rows={[ATTRIBUTE_2]}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("two measures, 1 column attribute, 1 row attribute with sorting", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        columns={[ATTRIBUTE_1]}
                        sortBy={[
                            {
                                attributeSortItem: {
                                    direction: "asc",
                                    attributeIdentifier: "a2",
                                },
                            },
                            {
                                measureSortItem: {
                                    direction: "asc",
                                    locators: [
                                        {
                                            attributeLocatorItem: {
                                                attributeIdentifier: "a1",
                                                element: "/gdc/md/storybook/obj/4/elements?id=2",
                                            },
                                        },
                                        {
                                            measureLocatorItem: {
                                                measureIdentifier: "m1",
                                            },
                                        },
                                    ],
                                },
                            },
                        ]}
                        rows={[ATTRIBUTE_2]}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("table with resizing", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div
                    style={{
                        width: 800,
                        height: 400,
                        padding: 10,
                        border: "solid 1px #000000",
                        resize: "both",
                        overflow: "auto",
                    }}
                    className="s-table"
                >
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_2, ATTRIBUTE_1]}
                        totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                        onError={onErrorHandler}
                        pushData={logTotalsChange}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("custom number separators", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={GERMAN_SEPARATORS}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("custom measure format", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2_WITH_FORMAT]}
                        rows={[ATTRIBUTE_1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("empty value", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_WITH_NULLS]}
                        rows={[ATTRIBUTE_1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("totals - two measures, two row attributes", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                        totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("totals - two measures, one column attributes, one row attribute", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        columns={[ATTRIBUTE_2]}
                        rows={[ATTRIBUTE_1]}
                        totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("totals - two measures, one row attribute, maxHeight 100", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        config={{
                            maxHeight: 100,
                        }}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("totals - two measures, one row attribute, maxHeight 300", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        totals={[TOTAL_M1_A1, TOTAL_M2_A1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        config={{
                            maxHeight: 300,
                        }}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("totals - column and row attributes with menu enabled", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        columns={[ATTRIBUTE_3]}
                        rows={[ATTRIBUTE_1, ATTRIBUTE_2]}
                        totals={GRAND_TOTALS_WITH_SUBTOTALS}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        config={{
                            menu: {
                                aggregations: true,
                                aggregationsSubMenu: true,
                            },
                        }}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("arithmetic measures", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[
                            ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
                            ARITHMETIC_MEASURE_USING_ARITHMETIC,
                            MEASURE_1,
                            MEASURE_2,
                        ]}
                        rows={[ATTRIBUTE_1]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("data grouping - group rows in attribute columns", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1, ATTRIBUTE_COUNTRY, ATTRIBUTE_2]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("data grouping - do not group rows in attribute columns when not sorted by first attribute", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1, ATTRIBUTE_COUNTRY, ATTRIBUTE_2]}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        sortBy={[
                            {
                                measureSortItem: {
                                    direction: "desc",
                                    locators: [
                                        {
                                            measureLocatorItem: {
                                                measureIdentifier: "m1",
                                            },
                                        },
                                    ],
                                },
                            },
                        ]}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("subtotals - all labels", () => {
        const measures = [Model.measure("/gdc/md/storybook/obj/2352").localIdentifier("m1")];

        const attributes = [
            Model.attribute("/gdc/md/storybook/obj/2188").localIdentifier("a1"),
            Model.attribute("/gdc/md/storybook/obj/2197").localIdentifier("a2"),
            Model.attribute("/gdc/md/storybook/obj/2211").localIdentifier("a3"),
            Model.attribute("/gdc/md/storybook/obj/2005").localIdentifier("a4"),
            Model.attribute("/gdc/md/storybook/obj/2205").localIdentifier("a5"),
        ];

        const totals: VisualizationInput.ITotal[] = [
            {
                measureIdentifier: "m1",
                type: "min",
                attributeIdentifier: "a1",
            },
            {
                measureIdentifier: "m1",
                type: "sum",
                attributeIdentifier: "a2",
            },
            {
                measureIdentifier: "m1",
                type: "max",
                attributeIdentifier: "a2",
            },
            {
                measureIdentifier: "m1",
                type: "sum",
                attributeIdentifier: "a3",
            },
            {
                measureIdentifier: "m1",
                type: "max",
                attributeIdentifier: "a3",
            },
            {
                measureIdentifier: "m1",
                type: "avg",
                attributeIdentifier: "a5",
            },
        ];

        const tableCustomReadyResolver = () => {
            return (_element: HTMLElement) => {
                return (
                    // table has rows in loading state so its not possible use visualizationNotLoadingResolver
                    document.querySelectorAll(".screenshot-wrapper .s-pivot-table .s-loading-done").length > 0
                );
            };
        };

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={tableCustomReadyResolver()}>
                <div style={{ ...wrapperStyle, height: 230 }} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={measures}
                        rows={attributes}
                        totals={totals}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("subtotals - two measures, two row attributes", () => {
        const measures = [
            Model.measure("/gdc/md/storybook/obj/1144").localIdentifier("m1"),
            Model.measure("/gdc/md/storybook/obj/1145").localIdentifier("m2"),
        ];

        const attributes = [
            Model.attribute("/gdc/md/storybook/obj/1024").localIdentifier("a1"),
            Model.attribute("/gdc/md/storybook/obj/1027").localIdentifier("a2"),
        ];

        const totals: VisualizationInput.ITotal[] = [
            {
                measureIdentifier: "m1",
                type: "sum",
                attributeIdentifier: "a2",
            },
            {
                measureIdentifier: "m2",
                type: "max",
                attributeIdentifier: "a2",
            },
        ];

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={{ ...wrapperStyle }} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={measures}
                        rows={attributes}
                        totals={totals}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("grand total and subtotal - two measures, two row attributes", () => {
        const measures = [
            Model.measure("/gdc/md/storybook/obj/1144").localIdentifier("m1"),
            Model.measure("/gdc/md/storybook/obj/1145").localIdentifier("m2"),
        ];

        const attributes = [
            Model.attribute("/gdc/md/storybook/obj/1024").localIdentifier("a1"),
            Model.attribute("/gdc/md/storybook/obj/1027").localIdentifier("a2"),
        ];

        const totals: VisualizationInput.ITotal[] = [
            {
                measureIdentifier: "m1",
                type: "sum",
                attributeIdentifier: "a1",
            },
            {
                measureIdentifier: "m2",
                type: "sum",
                attributeIdentifier: "a2",
            },
        ];

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={{ ...wrapperStyle, height: 228 }} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={measures}
                        rows={attributes}
                        totals={totals}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    });
