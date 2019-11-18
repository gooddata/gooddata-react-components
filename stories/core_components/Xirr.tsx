// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";

import { Xirr, Model } from "../../src/index";

const wrapperStyle = { width: 600, height: 300 };

storiesOf("Core components/Xirr", module).add("simple", () =>
    screenshotWrap(
        <div style={wrapperStyle}>
            <Xirr
                projectId="storybook"
                measure={Model.measure("/gdc/md/storybook/obj/5")
                    .localIdentifier("m_1")
                    .aggregation("sum")}
                attribute={Model.attribute("/gdc/md/storybook/obj/10").localIdentifier("a_1")}
                LoadingComponent={null}
                ErrorComponent={null}
            />
        </div>,
    ),
);
