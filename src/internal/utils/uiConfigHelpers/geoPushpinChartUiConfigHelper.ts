// (C) 2019-2020 GoodData Corporation
import { IntlShape } from "react-intl";
import cloneDeep = require("lodash/cloneDeep");
import set = require("lodash/set");

import { IExtendedReferencePoint } from "../../interfaces/Visualization";
import { UICONFIG } from "../../constants/uiConfig";
import { BUCKETS } from "../../constants/bucket";
import { setBucketTitles } from "../bucketHelper";

import * as BucketNames from "../../../constants/bucketNames";
import * as geoPushPinBucketLocationIcon from "../../assets/geoPushpin/bucket-title-location-icon.svg";
import * as geoPushPinBucketSizeIcon from "../../assets/geoPushpin/bucket-title-size-icon.svg";
import * as geoPushPinBucketColorIcon from "../../assets/geoPushpin/bucket-title-color-icon.svg";
import * as geoPushPinBucketSegmentIcon from "../../assets/geoPushpin/bucket-title-segment-icon.svg";

export function setGeoPushpinUiConfig(
    referencePoint: IExtendedReferencePoint,
    intl: IntlShape,
    visualizationType: string,
): IExtendedReferencePoint {
    const referencePointConfigured = cloneDeep(referencePoint);
    set(referencePointConfigured, UICONFIG, setBucketTitles(referencePoint, visualizationType, intl));
    set(
        referencePointConfigured,
        [UICONFIG, BUCKETS, BucketNames.LOCATION, "icon"],
        geoPushPinBucketLocationIcon,
    );
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.SIZE, "icon"], geoPushPinBucketSizeIcon);
    set(referencePointConfigured, [UICONFIG, BUCKETS, BucketNames.COLOR, "icon"], geoPushPinBucketColorIcon);
    set(
        referencePointConfigured,
        [UICONFIG, BUCKETS, BucketNames.SEGMENT, "icon"],
        geoPushPinBucketSegmentIcon,
    );

    return referencePointConfigured;
}
