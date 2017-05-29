export interface IDataSource {
    getData(transformation): Promise<any>;
}

export interface IAdapter {
    createDataSource(afm): IDataSource;
}

export interface IHeader {
    id: string;
    title: string;
    uri?: string;
    type: string;
}

export interface ISimpleExecutorResult {
    rawData?: String[][];
    isEmpty?: boolean;
    headers?: IHeader[];
}
