import { DataSource } from '../DataSource';

describe('DataSource', () => {
    const afm = { measures: [], filters: [], attributes: [] };

    it('should call execfactory for getData', () => {
        const result = Promise.resolve();
        const execFactory = jest.fn().mockReturnValue(result);
        const dataSource = new DataSource(execFactory);

        const dataPromise = dataSource.getData({});
        expect(dataPromise).toEqual(result);
    });

    it('should return afm', () => {
        const execFactory = () => Promise.resolve({});
        const dataSource = new DataSource(execFactory, afm);

        expect(dataSource.getAfm()).toEqual(afm);
    });

    it('should return correct fingerprint', () => {
        const execFactory = () => Promise.resolve({});
        const dataSource = new DataSource(execFactory, afm);

        expect(dataSource.getFingerprint()).toEqual(JSON.stringify(afm));
    });
});
