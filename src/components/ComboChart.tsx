// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import omit = require("lodash/omit");
import set = require("lodash/set");
import cloneDeep = require("lodash/cloneDeep");
import isArray = require("lodash/isArray");
import { VisualizationObject, VisualizationInput } from "@gooddata/typings";

import { Subtract } from "../typings/subtract";
import { ComboChart as AfmComboChart } from "./afm/ComboChart";
import { ICommonChartProps } from "./core/base/BaseChart";
import { convertBucketsToAFM, convertBucketsToMdObject } from "../helpers/conversion";
import { getResultSpec } from "../helpers/resultSpec";
import { MEASURES, SECONDARY_MEASURES, VIEW } from "../constants/bucketNames";
import { setMeasuresToSecondaryAxis } from "../helpers/dualAxis";
import { sanitizeConfig, sanitizeMeasures } from "../helpers/optionalStacking/common";

export interface IComboChartBucketProps {
    columnMeasures?: VisualizationInput.IMeasure[];
    lineMeasures?: VisualizationInput.IMeasure[];
    primaryMeasures?: VisualizationInput.IMeasure[];
    secondaryMeasures?: VisualizationInput.IMeasure[];
    viewBy?: VisualizationInput.IAttribute | VisualizationInput.IAttribute[];
    filters?: VisualizationObject.VisualizationObjectFilter[];
    sortBy?: VisualizationInput.ISort[];
}

export interface IComboChartProps extends ICommonChartProps, IComboChartBucketProps {
    projectId: string;
}

type IComboChartNonBucketProps = Subtract<IComboChartProps, IComboChartBucketProps>;

/**
 * [ComboChart](http://sdk.gooddata.com/gdc-ui-sdk-doc/docs/next/combo_chart_component.html)
 * is a component with bucket props primaryMeasures, secondaryMeasures, viewBy, filters
 */
export function ComboChart(props: IComboChartProps): JSX.Element {
    const clonedProps = cloneDeep(props);
    const { columnMeasures, lineMeasures, viewBy } = clonedProps;
    const isOldConfig = Boolean(columnMeasures || lineMeasures);
    const categories = isArray(viewBy) ? [viewBy[0]] : [viewBy];

    if (isOldConfig) {
        set(clonedProps, "primaryMeasures", columnMeasures);
        set(clonedProps, "secondaryMeasures", lineMeasures);
        set(clonedProps, "config.dualAxis", false);

        // tslint:disable-next-line:no-console
        console.warn(
            "Props columnMeasures and lineMeasures are deprecated. Please migrate to props primaryMeasures and secondaryMeasures.",
        );
    }

    const { primaryMeasures = [], secondaryMeasures = [] } = clonedProps;

    const buckets: VisualizationObject.IBucket[] = [
        {
            localIdentifier: MEASURES,
            items: sanitizeMeasures(primaryMeasures),
        },
        {
            localIdentifier: SECONDARY_MEASURES,
            items: sanitizeMeasures(secondaryMeasures),
        },
        {
            localIdentifier: VIEW,
            items: categories,
        },
    ];

    const newProps: IComboChartNonBucketProps = omit<IComboChartProps, keyof IComboChartBucketProps>(
        clonedProps,
        [
            "primaryMeasures",
            "secondaryMeasures",
            "columnMeasures",
            "lineMeasures",
            "viewBy",
            "filters",
            "sortBy",
        ],
    );
    const sanitizedConfig = sanitizeConfig(buckets, {
        ...setMeasuresToSecondaryAxis(secondaryMeasures, newProps.config),
        mdObject: convertBucketsToMdObject(buckets, props.filters, "local:combo"),
    });

    return (
        <AfmComboChart
            {...newProps}
            config={sanitizedConfig}
            projectId={props.projectId}
            afm={convertBucketsToAFM(buckets, props.filters)}
            resultSpec={getResultSpec(buckets, props.sortBy)}
        />
    );
}
