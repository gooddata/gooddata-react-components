// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Model, PivotTable } from "../../../src";
import { onErrorHandler } from "../../mocks";
import { ATTRIBUTE_1, MEASURE_1, MEASURE_2 } from "../../data/componentProps";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../../utils/ScreenshotReadyWrapper";
import { VisualizationInput } from "@gooddata/typings";

const wrapperStyle = { width: 1200, height: 300 };

storiesOf("Core components/PivotTable/GrowToFit", module)
    .add("columns grow to fit viewport - simple table", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                growToFit: true,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("columns grow to fit viewport not applied when viewport is small - simple table", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={{ ...wrapperStyle, width: 500 }} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                growToFit: true,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("columns grow to fit viewport - with grand total and subtotal", () => {
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
                        config={{
                            columnSizing: {
                                growToFit: true,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add(
        "auto resize columns growToFit viewport not applied when viewport is small after auto resize - simple table",
        () =>
            screenshotWrap(
                <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                    <div style={{ ...wrapperStyle, width: 250 }} className="s-table">
                        <PivotTable
                            projectId="storybook"
                            measures={[MEASURE_1, MEASURE_2]}
                            rows={[ATTRIBUTE_1]}
                            config={{
                                columnSizing: {
                                    defaultWidth: "viewport",
                                    growToFit: true,
                                },
                            }}
                            onError={onErrorHandler}
                            LoadingComponent={null}
                            ErrorComponent={null}
                        />
                    </div>
                </ScreenshotReadyWrapper>,
            ),
    )
    .add("auto resize columns and growToFit viewport - simple table", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: true,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    );
