import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DummyDataSource } from './DummyDataSource';

export class DummyAdapter implements IAdapter {
    private data;
    private success;
    private dataSource;

    constructor(data, success = true, dataSource = null) {
        this.data = data;
        this.success = success;
    }

    public createDataSource(afm: any): Promise<IDataSource> {
        return this.dataSource
            ? Promise.resolve(this.dataSource)
            : Promise.resolve(new DummyDataSource(this.data, this.success));
    }
}
