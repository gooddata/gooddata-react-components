import { IDataSource } from '../interfaces/DataSource';

export class DummyDataSource implements IDataSource {
    private data;
    private resolve;

    constructor(data, resolve = true) {
        this.data = data;
        this.resolve = resolve;
    }

    public getData(transformation: any): Promise<any> {
        if (this.resolve) {
            return Promise.resolve(this.data);
        }

        return Promise.reject('DummyDataSource reject');
    }

    public getFingerprint() {
        return '';
    }

    public getAfm() {
        return {};
    }
}
