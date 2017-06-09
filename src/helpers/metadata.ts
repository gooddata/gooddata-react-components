import { get, set } from 'lodash';
import {
    IMeasuresMap,
    IAttributesMap,
    IVisualizationObjectMetadata
} from '../legacy/model/VisualizationObject';

const getYearAttributeDisplayForm = (item) => {
    const dateType = get(item, 'attribute.content.type');
    if (dateType === 'GDC.time.year') {
        return get(item, 'attribute.content.displayForms.0.meta.uri');
    }
};

const getDateFilter = (visualizationObject: IVisualizationObjectMetadata) => {
    let dateFilterItem = get(visualizationObject, 'content.buckets.categories', [])
        .find(category => get(category, 'category.type', {}) === 'date');
    const dateFilter = dateFilterItem ? dateFilterItem.category : undefined;

    if (dateFilter) {
        return dateFilter;
    }

    dateFilterItem = get(visualizationObject, 'content.buckets.filters', [])
        .find(item => item.dateFilter !== undefined);

    return dateFilterItem ? dateFilterItem.dateFilter : undefined;
};

export const getAttributesMap = (sdk, projectId: string, visualizationObject: IVisualizationObjectMetadata):
    Promise<IAttributesMap> => {
    const dateFilter = getDateFilter(visualizationObject);
    if (!dateFilter) {
        return Promise.resolve({});
    }

    const attrUri = get(dateFilter, 'attribute') as string;
    return sdk.md.getObjects(projectId, [attrUri]).then((objects) => {
        return {
            [attrUri]: getYearAttributeDisplayForm(get(objects, 0))
        };
    });
};

export const fetchMeasures = (sdk, projectId: string, visualizationObject: IVisualizationObjectMetadata):
    Promise<IMeasuresMap> => {
    const measures = get(visualizationObject, 'content.buckets.measures', []);
    if (!measures.length) {
        return Promise.resolve({});
    }

    const uris = measures.map(measure => measure.measure.objectUri);
    return sdk.md.getObjects(projectId, uris).then((objects) => {
        return objects.reduce((acc, metric) => {
            const uri = get(metric, 'metric.meta.uri');
            if (uri) {
                set(acc, uri, {
                    measure: {
                        format: get(metric, 'metric.content.format')
                    }
                });
            }

            return acc;
        }, {});
    });
};
