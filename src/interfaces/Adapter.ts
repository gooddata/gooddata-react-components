import { IDataSource } from './DataSource';

export interface IAdapter {
    createDataSource(afm): IDataSource;
}
