// (C) 2020 GoodData Corporation
import * as React from "react";
import * as invariant from "invariant";

import { IGeoData, IPushpinCategoryLegendItem, IValidationResult } from "../../../interfaces/GeoChart";
import { DEFAULT_DATA_POINTS_LIMIT, EMPTY_SEGMENT_ITEM } from "../../../constants/geoChart";
import { IColorAssignment, IColorPalette } from "../../../interfaces/Config";
import { isDataOfReasonableSize } from "../../../helpers/geoChart/common";
import { getGeoBucketsFromMdObject, getGeoData } from "../../../helpers/geoChart/data";
import { getValidColorPalette } from "../../visualizations/utils/color";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import { getColorStrategy } from "../../../helpers/geoChart/colorStrategy";
import { isMappingHeaderAttributeItem } from "../../../interfaces/MappingHeader";
import { BaseVisualization } from "../base/BaseVisualization";
import { GeoChartInner, IGeoChartInnerOptions, IGeoChartInnerProps } from "./GeoChartInner";

export class GeoChartOptionsWrapper extends BaseVisualization<IGeoChartInnerProps, null> {
    public static defaultProps: Partial<IGeoChartInnerProps> = GeoChartInner.defaultProps;

    public renderVisualization(): JSX.Element {
        const {
            config: { mdObject },
            execution,
            onDataTooLarge,
        } = this.props;
        const buckets = getGeoBucketsFromMdObject(mdObject);
        const geoData: IGeoData = getGeoData(buckets, execution);
        const { isDataTooLarge } = this.validateData(geoData);

        if (isDataTooLarge) {
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            onDataTooLarge();
            return null;
        }

        const geoChartOptions: IGeoChartInnerOptions = this.buildGeoChartOptions(geoData);
        return <GeoChartInner {...this.props} geoChartOptions={geoChartOptions} />;
    }

    private buildGeoChartOptions = (geoData: Readonly<IGeoData>): IGeoChartInnerOptions => {
        const { segment } = geoData;
        const {
            config: { colors, colorPalette, colorMapping },
            dataSource,
            execution,
        } = this.props;
        const palette: IColorPalette = getValidColorPalette(colors, colorPalette);
        const colorStrategy: IColorStrategy = getColorStrategy(
            palette,
            colorMapping,
            geoData,
            execution,
            dataSource.getAfm(),
        );

        let categoryItems: IPushpinCategoryLegendItem[] = [];
        if (segment) {
            categoryItems = this.getCategoryLegendItems(colorStrategy);
        }

        return {
            geoData,
            categoryItems,
            colorStrategy,
            colorPalette: palette,
        };
    };

    private getCategoryLegendItems(colorStrategy: IColorStrategy): IPushpinCategoryLegendItem[] {
        const colorAssignment: IColorAssignment[] = colorStrategy.getColorAssignment();
        return colorAssignment.map(
            (item: IColorAssignment, legendIndex: number): IPushpinCategoryLegendItem => {
                const name: string = isMappingHeaderAttributeItem(item.headerItem)
                    ? item.headerItem.attributeHeaderItem.name
                    : EMPTY_SEGMENT_ITEM;
                const color: string = colorStrategy.getColorByIndex(legendIndex);
                return {
                    name,
                    legendIndex,
                    color,
                    isVisible: true,
                };
            },
        );
    }

    private validateData = (geoData: IGeoData): IValidationResult => {
        if (!this.props.execution) {
            return;
        }
        const {
            config: { limit = DEFAULT_DATA_POINTS_LIMIT },
            execution: { executionResult },
        } = this.props;

        return {
            isDataTooLarge: !isDataOfReasonableSize(executionResult, geoData, limit),
        };
    };
}
