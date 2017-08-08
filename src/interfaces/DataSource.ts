import { IAfm } from './Afm';

export interface IDataSource {
    getData(transformation): Promise<any>;
    getAfm(): IAfm;
    getFingerprint(): string;
}
