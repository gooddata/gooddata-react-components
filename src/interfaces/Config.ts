// (C) 2007-2019 GoodData Corporation
import { ISeparators } from '@gooddata/numberjs';
import { VisualizationObject } from '@gooddata/typings';
import { IColorItem, IColor } from '@gooddata/gooddata-js';
import { PositionType } from '../components/visualizations/typings/legend';
import { VisType } from '../constants/visualizationTypes';
import { IDataLabelsConfig } from '../interfaces/Config';
import { IHeaderPredicate } from './HeaderPredicate';
import { IMappingHeader } from './MappingHeader';

export { DEFAULT_COLOR_PALETTE } from '../components/visualizations/utils/color';

// reexport types to ensure backward compatibility (see BB-1519)
export type IRGBColor = IColor;
export {
    GuidType,
    RGBType,
    IGuidColorItem,
    IRGBColorItem,
    IColorItem,
    IColorMappingProperty,
    IPropertiesControls,
    IProperties
} from '@gooddata/gooddata-js';

export type IDataLabelsVisible = string | boolean;

export interface IDataLabelsConfig {
    visible?: IDataLabelsVisible;
}

export interface IColorMapping { // sent to SDK
    predicate: IHeaderPredicate;
    color: IColorItem;
}

export interface IColorAssignment { // << send from SDK up
    headerItem: IMappingHeader;
    color: IColorItem;
}

export interface IColorPaletteItem {
    guid: string;
    fill: IColor;
}

export interface IColorPalette extends Array<IColorPaletteItem> {}

export interface ILegendConfig {
    enabled?: boolean;
    position?: PositionType;
    responsive?: boolean;
}

export interface IChartLimits {
    series?: number;
    categories?: number;
    dataPoints?: number;
}

export interface IMeasuresStackConfig {
    stackMeasures?: boolean;
    stackMeasuresToPercent?: boolean;
}

export interface IChartConfig extends IMeasuresStackConfig {
    colors?: string[];
    colorPalette?: IColorPalette;
    colorMapping?: IColorMapping[];
    type?: VisType;
    legend?: ILegendConfig;
    legendLayout?: string;
    limits?: IChartLimits;
    stacking?: boolean;
    grid?: any;
    mdObject?: VisualizationObject.IVisualizationObjectContent;
    yFormat?: string;
    yLabel?: string;
    xFormat?: string;
    xLabel?: string;
    chart?: any;
    xaxis?: IAxisConfig;
    yaxis?: IAxisConfig;
    secondary_xaxis?: IAxisConfig;
    secondary_yaxis?: IAxisConfig;
    separators?: ISeparators;
    dataLabels?: IDataLabelsConfig;
    dualAxis?: boolean;
    primaryChartType?: VisualizationObject.VisualizationType;
    secondaryChartType?: VisualizationObject.VisualizationType;
}

export interface IAxisConfig {
    visible?: boolean;
    labelsEnabled?: boolean;
    rotation?: string;
    min?: string;
    max?: string;
    measures?: string[];
}

export interface IAxis {
    label: string;
    format?: string;
    opposite?: boolean;
    seriesIndices?: number[];
}

export interface ISeriesDataItem {
    x?: number;
    y: number;
    value?: number;
    name?: string;
}

export interface ISeriesItem {
    name?: string;
    data?: ISeriesDataItem[];
    color?: string;
    userOptions?: any;
    visible?: boolean;
    type?: VisualizationObject.VisualizationType | string;
    isDrillable?: boolean;
    legendIndex?: number;
    yAxis?: number;
    zIndex?: number;
    labelKey?: string;
    stack?: number;
    stacking?: string;
}
