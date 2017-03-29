interface IBaseFilter {
    id: string; // dateDataSet URI or attribute displayForm URI
    type: string;
}

export interface IAttributeFilter extends IBaseFilter {
    in?: string[]; // attribute elements IDs
    notIn?: string[]; // attribute elements IDs
}

export interface IDateFilter extends IBaseFilter {
    between: [string, string] | [number, number];
    granularity: string;
}

export interface IPositiveFilter {
    id: string; // attribute displayForm URI
    in: string[]; // attribute elements IDs
}

export interface INegativeFilter {
    id: string; // attribute displayForm URI
    notIn: string[]; // attribute elements IDs
}

export type IMeasureAttributeFilter = INegativeFilter | IPositiveFilter;

export interface ISpecificObject {
    id: string;
}

export interface ILookupObject {
    lookupId: string; // search by ID in measures
}

export interface IMeasureDefinition {
    baseObject: ILookupObject | ISpecificObject;
    filters?: IMeasureAttributeFilter[];
    aggregation?: string;
    popAttribute?: {
        id: string // attribute displayForm URI
    };
    showInPercent?: boolean; // if true, take all from 'attributes',
};

export interface IMeasure {
    id: string;
    definition: IMeasureDefinition;
}

export interface IAttribute {
    id: string; // attribute displayForm URI
};

export type IFilter = IDateFilter | IAttributeFilter;

export interface IAfm {
    attributes?: IAttribute[];
    filters?: IFilter[];
    measures?: IMeasure[];
};
