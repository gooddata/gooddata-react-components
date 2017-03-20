import { md, execution } from 'gooddata';
import { get } from 'lodash';
import { IAdapter, IDataSource } from '../Interfaces';
import { DataSource } from '../DataSource';
import {
    generateMetricDefinition,
    generateFilters,
    lookupAttributes,
    normalizeAfm,
    AttributeMap
} from './utils';

// function dump(title, obj) {
//     console.log(title,
//         JSON.stringify(obj, null, 2)
//     );
// }

// function streamToString(stream, callback) {
//     let str = '';
//     stream.on('data', (chunk) => {
//         str += chunk;
//     });
//     stream.on('end', () => {
//         callback(str);
//     });
// }

export class SimpleExecutorAdapter implements IAdapter {

    private projectId: string;

    constructor(projectId: string) {
        this.projectId = projectId;
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
                    return execution.getData(this.projectId, columns, executionConfiguration);
                })
                .catch((err) => {
                    console.error('err', err);
                });
        };

        return new DataSource(execFactory);
    }

    private loadAttributes(afm): Promise<AttributeMap> {
        const attributes = lookupAttributes(afm);
        if (attributes.length > 0) {
            return md.getObjects(this.projectId, attributes)
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

        columns.push(...afm.attributes.map((attribute) => attribute.id));

        // Get columns
        columns.push(...afm.measures.map((item) => {
            if (item.definition) {
                definitions.push({
                    metricDefinition: {
                        title: item.definition.title,
                        format: item.definition.format,
                        expression: generateMetricDefinition(item, afm, attributesMapping),
                        identifier: item.id
                    }
                });
            }

            return item.id;
        }));

        // Collect sort info
        const orderBy = this.convertSorting(transformation);

        // Get filters
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

    // TODO move to utils
    private convertSorting(transformation) {
        return get(transformation, 'sorting', []).map((sort) => ({
            column: sort.column,
            direction: sort.direction
        }));
    }
}

