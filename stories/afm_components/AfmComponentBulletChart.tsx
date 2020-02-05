// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { BulletChart } from "../../src/components/afm/BulletChart";
import {
    AFM_ONE_MEASURE_ONE_ATTRIBUTE,
    AFM_THREE_MEASURES_ONE_ATTRIBUTE,
    AFM_TWO_MEASURES_ONE_ATTRIBUTE,
} from "../data/afmComponentProps";
import { onErrorHandler } from "../mocks";
import "../../styles/css/charts.css";

const wrapperStyle = { width: 800, height: 400 };

storiesOf("AFM components/BulletChart", module)
    .add("Primary measure viewed by one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    afm={AFM_ONE_MEASURE_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("Primary and target measures viewed by one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    afm={AFM_TWO_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    )
    .add("Primary, target and comparative measures viewed by one attribute", () =>
        screenshotWrap(
            <div style={wrapperStyle}>
                <BulletChart
                    projectId="storybook"
                    afm={AFM_THREE_MEASURES_ONE_ATTRIBUTE}
                    onError={onErrorHandler}
                    LoadingComponent={null}
                    ErrorComponent={null}
                />
            </div>,
        ),
    );
