// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { BulletChart } from "../../src/components/afm/BulletChart";
import { AFM_ONE_MEASURE_TWO_ATTRIBUTES } from "../data/afmComponentProps";
import { onErrorHandler } from "../mocks";
import "../../styles/css/charts.css";

const wrapperStyle = { width: 800, height: 400 };

storiesOf("AFM components/BulletChart", module).add("Primary measure and two attributes", () =>
    screenshotWrap(
        <div style={wrapperStyle}>
            <BulletChart
                projectId="storybook"
                afm={AFM_ONE_MEASURE_TWO_ATTRIBUTES}
                onError={onErrorHandler}
                LoadingComponent={null}
                ErrorComponent={null}
            />
        </div>,
    ),
);
