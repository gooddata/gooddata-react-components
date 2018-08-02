// (C) 2007-2018 GoodData Corporation
import flatMap = require('lodash/flatMap');
import { VisualizationTypes } from '../../../../../constants/visualizationTypes';
import {
    getChartType,
    getVisibleSeries,
    isStacked,
    getDataLabelAttributes,
    getShapeAttributes
} from '../helpers';

import { parseRGBColorCode } from '../../../utils/color';

const setWhiteColor = (point: any) => {
    point.dataLabel.element.childNodes[0].style.fill = '#fff';
    point.dataLabel.element.childNodes[0].style['text-shadow'] = 'rgb(0, 0, 0) 0px 0px 1px';
};

const setBlackColor = (point: any) => {
    point.dataLabel.element.childNodes[0].style.fill = '#000';
    point.dataLabel.element.childNodes[0].style['text-shadow'] = 'none';
};

function getVisiblePointsWithLabel(chart: any) {
    return flatMap(getVisibleSeries(chart), (series: any) => series.points)
        .filter((point: any) => (point.dataLabel && point.graphic));
}

function setLabelsColor(chart: any) {
    const points = getVisiblePointsWithLabel(chart);

    return points.forEach((point: any) => {
        const labelDimensions = getDataLabelAttributes(point);
        const barDimensions = getShapeAttributes(point);
        const barRight = barDimensions.x + barDimensions.width;
        const labelLeft = labelDimensions.x;

        if (labelLeft < barRight) {
            setWhiteColor(point);
        } else {
            setBlackColor(point);
        }
    });
}

export function isWhiteNotContrastEnough(color: string) {
    // to keep first 17 colors from our default palette with white labels
    const HIGHCHARTS_CONTRAST_THRESHOLD = 530;

    const { R, G, B } = parseRGBColorCode(color);
    const lightnessHCH = R + G + B;

    return lightnessHCH > HIGHCHARTS_CONTRAST_THRESHOLD;
}

function setContrastLabelsColor(chart: any) {
    const points = getVisiblePointsWithLabel(chart);

    return points.forEach((point: any) => {
        if (isWhiteNotContrastEnough(point.color)) {
            setBlackColor(point);
        } else {
            setWhiteColor(point);
        }
    });
}

export function extendDataLabelColors(Highcharts: any) {
    Highcharts.Chart.prototype.callbacks.push((chart: any) => {
        const type = getChartType(chart);

        const changeLabelColor = () => {
            if (type === VisualizationTypes.BAR && !isStacked(chart)) {
                setTimeout(() => {
                    setLabelsColor(chart);
                }, 500);
            }
            if (type === VisualizationTypes.TREEMAP) {
                setContrastLabelsColor(chart);
            }
        };

        changeLabelColor();
        Highcharts.addEvent(chart, 'redraw', changeLabelColor);
    });
}
