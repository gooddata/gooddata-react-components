// (C) 2020 GoodData Corporation
import * as React from "react";
import without = require("lodash/without");
import { Execution } from "@gooddata/typings";
import { stringToFloat } from "../../../helpers/utils";
import { IntlWrapper } from "../../core/base/IntlWrapper";
import { IntlTranslationsProvider, ITranslationsComponentProps } from "../../core/base/TranslationsProvider";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import { getGeoData, getFormatFromExecutionResponse } from "../../../helpers/geoChart";
import { IGeoConfig, IGeoData } from "../../../interfaces/GeoChart";
import { TOP } from "../../visualizations/chart/legend/PositionTypes";
import { isTwoDimensionsData } from "../../../helpers/executionResultHelper";

export interface IGeoChartLegendRendererProps {
    config: IGeoConfig;
    execution: Execution.IExecutionResponses;
    locale: string;
    position?: string;
}
export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    if (!props.execution) {
        return null;
    }
    const {
        execution: { executionResult, executionResponse },
        config: { mdObject: { buckets = [] } = {} },
        locale,
        position = TOP,
    } = props;
    const geoData: IGeoData = getGeoData(buckets, executionResponse.dimensions);
    const { data } = executionResult;
    const { size } = geoData;
    const classes = `geo-legend s-geo-legend position-${position}`;

    if (!size || !isTwoDimensionsData(data)) {
        return null;
    }
    return (
        <div className={classes}>
            {size &&
                renderPushpinSizeLegend(
                    data[size.index].map(stringToFloat),
                    getFormatFromExecutionResponse(size.index, executionResponse),
                    locale,
                )}
        </div>
    );
}

function renderPushpinSizeLegend(sizeValues: number[], format: string, locale: string): JSX.Element {
    const values: number[] = without(sizeValues, null, undefined, NaN);
    return (
        <IntlWrapper locale={locale}>
            <IntlTranslationsProvider>
                {(props: ITranslationsComponentProps) => (
                    <PushpinSizeLegend numericSymbols={props.numericSymbols} format={format} sizes={values} />
                )}
            </IntlTranslationsProvider>
        </IntlWrapper>
    );
}
