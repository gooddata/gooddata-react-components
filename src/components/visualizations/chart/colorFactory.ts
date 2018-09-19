import { AFM, Execution } from '@gooddata/typings';
import { DEFAULT_COLOR_PALETTE, HEATMAP_BLUE_COLOR_PALETTE, getLighterColor } from '../utils/color';
import {
    isDerivedMeasure,
    findParentMeasureIndex,
    normalizeColorToRGB,
    isAttributeColorPalette
} from './chartOptionsBuilder';

import range = require('lodash/range');

export type HighChartColorPalette = string[];
export type ColorPalette = string[];
export type MeasureGroupType = Execution.IMeasureGroupHeader['measureGroupHeader'];

import {
    isHeatmap,
    isTreemap
} from '../utils/common';

export class ColorFactory {
    public static getColorStrategy(
        colorPalette: ColorPalette = DEFAULT_COLOR_PALETTE,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm,
        type: string
    ): IColorStrategy {

        if (isHeatmap(type)) {
            return new HeatMapColorStrategy(
                colorPalette,
                measureGroup,
                viewByAttribute,
                stackByAttribute,
                afm);
        }

        if (isTreemap(type)) {
            return new TreeMapColorStrategy(
                colorPalette,
                measureGroup,
                viewByAttribute,
                stackByAttribute,
                afm);
        }

        if (isAttributeColorPalette(type, afm, stackByAttribute)) {
            return new AttributeColorStrategy(
                colorPalette,
                measureGroup,
                viewByAttribute,
                stackByAttribute,
                afm);
        }

        return new MetricColorStrategy(
            colorPalette,
            measureGroup,
            viewByAttribute,
            stackByAttribute,
            afm);
    }
}

export interface IColorStrategy {
    getColorByIndex(index: number): string;
    getColorPalette(): string[];
}

export abstract class ColorStrategy implements IColorStrategy {
    protected palette: HighChartColorPalette;
    // may be use blanc constructor and this move to Init function
    // it will be fine because than we could create proper interface for color strategy that cover also creation of item
    // also hide items from constructor/init into private class members to simplify other methods
    constructor(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ) {
        this.palette = this.createPalette(
            colorPalette,
            measureGroup,
            viewByAttribute,
            stackByAttribute,
            afm);
    }

    public getColorByIndex(index: number): string {
        return this.palette[index];
    }

    public getColorPalette(): string[] {
        return this.palette;
    }

    protected abstract createPalette(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ): HighChartColorPalette;
}

export class MetricColorStrategy extends ColorStrategy {
    constructor(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ) {
        super(colorPalette, measureGroup, viewByAttribute, stackByAttribute, afm);
    }

    protected createPalette(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        _viewByAttribute: any,
        _stackByAttribute: any,
        afm: AFM.IAfm
    ): HighChartColorPalette {
        let parentMeasuresCounter = 0;

        const paletteMeasures = range(measureGroup.items.length).map((measureItemIndex) => {
            if (isDerivedMeasure(measureGroup.items[measureItemIndex], afm)) {
                return '';
            }
            const colorIndex = parentMeasuresCounter % colorPalette.length;
            parentMeasuresCounter++;
            return colorPalette[colorIndex];
        });

        return paletteMeasures.map((color, measureItemIndex) => {
            if (!isDerivedMeasure(measureGroup.items[measureItemIndex], afm)) {
                return color;
            }
            const parentMeasureIndex = findParentMeasureIndex(afm, measureItemIndex);
            if (parentMeasureIndex > -1) {
                const sourceMeasureColor = paletteMeasures[parentMeasureIndex];
                return getLighterColor(normalizeColorToRGB(sourceMeasureColor), 0.6);
            }
            return color;

        });
    }
}

export class AttributeColorStrategy extends ColorStrategy {
    constructor(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ) {
        super(colorPalette, measureGroup, viewByAttribute, stackByAttribute, afm);
    }

    protected createPalette(
        colorPalette: ColorPalette,
        _measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        _afm: AFM.IAfm
    ): HighChartColorPalette {
        const itemsCount = stackByAttribute ? stackByAttribute.items.length : viewByAttribute.items.length;
        return range(itemsCount).map(itemIndex => colorPalette[itemIndex % colorPalette.length]);
    }
}

export class HeatMapColorStrategy extends ColorStrategy {
    constructor(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ) {
        super(colorPalette, measureGroup, viewByAttribute, stackByAttribute, afm);
    }

    protected createPalette(
        _colorPalette: ColorPalette,
        _measureGroup: MeasureGroupType,
        _viewByAttribute: any,
        _stackByAttribute: any,
        _afm: AFM.IAfm
    ): HighChartColorPalette {
        return HEATMAP_BLUE_COLOR_PALETTE;
    }
}

export class TreeMapColorStrategy extends MetricColorStrategy {

    constructor(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ) {
        super(colorPalette, measureGroup, viewByAttribute, stackByAttribute, afm);
    }

    protected createPalette(
        colorPalette: ColorPalette,
        measureGroup: MeasureGroupType,
        viewByAttribute: any,
        stackByAttribute: any,
        afm: AFM.IAfm
    ): HighChartColorPalette {
        if (viewByAttribute) {
            const itemsCount = viewByAttribute.items.length;
            return range(itemsCount).map(itemIndex => colorPalette[itemIndex % colorPalette.length]);
        }
        return super.createPalette(
            colorPalette,
            measureGroup,
            viewByAttribute,
            stackByAttribute,
            afm
        );
    }
}
