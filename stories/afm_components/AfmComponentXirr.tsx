// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Xirr } from "../../src/components/afm/Xirr";
import "../../styles/css/headline.css";

const wrapperStyle = { width: 600, height: 300 };

storiesOf("AFM components/Xirr", module).add("simple", () =>
    screenshotWrap(
        <div style={wrapperStyle}>
            <Xirr
                projectId="storybook"
                afm={{
                    attributes: [
                        {
                            displayForm: {
                                uri: "/gdc/md/storybook/obj/10",
                            },
                            localIdentifier: "a_1",
                        },
                    ],
                    measures: [
                        {
                            definition: {
                                measure: {
                                    aggregation: "sum",
                                    item: {
                                        uri: "/gdc/md/storybook/obj/5",
                                    },
                                },
                            },
                            localIdentifier: "m_1",
                        },
                    ],
                }}
                LoadingComponent={null}
                ErrorComponent={null}
            />
        </div>,
    ),
);
