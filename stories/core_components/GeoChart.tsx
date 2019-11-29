// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { GeoChart } from "../../src";
import { onErrorHandler } from "../mocks";
import { ATTRIBUTE_1, MEASURE_1, MEASURE_2 } from "../data/componentProps";

const wrapperStyle = { width: 1200, height: 300 };

storiesOf("Core components/GeoChart", module).add("two measures, one attribute", () =>
    screenshotWrap(
        <div style={wrapperStyle} className="s-table">
            <GeoChart
                projectId="storybook"
                measures={[MEASURE_1, MEASURE_2]}
                rows={[ATTRIBUTE_1]}
                onError={onErrorHandler}
                LoadingComponent={null}
                ErrorComponent={null}
            />
        </div>,
    ),
);
