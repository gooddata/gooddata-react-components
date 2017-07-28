import { IDataSource } from '../interfaces/DataSource';

export type execFactory = (transformation) => Promise<any>;

export class DataSource implements IDataSource {
    constructor(private execFactory: execFactory, private fingerprint?: string) {}

    public getData(transformation): Promise<any> {
        return this.execFactory(transformation);
    }

    public getFingerprint(): string {
        return this.fingerprint;
    }
}
