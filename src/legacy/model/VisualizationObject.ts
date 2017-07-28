export type SortDirection = 'asc' | 'desc';

export type EmbeddedFilter = IEmbeddedDateFilter | IEmbeddedListAttributeFilter;

export type EmbeddedDateFilterType = 'relative' | 'absolute';

export interface IEmbeddedDateFilter {
    dateFilter: {
        type: EmbeddedDateFilterType;
        from?: string | number;
        to?: string | number;
        granularity: string;
        attribute?: string;
        dataset?: string;
        dimension?: string;
    };
}

export interface IEmbeddedListAttributeFilter {
    listAttributeFilter: {
        attribute: string;
        displayForm: string;
        'default': {
            negativeSelection: boolean;
            attributeElements: string[];
        }
    };
}

export interface IMeasureSort {
    direction: SortDirection;
    sortByPoP: boolean;
}
export type VisualizationStyleType = 'common' | 'table' | 'line' | 'column' | 'bar';

export interface IVisualizationStyle {
    visualizationStyle: {
        type: VisualizationStyleType;
        colorPalette: {
            measure?: {
                color: string;
                periodOverPeriod: string;
            }

            stack?: any
        }
    };
}

export type MeasureType = 'metric' | 'fact' | 'attribute';
export type MeasureAggregation = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'runsum';

export interface IMeasure {
    measure: {
        type: MeasureType;
        aggregation?: MeasureAggregation;
        objectUri: string;
        showInPercent: boolean;
        showPoP: boolean;
        title: string;
        measureFilters: IEmbeddedListAttributeFilter[];
        format?: string;
        sort?: IMeasureSort;
        styles?: IVisualizationStyle[];
        generatedId?: string
    };
}

export type CategoryType = 'attribute' | 'date';

export interface ICategory {
    category: {
        type: CategoryType;
        collection: CategoryCollection;
        displayForm: string;
        attribute?: string;
        sort?: SortDirection;
        styles?: IVisualizationStyle[];
    };
}

export type CategoryCollection = 'attribute' | 'stack' | 'view' | 'trend' | 'segment';

export type VisualizationType = 'table' | 'line' | 'column' | 'bar' | 'pie' | 'doughnut' | 'combo';

export interface IVisualizationObjectMetadata {
    meta;
    content: IVisualizationObject;
}

export interface IBuckets {
    measures: IMeasure[];
    categories: ICategory[];
    filters: EmbeddedFilter[];
}

export interface IVisualizationObject {
    type: VisualizationType;
    buckets: IBuckets;
}

export interface IAttributesMap {
    [x: string]: string;
}

export interface IMeasuresMap {
    [x: string]: Partial<IMeasure>;
}

export interface IVisualizationMetadataResult {
    metadata: IVisualizationObjectMetadata;
    measuresMap: IMeasuresMap;
}
