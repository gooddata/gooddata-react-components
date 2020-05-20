// (C) 2020 GoodData Corporation
import * as React from "react";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";
import cx from "classnames";

import { generateLegendColorData } from "./geoChartColor";
import PushpinCategoryLegend, { HEIGHT_OF_SIZE_LEGEND } from "./legends/PushpinCategoryLegend";
import PushpinSizeLegend from "./legends/PushpinSizeLegend";
import { ColorLegend } from "../../visualizations/chart/legend/ColorLegend";
import Paging from "../../visualizations/chart/legend/Paging";
import { BOTTOM, LEFT, RIGHT } from "../../visualizations/chart/legend/PositionTypes";
import { PositionType } from "../../visualizations/typings/legend";
import { IAvailableLegends, IGeoData, IPushpinCategoryLegendItem } from "../../../interfaces/GeoChart";
import { isFluidLegendEnabled } from "../../../helpers/geoChart/common";
import { getAvailableLegends } from "../../../helpers/geoChart/data";

const HEIGHT_OF_COLOR_LEGEND = 210;

export interface IGeoChartLegendRendererProps {
    categoryItems?: IPushpinCategoryLegendItem[]; // used for Category legend
    format?: string;
    geoData?: IGeoData; // used for Color/Size legend
    height?: number;
    locale?: string;
    colorLegendValue: string;
    position?: PositionType;
    responsive?: boolean;
    showFluidLegend?: boolean;
    numericSymbols?: string[];
    onItemClick?: (item: IPushpinCategoryLegendItem) => void;
}

function getClassnames(props: IGeoChartLegendRendererProps, availableLegends: IAvailableLegends): string {
    const { position, responsive, showFluidLegend } = props;
    const { hasSizeLegend } = availableLegends;

    const isFluidLegend = isFluidLegendEnabled(responsive, showFluidLegend);
    const isBottomPosition = isFluidLegend || position === BOTTOM;

    return cx("geo-legend", "s-geo-legend", "viz-legend", {
        "viz-fluid-legend-wrap": isFluidLegend,
        "viz-static-legend-wrap": !isFluidLegend,
        static: !isFluidLegend,
        "has-size-legend": hasSizeLegend,
        [`position-${position}`]: !isBottomPosition,
        // this is required in case
        // position is not BOTTOM but isFluidLegend is true
        "position-bottom": isBottomPosition,
    });
}

export default function GeoChartLegendRenderer(props: IGeoChartLegendRendererProps): JSX.Element {
    const { categoryItems, geoData, height, position, numericSymbols } = props;

    const availableLegends: IAvailableLegends = getAvailableLegends(categoryItems, geoData);
    const { hasCategoryLegend, hasColorLegend, hasSizeLegend } = availableLegends;
    const isLegendVisible = hasCategoryLegend || hasColorLegend || hasSizeLegend;
    if (!isLegendVisible) {
        return null;
    }

    if (hasCategoryLegend) {
        return renderCategoryAndSizeLegend(props, availableLegends);
    }

    if (hasColorLegend && hasSizeLegend && shouldShowPagingLegend(height, position)) {
        return (
            <ColorAndSizeLegendWithPaging
                {...props}
                numericSymbols={numericSymbols}
                availableLegends={availableLegends}
            />
        );
    }

    return renderColorAndSizeLegend(props, availableLegends);
}

function renderCategoryAndSizeLegend(
    props: IGeoChartLegendRendererProps,
    availableLegends: IAvailableLegends,
): JSX.Element {
    const { hasSizeLegend } = availableLegends;
    const classNames = getClassnames(props, availableLegends);

    return (
        <Measure client={true}>
            {({ measureRef, contentRect }: MeasuredComponentProps) => {
                return (
                    <div className={classNames} ref={measureRef}>
                        {renderPushpinCategoryLegend(props, contentRect, hasSizeLegend)}
                        {renderPushpinSizeLegend(props, hasSizeLegend)}
                    </div>
                );
            }}
        </Measure>
    );
}

// if height of color + size is bigger than container, we will show paging for legends
function shouldShowPagingLegend(height: number, legendPosition: PositionType): boolean {
    if (height !== undefined && (legendPosition === LEFT || legendPosition === RIGHT)) {
        const heightOfColorAndSizeLegend = HEIGHT_OF_COLOR_LEGEND + HEIGHT_OF_SIZE_LEGEND;
        return height < heightOfColorAndSizeLegend;
    }
    return false;
}

interface IColorAndSizeLegendWithPagingProps extends IGeoChartLegendRendererProps {
    availableLegends: IAvailableLegends;
    numericSymbols: string[];
}

function ColorAndSizeLegendWithPaging(props: IColorAndSizeLegendWithPagingProps): React.ReactElement {
    const [page, setPage] = React.useState<number>(1);

    const showNextPage = (): void => setPage(2);
    const showPrevPage = (): void => setPage(1);

    const { availableLegends } = props;
    const classNames = getClassnames(props, availableLegends);
    return (
        <div className={classNames}>
            <div className="geo-legend-paging">
                {renderPushpinColorLegend(props, page === 1)}
                {renderPushpinSizeLegend(props, page === 2)}
            </div>
            <Paging page={page} pagesCount={2} showNextPage={showNextPage} showPrevPage={showPrevPage} />
        </div>
    );
}

function renderColorAndSizeLegend(
    props: IGeoChartLegendRendererProps,
    availableLegends: IAvailableLegends,
): JSX.Element {
    const { hasColorLegend, hasSizeLegend } = availableLegends;
    const classNames = getClassnames(props, availableLegends);

    return (
        <div className={classNames}>
            {renderPushpinColorLegend(props, hasColorLegend)}
            {renderPushpinSizeLegend(props, hasSizeLegend)}
        </div>
    );
}

function renderPushpinColorLegend(props: IGeoChartLegendRendererProps, hasColorLegend: boolean): JSX.Element {
    if (!hasColorLegend) {
        return null;
    }

    const {
        geoData: {
            color: { data, format },
        },
        position,
        responsive,
        showFluidLegend,
        colorLegendValue,
        numericSymbols,
    } = props;

    const dataWithoutNull = data.filter(isFinite);
    const colorData = generateLegendColorData(dataWithoutNull, colorLegendValue);
    const isSmall: boolean = responsive && showFluidLegend;

    return (
        <ColorLegend
            data={colorData}
            format={format}
            isSmall={isSmall}
            numericSymbols={numericSymbols}
            position={position}
        />
    );
}

function renderPushpinCategoryLegend(
    props: IGeoChartLegendRendererProps,
    contentRect: ContentRect,
    hasSizeLegend: boolean,
): JSX.Element {
    return <PushpinCategoryLegend {...props} contentRect={contentRect} hasSizeLegend={hasSizeLegend} />;
}

function renderPushpinSizeLegend(props: IGeoChartLegendRendererProps, hasSizeLegend: boolean): JSX.Element {
    if (!hasSizeLegend) {
        return null;
    }

    const {
        geoData: {
            size: { data, format, name },
        },
        numericSymbols,
    } = props;

    return (
        <PushpinSizeLegend format={format} measureName={name} numericSymbols={numericSymbols} sizes={data} />
    );
}
