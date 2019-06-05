// (C) 2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");
import assign = require("lodash/assign");

import * as BucketNames from "../../../constants/bucketNames";
import { IExtendedReferencePoint } from "../../interfaces/Visualization";

import { disabledOpenAsReportConfig, UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";

import * as pyramidMeasuresIcon from "../../assets/funnel/bucket-title-measures.svg";
import * as pyramidViewIcon from "../../assets/funnel/bucket-title-view.svg";

export function setPyramidChartUiConfig(referencePoint: IExtendedReferencePoint): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);

    assign(referencePointConfigured[UICONFIG], disabledOpenAsReportConfig);

    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.MEASURES, "icon"], pyramidMeasuresIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.VIEW, "icon"], pyramidViewIcon);

    return referencePointConfigured;
}
