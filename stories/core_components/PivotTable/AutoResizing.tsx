// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Model, PivotTable } from "../../../src";
import { onErrorHandler } from "../../mocks";
import { ATTRIBUTE_1, ATTRIBUTE_COUNTRY, MEASURE_1, MEASURE_2 } from "../../data/componentProps";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../../utils/ScreenshotReadyWrapper";
import { VisualizationInput } from "@gooddata/typings";

const wrapperStyle = { width: 1200, height: 300 };

storiesOf("Core components/PivotTable/AutoResizing", module)
    .add("auto resize columns in the viewport - simple table", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{ columnSizing: { defaultWidth: "viewport" } }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("auto resize columns in the viewport - with grand total and subtotal", () => {
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
                        config={{ columnSizing: { defaultWidth: "viewport" } }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("auto resize columns works with small pageSize", () => {
        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={{ ...wrapperStyle, height: 600 }} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1]}
                        rows={[ATTRIBUTE_COUNTRY]}
                        config={{ columnSizing: { defaultWidth: "viewport" } }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                        pageSize={5}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    });
