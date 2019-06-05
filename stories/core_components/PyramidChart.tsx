// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { PyramidChart } from "../../src";
import { onErrorHandler } from "../mocks";

import {
    ATTRIBUTE_1,
    MEASURE_1,
    ATTRIBUTE_1_SORT_ITEM,
    MEASURE_2,
    ARITHMETIC_MEASURE_SIMPLE_OPERANDS,
    ARITHMETIC_MEASURE_USING_ARITHMETIC,
} from "../data/componentProps";

const wrapperStyle = { width: 800, height: 400 };

storiesOf("Core components/PyramidChart", module).add("basic render", () =>
    screenshotWrap(
        <div style={wrapperStyle}>
            <PyramidChart
                projectId="storybook"
                measures={[MEASURE_1]}
                viewBy={ATTRIBUTE_1}
                onError={onErrorHandler}
            />
        </div>,
    ),
);
