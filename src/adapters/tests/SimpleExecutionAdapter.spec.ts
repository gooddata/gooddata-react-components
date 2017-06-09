import {
    SimpleExecutorAdapter
} from '../SimpleExecutorAdapter';

describe('SimpleExecutorAdapter', () => {
    const transformation = {};
    const projectId = 'abc';
    const afm = {};

    it('should request data via provided sdk', (done) => {
        const getDataStub = jest.fn().mockReturnValue(Promise.resolve());
        const DummySDK = {
            execution: {
                getData: getDataStub
            }
        };

        const adapter = new SimpleExecutorAdapter(DummySDK, projectId);
        adapter.createDataSource(afm).then((dataSource) => {
            dataSource.getData(transformation).then(() => {
                expect(getDataStub).toBeCalled();
                done();
            });
        });
    });
});
