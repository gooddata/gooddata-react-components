const dummyDataSource = {};
jest.mock('../SimpleExecutorAdapter', () => {
    class DummySimpleExecutorAdapter {
        constructor() {}
        createDataSource() {
            return Promise.resolve(dummyDataSource);
        }
    }

    return {
        SimpleExecutorAdapter: DummySimpleExecutorAdapter
    };
});

import { charts } from '../../legacy/tests/fixtures/VisObj.fixtures';
import {
    UriAdapter
} from '../UriAdapter';

describe('UriAdapter', () => {
    const projectId = 'FoodMartDemo';
    const uri = '/gdc/md/FoodMartDemo/1';

    let DummySDK;
    beforeEach(() => {
        const visualizationObject = {
            visualization: { content: charts.bar.simpleMeasure }
        };

        DummySDK = {
            xhr: {
                get: jest.fn().mockReturnValue(Promise.resolve(visualizationObject))
            }
        };
    });

    it('should fetch visualization object when creating data source', (done) => {
        const adapter = new UriAdapter(DummySDK, projectId);
        adapter.createDataSource({ uri }).then((dataSource) => {
            expect(DummySDK.xhr.get).toBeCalledWith(uri);
            done();
        });
    });

    it('should retrieve datasource when requested', (done) => {
        const adapter = new UriAdapter(DummySDK, projectId);
        adapter.createDataSource({ uri }).then((dataSource) => {
            expect(dataSource).toEqual(dummyDataSource);
            done();
        });
    });

    it('should handle fail of vis. obj. fetch', (done) => {
        const adapter = new UriAdapter(DummySDK, projectId);
        DummySDK.xhr.get.mockImplementationOnce(() => Promise.reject('invalid URI'));
        adapter.createDataSource({ uri }).catch((error) => {
            expect(error).toBe('invalid URI');
            done();
        });
    });
});
