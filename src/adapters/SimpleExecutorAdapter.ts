import { IAdapter, IDataSource } from '../Interfaces';
import { DataSource } from '../DataSource';
import {
    generateMetricDefinition,
    generateFilters,
    lookupAttributes,
    normalizeAfm,
    getMeasureAdditionalInfo,
    getSorting,
    AttributeMap
} from './utils';

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

    public createDataSource(afm): IDataSource {
        const normalizedAfm = normalizeAfm(afm);
        const execFactory = (transformation) => {
            return this.loadAttributes(normalizedAfm)
                .then((attributesMapping) => {
                    // dump('AttributesMapping', attributesMapping);
                    const { columns, executionConfiguration } =
                        this.convertData(normalizedAfm, transformation, attributesMapping);
                    // dump('Columns', columns);
                    // dump('ExecutionConfiguration', executionConfiguration);
                    return this.sdk.execution.getData(this.projectId, columns, executionConfiguration, this.settings);
                });
        };

        return new DataSource(execFactory);
    }

    private loadAttributes(afm): Promise<AttributeMap> {
        const attributes = lookupAttributes(afm);
        if (attributes.length > 0) {
            return this.sdk.md.getObjects(this.projectId, attributes)
                .then((items) => items.map((item) => ({
                    attribute: item.attributeDisplayForm.content.formOf,
                    attributeDisplayForm: item.attributeDisplayForm.meta.uri
                })));
        }
        return Promise.resolve([]);
    }

    private convertData(afm, transformation, attributesMapping) {
        const columns = [];
        const definitions = [];

        /*
            we should use here 'transformation' to organize better attributes
            in exec request but /simpleexecutor is not able to handle it and also
            is not able to provide "well transformed" result data
         */
        columns.push(...afm.attributes.map((attribute) => attribute.id));

        // Get columns
        columns.push(...afm.measures.map((item) => {
            definitions.push({
                metricDefinition: {
                    expression: generateMetricDefinition(item, afm, attributesMapping),
                    identifier: item.id,
                    ...getMeasureAdditionalInfo(transformation, item.id)
                }
            });

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
