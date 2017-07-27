import { IDataSource } from '../interfaces/DataSource';

export function dataSourcesMatch(first: IDataSource, second: IDataSource): boolean {
    const firstFingerprint = first ? first.getFingerprint() : null;
    const secondFingerprint = second ? second.getFingerprint() : null;

    return firstFingerprint === secondFingerprint;
}
