// (C) 2019-2020 GoodData Corporation
import { IntlShape } from "react-intl";
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");

import { IExtendedReferencePoint } from "../../interfaces/Visualization";
import { UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";
import { setBucketTitles } from "../bucketHelper";

import * as BucketNames from "../../../constants/bucketNames";
import * as geoPushPinLocationIcon from "../../assets/geoPushpin/bucket-title-location.svg";
import * as geoPushPinMeasuresSizeIcon from "../../assets/geoPushpin/bucket-title-size.svg";
import * as geoPushPinMeasuresColorIcon from "../../assets/geoPushpin/bucket-title-color.svg";
import * as geoPushPinSegmentIcon from "../../assets/geoPushpin/bucket-title-segment.svg";

export function setGeoPushpinUiConfig(
    referencePoint: IExtendedReferencePoint,
    intl: IntlShape,
    visualizationType: string,
): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);
    set(referencePointConfigured, UICONFIG, setBucketTitles(referencePoint, visualizationType, intl));
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.LOCATION, "icon"], geoPushPinLocationIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.SIZE, "icon"], geoPushPinMeasuresSizeIcon);
    set(
        referencePointConfigured,
        [UICONFIG, BUCKETS, BucketNames.COLOR, "icon"],
        geoPushPinMeasuresColorIcon,
    );
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.SEGMENT_BY, "icon"], geoPushPinSegmentIcon);

    return referencePointConfigured;
}
