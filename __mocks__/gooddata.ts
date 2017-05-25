import { ISimpleExecutorResult } from '../src/Interfaces';

const execution = {
    getData(projectId, columns): Promise<ISimpleExecutorResult> {
        if (columns.indexOf('too-large-measure') >= 0) {
            return Promise.reject({
                response: {
                    status: 413
                }
            });
        }

        if (columns.indexOf('bad-request') >= 0) {
            return Promise.reject({
                response: {
                    status: 400
                }
            });
        }

        if (columns.indexOf('empty-result') >= 0) {
            return Promise.resolve({
                rawData: [[]],
                isEmpty: true,
                headers: [{
                    id: 'abcd',
                    title: 'Attribute',
                    type: 'attrLabel',
                    uri: '/gdc/md/project/obj/1'
                }]
            });
        }

        return Promise.resolve({
            rawData: [['10000']],
            headers: [{
                id: 'abcd',
                title: 'Attribute',
                type: 'attrLabel',
                uri: '/gdc/md/project/obj/1'
            }]
        });
    },

    getDataForVis(): Promise<ISimpleExecutorResult>  {
        return Promise.resolve({
            rawData: [['10000']],
            headers: [{
                id: 'abcd',
                title: 'Attribute',
                type: 'attrLabel',
                uri: '/gdc/md/project/obj/1'
            }]
        });
    }
};

export {
    execution
};
