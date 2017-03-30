import { IAdapter, IDataSource } from '../../src/Interfaces';
import { DummyDataSource } from './DummyDataSource';

export class DummyAdapter implements IAdapter {

    private data;
    private success;

    constructor(data, success = true) {
        this.data = data;
        this.success = success;
    }

    public createDataSource(afm: any): IDataSource {
        return new DummyDataSource(this.data, this.success);
    }
}
