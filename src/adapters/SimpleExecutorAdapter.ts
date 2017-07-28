import { IAdapter } from '../interfaces/Adapter';
import { IDataSource } from '../interfaces/DataSource';
import { DataSource } from '../dataSources/DataSource';
import {
    AttributeMap,
    generateFilters,
    generateMetricDefinition,
    getSorting,
    loadAttributesMap,
    normalizeAfm
} from './utils';
import { IAfm } from '../interfaces/Afm';
import { ITransformation } from '../interfaces/Transformation';

export class SimpleExecutorAdapter implements IAdapter {

    private projectId: string;
    private settings;
    private sdk;

    constructor(sdk, projectId: string, settings = {}) {
        this.sdk = sdk;
        this.projectId = projectId;
        // settings for gooddata SDK
        // @see https://github.com/gooddata/gooddata-js/blob/master/src/execution.js#L71
        this.settings = settings;
    }

    public createDataSource(afm): Promise<IDataSource> {
        const normalizedAfm = normalizeAfm(afm);
        const execFactory = (transformation) => {
            return loadAttributesMap(normalizedAfm, this.sdk, this.projectId)
                .then((attributesMapping) => {
                    // dump('AttributesMapping', attributesMapping);
                    const { columns, executionConfiguration } =
                        this.convertData(normalizedAfm, transformation, attributesMapping);
                    // dump('Columns', columns);
                    // dump('ExecutionConfiguration', executionConfiguration);
                    return this.sdk.execution.getData(this.projectId, columns, executionConfiguration, this.settings);
                });
        };

        const fingerprint = JSON.stringify(normalizedAfm);
        return Promise.resolve(new DataSource(execFactory, fingerprint));
    }

    private convertData(afm: IAfm, transformation: ITransformation, attributesMapping: AttributeMap) {
        const columns = [];
        const definitions = [];

        /*
            we should use here 'transformation' to organize better attributes
            in exec request but /simpleexecutor is not able to handle it and also
            is not able to provide "well transformed" result data
         */
        columns.push(...afm.attributes.map(attribute => attribute.id));

        // Get columns
        columns.push(...afm.measures.map((item) => {
            const metricDefinition =
                generateMetricDefinition(afm, transformation, attributesMapping, item);

            definitions.push({ metricDefinition });

            return item.id;
        }));

        const orderBy = getSorting(transformation);
        const where = generateFilters(afm);

        return {
            columns,
            executionConfiguration: {
                orderBy,
                where,
                definitions
            }
        };
    }
}
