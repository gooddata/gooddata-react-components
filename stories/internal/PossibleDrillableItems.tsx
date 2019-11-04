// (C) 2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { wrap } from "../utils/wrap";
import { Headline } from "../../src/components/Headline";
import "../../styles/scss/headline.scss";
import { MEASURE_1_WITH_ALIAS, MEASURE_1, MEASURE_2, ATTRIBUTE_1 } from "../data/componentProps";
import { PivotTable } from "../../src/components/PivotTable";
import { BarChart } from "../../src/components/BarChart";
import { IPushData } from "../../src/interfaces/PushData";

const pushData = (data: IPushData) => {
    if (data.possibleDrillableItems) {
        action("possibleDrillableItems")(data);
    }
};

storiesOf("Internal/PossibleDrillableItems", module)
    .add("Headline", () =>
        wrap(
            <Headline
                projectId="storybook"
                primaryMeasure={MEASURE_1_WITH_ALIAS}
                LoadingComponent={null}
                ErrorComponent={null}
                pushData={pushData}
            />,
            "auto",
            300,
        ),
    )
    .add("PivotTable", () =>
        wrap(
            <PivotTable
                projectId="storybook"
                measures={[MEASURE_1, MEASURE_2]}
                rows={[ATTRIBUTE_1]}
                pushData={pushData}
            />,
            300,
            600,
        ),
    )
    .add("Chart", () =>
        wrap(
            <BarChart
                projectId="storybook"
                measures={[MEASURE_2]}
                viewBy={[ATTRIBUTE_1]}
                pushData={pushData}
            />,
            300,
            600,
        ),
    );
