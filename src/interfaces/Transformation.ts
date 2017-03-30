export interface ISort {
    column: string;
    direction: string;
}

export interface IMeasure {
    id: string;
    title?: string;
    format?: string;
}

export interface ITransformation {
    sorting?: ISort[];
    measures?: IMeasure[];
}
