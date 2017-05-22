import partial = require('lodash/partial');

import * as AFM from '../interfaces/Afm';
import * as Transformation from '../interfaces/Transformation';
import { getMeasureAdditionalInfo, getSorting, normalizeAfm } from '../adapters/utils';
import * as VisObj from './model/VisualizationObject';

function convertMeasureFilter(): VisObj.IEmbeddedListAttributeFilter {
    return {
        listAttributeFilter: {
            attribute: 'attribute',
            displayForm: 'displayForm',
            default: {
                negativeSelection: false,
                attributeElements: []
            }
        }
    };
}

function getLookupId(measure: AFM.IMeasure): string {
    return (measure.definition.baseObject as AFM.ILookupObject).lookupId;
}

const EmptyMeasure: AFM.IMeasure = {
    id: '___not_found___',
    definition: {
        baseObject: {
            id: '___not_found___'
        }
    }
};

function getMeasureTitle(transformation: Transformation.ITransformation, measure: AFM.IMeasure): string {
    const id = getLookupId(measure) || measure.id;

    const { title } = getMeasureAdditionalInfo(transformation, id);

    return title || measure.id;
}

function getAttributeSorting(
    transformation: Transformation.ITransformation,
    attribute: AFM.IAttribute
): { sort: VisObj.SortDirection } {
    const sorting = getSorting(transformation).find((s) => s.column === attribute.id);

    if (!sorting) {
        return null;
    }

    return { sort: (sorting.direction as VisObj.SortDirection) };
}

function getMeasureSorting(
    transformation: Transformation.ITransformation,
    measure: AFM.IMeasure
): { sort: VisObj.IMeasureSort } {
    const sorting = getSorting(transformation)
        .find((s) => (s.column === getLookupId(measure) || s.column === measure.id));

    if (!sorting) {
        return null;
    }

    return {
        sort: {
            direction: (sorting.direction as VisObj.SortDirection),
            sortByPoP: getLookupId(measure) && sorting.column !== getLookupId(measure) || false
        }
    };
}

function getMeasureFormat(transformation: Transformation.ITransformation, measure: AFM.IMeasure): { format?: string } {
    const id = getLookupId(measure) || measure.id;

    const { format } = getMeasureAdditionalInfo(transformation, id);

    return format ? { format } : {};
}

function findMeasure(afm: AFM.IAfm, id: string): AFM.IMeasure {
    return afm.measures.find((m) => m.id === id);
}

function getBaseObjectId(measure: AFM.IMeasure): string {
    return (measure.definition.baseObject as AFM.ISpecificObject).id;
}

function getReferencedObjectId(afm: AFM.IAfm, measure: AFM.IMeasure): string {
    const id = (measure.definition.baseObject as AFM.ILookupObject).lookupId;

    return getBaseObjectId(findMeasure(afm, id));
}

function getObjectId(afm: AFM.IAfm, measure: AFM.IMeasure): string {
    return getBaseObjectId(measure) || getReferencedObjectId(afm, measure);
}

function getMeasureType(aggregation: string = ''): VisObj.MeasureType {
    switch (aggregation.toLowerCase()) {
        case 'count':
            return 'attribute';
        case '':
            return 'metric';
        default:
            return 'fact';
    }
}

function convertMeasure(
    transformation: Transformation.ITransformation,
    afm: AFM.IAfm,
    measure: AFM.IMeasure
): VisObj.IMeasure {
    const filters = measure.definition.filters || [];
    const sorting = getMeasureSorting(transformation, measure) || {};
    const aggregation = measure.definition.aggregation ?
        { aggregation: measure.definition.aggregation } : {};
    const format = getMeasureFormat(transformation, measure) || {};

    return {
        measure: {
            measureFilters: filters.map(convertMeasureFilter),
            objectUri: getObjectId(afm, measure),
            showInPercent: Boolean(measure.definition.showInPercent),
            showPoP: Boolean(measure.definition.popAttribute),
            title: getMeasureTitle(transformation, measure),
            type: getMeasureType(measure.definition.aggregation),
            ...format,
            ...aggregation,
            ...sorting
        }
    };
}

function isStacking(transformation: Transformation.ITransformation, attribute: AFM.IAttribute): boolean {
    return (transformation.buckets || []).some((bucket) => {
        return bucket.name === 'stacks' &&
            (bucket.attributes || []).some((attr) => attr.id === attribute.id);
    });
}

function convertAttribute(transformation, attribute: AFM.IAttribute): VisObj.ICategory {
    const sorting = getAttributeSorting(transformation, attribute) || {};

    const collection = isStacking(transformation, attribute) ? 'stack' : 'attribute';

    return {
        category: {
            collection,
            displayForm: attribute.id,
            type: attribute.type,
            ...sorting
        }
    };
}

function isNotReferencedMeasure(measures: AFM.IMeasure[], measure: AFM.IMeasure): boolean {
    const popMeasure = measures.find((m) => Boolean(m.definition.popAttribute)) || EmptyMeasure;

    return measure.id !== getLookupId(popMeasure);
}

function isDateFilter(filter: AFM.IFilter): filter is AFM.IDateFilter {
    return filter.type === 'date';
}

function isPositiveAttributeFilter(filter: AFM.IAttributeFilter): filter is AFM.IPositiveAttributeFilter {
    return !!(filter as AFM.IPositiveAttributeFilter).in;
}

function isNegativeAttributeFilter(filter: AFM.IAttributeFilter): filter is AFM.INegativeAttributeFilter {
    return !!(filter as AFM.INegativeAttributeFilter).notIn;
}

function convertFilter(filter: AFM.IFilter): VisObj.EmbeddedFilter {
    if (isDateFilter(filter)) {
        const [from, to] = filter.between;

        return {
            dateFilter: {
                type: 'relative',
                from,
                to,
                dataset: filter.id,
                granularity: `GDC.time.${filter.granularity}`
            }
        };
    }

    if (isPositiveAttributeFilter(filter)) {
        return {
            listAttributeFilter: {
                attribute: 'foo',
                displayForm: filter.id,
                default: {
                    negativeSelection: false,
                    attributeElements: filter.in
                }
            }
        };
    }

    if (isNegativeAttributeFilter(filter)) {
        return {
            listAttributeFilter: {
                displayForm: filter.id,
                default: {
                    negativeSelection: true,
                    attributeElements: filter.notIn
                }
            }
        } as VisObj.IEmbeddedListAttributeFilter;
    }
}

export function toVisObj(
    type: VisObj.VisualizationType,
    AFM: AFM.IAfm,
    transformation: Transformation.ITransformation
): VisObj.IVisualizationObject {
    const normalized = normalizeAfm(AFM);

    return {
        type,

        buckets: {
            measures: normalized.measures
                .filter(partial(isNotReferencedMeasure, normalized.measures))
                .map(partial(convertMeasure, transformation, normalized)),

            categories: normalized.attributes.map(partial(convertAttribute, transformation)),

            filters: normalized.filters.map(convertFilter)
        }
    };
}
