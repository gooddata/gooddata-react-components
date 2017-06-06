export interface IDataSource {
    getData(transformation): Promise<any>;
}
