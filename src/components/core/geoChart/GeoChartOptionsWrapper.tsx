// (C) 2020 GoodData Corporation
import * as React from "react";
import * as invariant from "invariant";

import { IGeoData, IPushpinCategoryLegendItem, IValidationResult } from "../../../interfaces/GeoChart";
import { DEFAULT_DATA_POINTS_LIMIT } from "../../../constants/geoChart";
import { IColorAssignment, IColorPalette } from "../../../interfaces/Config";
import { isDataOfReasonableSize } from "../../../helpers/geoChart/common";
import { getGeoBucketsFromMdObject, getGeoData } from "../../../helpers/geoChart/data";
import { getValidColorPalette } from "../../visualizations/utils/color";
import { IColorStrategy } from "../../visualizations/chart/colorFactory";
import { getColorStrategy } from "../../../helpers/geoChart/colorStrategy";
import { isMappingHeaderAttributeItem } from "../../../interfaces/MappingHeader";
import { BaseVisualization } from "../base/BaseVisualization";
import { GeoChartInner, IGeoChartInnerOptions, IGeoChartInnerProps } from "./GeoChartInner";
import { fixEmptyHeaderItems } from "../base/utils/fixEmptyHeaderItems";

export class GeoChartOptionsWrapper extends BaseVisualization<IGeoChartInnerProps, null> {
    public static defaultProps: Partial<IGeoChartInnerProps> = GeoChartInner.defaultProps;
    private emptyHeaderString: string;

    constructor(props: IGeoChartInnerProps) {
        super(props);
        this.emptyHeaderString = this.getEmptyHeaderString();
    }

    public renderVisualization(): JSX.Element {
        const sanitizedProps: IGeoChartInnerProps = this.sanitizeProperties();

        const {
            config: { mdObject },
            execution,
            onDataTooLarge,
        } = sanitizedProps;

        const buckets = getGeoBucketsFromMdObject(mdObject);
        const geoData: IGeoData = getGeoData(buckets, execution);
        const { isDataTooLarge } = this.validateData(geoData, sanitizedProps);

        if (isDataTooLarge) {
            invariant(onDataTooLarge, "GeoChart's onDataTooLarge callback is missing.");
            onDataTooLarge();
            return null;
        }

        const geoChartOptions: IGeoChartInnerOptions = this.buildGeoChartOptions(geoData, sanitizedProps);
        return <GeoChartInner {...sanitizedProps} geoChartOptions={geoChartOptions} />;
    }

    private buildGeoChartOptions = (
        geoData: Readonly<IGeoData>,
        props: IGeoChartInnerProps,
    ): IGeoChartInnerOptions => {
        const { segment } = geoData;
        const {
            config: { colors, colorPalette, colorMapping },
            dataSource,
            execution,
        } = props;
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
                const { name, uri } = isMappingHeaderAttributeItem(item.headerItem)
                    ? item.headerItem.attributeHeaderItem
                    : { name: this.emptyHeaderString, uri: this.emptyHeaderString };
                const color: string = colorStrategy.getColorByIndex(legendIndex);
                return {
                    uri,
                    name,
                    color,
                    legendIndex,
                    isVisible: true,
                };
            },
        );
    }

    private validateData = (geoData: IGeoData, props: IGeoChartInnerProps): IValidationResult => {
        if (!props.execution) {
            return;
        }
        const {
            config: { limit = DEFAULT_DATA_POINTS_LIMIT },
            execution: { executionResult },
        } = props;

        return {
            isDataTooLarge: !isDataOfReasonableSize(executionResult, geoData, limit),
        };
    };

    private sanitizeProperties(): IGeoChartInnerProps {
        const {
            execution: { executionResult, executionResponse },
        } = this.props;
        const executionResultWithResolvedEmptyValues = fixEmptyHeaderItems(
            executionResult,
            this.emptyHeaderString,
        );
        return {
            ...this.props,
            execution: {
                executionResponse,
                executionResult: executionResultWithResolvedEmptyValues,
            },
        };
    }

    private getEmptyHeaderString(): string {
        return `(${this.props.intl.formatMessage({ id: "visualization.emptyValue" })})`;
    }
}
