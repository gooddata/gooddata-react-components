import partial = require('lodash/partial');

import { IAfm, ISpecificObject, IMeasure, IAttribute, ILookupObject } from '../interfaces/Afm';
import { ITransformation } from '../interfaces/Transformation';
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

function getLookupId(measure: IMeasure): string {
    return (measure.definition.baseObject as ILookupObject).lookupId;
}

const EmptyMeasure: IMeasure = {
    id: '___not_found___',
    definition: {
        baseObject: {
            id: '___not_found___'
        }
    }
};

function getMeasureTitle(transformation: ITransformation, measure: IMeasure): string {
    const id = getLookupId(measure) || measure.id;

    const { title } = getMeasureAdditionalInfo(transformation, id);

    return title || measure.id;
}

function getAttributeSorting(transformation: ITransformation, attribute: IAttribute): { sort: VisObj.SortDirection } {
    const sorting = getSorting(transformation).find((s) => s.column === attribute.id);

    if (!sorting) {
        return null;
    }

    return { sort: (sorting.direction as VisObj.SortDirection) };
}

function getMeasureSorting(transformation: ITransformation, measure: IMeasure): { sort: VisObj.IMeasureSort } {
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

function findMeasure(afm: IAfm, id: string): IMeasure {
    return afm.measures.find((m) => m.id === id);
}

function getBaseObjectId(measure: IMeasure): string {
    return (measure.definition.baseObject as ISpecificObject).id;
}

function getReferencedObjectId(afm: IAfm, measure: IMeasure): string {
    const id = (measure.definition.baseObject as ILookupObject).lookupId;

    return getBaseObjectId(findMeasure(afm, id));
}

function getObjectId(afm: IAfm, measure: IMeasure) {
    return getBaseObjectId(measure) || getReferencedObjectId(afm, measure);
}

function convertMeasure(transformation, afm: IAfm, measure: IMeasure): VisObj.IMeasure {
    const filters = measure.definition.filters || [];
    const sorting = getMeasureSorting(transformation, measure) || {};
    const aggregation = measure.definition.aggregation ?
        { aggregation: measure.definition.aggregation } : {};

    return {
        measure: {
            measureFilters: filters.map(convertMeasureFilter),
            objectUri: getObjectId(afm, measure),
            showInPercent: Boolean(measure.definition.showInPercent),
            showPoP: Boolean(measure.definition.popAttribute),
            title: getMeasureTitle(transformation, measure),
            type: 'metric',
            ...aggregation,
            ...sorting
        }
    };
}

function isStacking(transformation: ITransformation, attribute: IAttribute): boolean {
    return (transformation.buckets || []).some((bucket) => {
        return bucket.name === 'stacks' &&
            (bucket.attributes || []).some((attr) => attr.id === attribute.id);
    });
}

function convertAttribute(transformation, attribute: IAttribute): VisObj.ICategory {
    const sorting = getAttributeSorting(transformation, attribute) || {};

    const collection = isStacking(transformation, attribute) ? 'stack' : 'attribute';

    return {
        category: {
            collection,
            displayForm: attribute.id,
            type: 'attribute',
            ...sorting
        }
    };
}

function isNotReferencedMeasure(measures: IMeasure[], measure: IMeasure): boolean {
    const popMeasure = measures.find((m) => Boolean(m.definition.popAttribute)) || EmptyMeasure;

    return measure.id !== getLookupId(popMeasure);
}

export function toVisObj(
    type: VisObj.VisualizationType,
    AFM: IAfm,
    transformation: ITransformation
): VisObj.IVisualizationObject {
    const normalized = normalizeAfm(AFM);

    return {
        type,

        buckets: {
            measures: normalized.measures
                .filter(partial(isNotReferencedMeasure, normalized.measures))
                .map(partial(convertMeasure, transformation, normalized)),

            categories: normalized.attributes.map(partial(convertAttribute, transformation)),

            filters: []
        }
    };
}
