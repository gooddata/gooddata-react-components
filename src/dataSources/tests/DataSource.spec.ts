import { DataSource } from '../DataSource';

describe('DataSource', () => {
    it('should call execfactory for getData', () => {
        const result = Promise.resolve();
        const execFactory = jest.fn().mockReturnValue(result);
        const dataSource = new DataSource(execFactory);

        const dataPromise = dataSource.getData({});
        expect(dataPromise).toEqual(result);
    });

    it('should return correct fingerprint', () => {
        const fingerprint = 'fingerprint';
        const execFactory = () => Promise.resolve({});
        const dataSource = new DataSource(execFactory, fingerprint);

        expect(dataSource.getFingerprint()).toEqual(fingerprint);
    });
});
