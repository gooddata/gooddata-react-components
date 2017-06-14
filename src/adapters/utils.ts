import isEmpty = require('lodash/isEmpty');
import compact = require('lodash/compact');
import flow = require('lodash/flow');
import uniq = require('lodash/uniq');
import flatten = require('lodash/flatten');
import pick = require('lodash/pick');
import get = require('lodash/get');
import { ISort, ITransformation } from '../interfaces/Transformation';
import { isUri, areUris } from '../helpers/uri';
import {
    IMeasure,
    IMeasureAttributeFilter,
    ISpecificObject,
    ILookupObject,
    IAfm,
    IDateFilter,
    IAttributeFilter,
    IPositiveFilter,
    INegativeFilter,
    IPositiveAttributeFilter,
    INegativeAttributeFilter
} from '../interfaces/Afm';
import invariant = require('invariant');

export const SHOW_IN_PERCENT_MEASURE_FORMAT = '#,##0.00%';

export type ObjectUri = string;

export interface IAttributeMapKeys {
    attribute: ObjectUri;
    attributeDisplayForm: ObjectUri;
}

export type AttributeMap = IAttributeMapKeys[];

const getFilterExpression = (filter: IMeasureAttributeFilter, attributesMapping) => {
    const elements = (filter as IPositiveFilter).in || (filter as INegativeFilter).notIn;

    if (isEmpty(elements)) {
        return null;
    }

    const id = getAttributeByDisplayForm(attributesMapping, filter.id);
    const inExpr = (filter as INegativeFilter).notIn ? 'NOT IN' : 'IN';
    const elementsForQuery = elements.map(e => isUri(id) ? `[${id}/elements?id=${e}]` : `{${id}?${e}}`);

    return `${wrapId(id)} ${inExpr} (${elementsForQuery.join(',')})`;
};

const getFiltersExpression = (filters: IMeasureAttributeFilter[] = [], attributesMapping) => {
    const filterExpressions = filters.map(filter => getFilterExpression(filter, attributesMapping));

    return compact(filterExpressions).join(' AND ');
};

const wrapId = (id: string) => isUri(id) ? `[${id}]` : `{${id}}`;

const getSimpleMetricExpression = (item: IMeasure, attributesMapping, includeFilters = true) => {
    const { filters, baseObject, aggregation } = item.definition;
    const filterExpression = includeFilters ? getFiltersExpression(filters, attributesMapping) : null;
    const id = (baseObject as ISpecificObject).id;
    const wrappedIdentifier = wrapId(id);

    return `${aggregation ? `${aggregation.toUpperCase()}(${wrappedIdentifier})` : `${wrappedIdentifier}`
        }${filterExpression ? ` WHERE ${filterExpression}` : ''}`;
};

const getGeneratedMetricExpression = (item: IMeasure, attributesMapping, includeFilters = true) => {
    return `SELECT ${getSimpleMetricExpression(item, attributesMapping, includeFilters)}`;
};

const getPercentMetricExpression = (item: IMeasure, attributesMapping, attributesUris) => {
    const metricExpressionWithoutFilters = getGeneratedMetricExpression(item, attributesMapping, false);

    const filterExpression = getFiltersExpression(item.definition.filters, attributesMapping);
    const whereExpression = filterExpression ? ` WHERE ${filterExpression}` : '';

    const byAllExpression = attributesUris.map(attributeUri => `ALL ${wrapId(attributeUri)}`).join(',');

    return `SELECT (${metricExpressionWithoutFilters}${whereExpression}) ` +
        `/ (${metricExpressionWithoutFilters} BY ${byAllExpression}${whereExpression})`;
};

const createContributionMetric = (item, attributesMapping, attributesUris) => {
    return getPercentMetricExpression(item, attributesMapping, attributesUris);
};

const createPoPMetric = (item: IMeasure, afm: IAfm, attributesMapping) => {
    const baseObject = (item.definition.baseObject as ILookupObject);
    let generatedMetricExpression;
    if (baseObject.lookupId) {
        const base = afm.measures.find(measure => measure.id === baseObject.lookupId);
        generatedMetricExpression = `SELECT (${generateMetricExpression(base, afm, attributesMapping)})`;
    } else {
        generatedMetricExpression = `SELECT ${getSimpleMetricExpression(item, attributesMapping)}`;
    }
    const attributeUri = getAttributeByDisplayForm(attributesMapping, item.definition.popAttribute.id);

    return `${generatedMetricExpression} FOR PREVIOUS (${wrapId(attributeUri)})`;
};

const isPoP = (item: IMeasure): boolean => {
    return !!(item.definition && item.definition.popAttribute);
};

const isShowInPercent = (item: IMeasure): boolean => {
    return item.definition && item.definition.showInPercent;
};

const hasFilters = (item: IMeasure): boolean => {
    return !!(item.definition && item.definition.filters);
};

const getAttributeByDisplayForm = (mapping: AttributeMap, displayForm): string => {
    const item = mapping.find(i => i.attributeDisplayForm === displayForm);
    invariant(item, `${displayForm} not found in ${JSON.stringify(mapping)}`);
    return item.attribute;
};

export const generateMetricExpression = (item: IMeasure, afm: IAfm, attributesMapping) => {
    if (isPoP(item)) {
        return createPoPMetric(item, afm, attributesMapping);
    }

    if (isShowInPercent(item)) {
        const attributesUris = afm.attributes.map(
            attribute => getAttributeByDisplayForm(attributesMapping, attribute.id)
        );
        return createContributionMetric(item, attributesMapping, attributesUris);
    }

    return getGeneratedMetricExpression(item, attributesMapping);
};

export const lookupAttributes = (afm: IAfm) => {
    const attributes = afm.measures.map((measure) => {
        const ids = [];
        if (isPoP(measure)) { // MAQL - FOR PREVIOUS ([attributeUri]) OR ({attributeId})
            ids.push(measure.definition.popAttribute.id);
        }

        if (isShowInPercent(measure)) { // MAQL - BY ALL [attributeUri1], ALL [attributeUri2] OR ALL {attributeId2}
            ids.push(...afm.attributes.map(attribute => attribute.id));
        }

        if (hasFilters(measure)) {
            ids.push(...measure.definition.filters.map(filter => filter.id));
        }

        return ids;
    });

    return flow(
        flatten,
        compact,
        uniq
    )(attributes);
};

export function normalizeAfm(afm: IAfm): IAfm {
    return {
        attributes: afm.attributes || [],
        measures: afm.measures || [],
        filters: afm.filters || []
    };
}

const generateDateFilter = (filter: IDateFilter) => {
    return {
        $between: [...filter.between],
        $granularity: `GDC.time.${filter.granularity}`
    };
};

const generateAttributeFilter = (filter: IAttributeFilter) => {
    const positiveFilter = filter as IPositiveAttributeFilter;
    if (positiveFilter.in && positiveFilter.in.length > 0) {
        return {
            $in: positiveFilter.in.map(id => ({ id }))
        };
    }

    const negativeFilter = filter as INegativeAttributeFilter;
    if (negativeFilter.notIn.length > 0) {
        return {
            $not: {
                $in: (filter as INegativeAttributeFilter).notIn.map(id => ({ id }))
            }
        };
    }

    return null;
};

export const generateFilters = (afm: IAfm) => {
    return afm.filters.reduce((memo, filter) => {
        if (filter.type === 'date') {
            memo[filter.id] = generateDateFilter(filter as IDateFilter);
        }

        if (filter.type === 'attribute') {
            const attrFilter = generateAttributeFilter(filter as IAttributeFilter);
            if (attrFilter) {
                memo.$and.push({
                    [filter.id]: attrFilter
                });
            }
        }

        return memo;
    }, { $and: [] });
};

export const getSorting = (transformation): ISort[] => {
    return get(transformation, 'sorting', []);
};

export interface IAdditionalInfo {
    title?: string;
    format?: string;
}

export const getMeasureAdditionalInfo =
    (transformation: ITransformation, id: string): IAdditionalInfo  => {
        const info = get(transformation, 'measures', []).find(measure => measure.id === id);
        return pick<IAdditionalInfo, {}>(info, ['title', 'format']);
    };

export function loadAttributesMap(afm: IAfm, sdk, projectId: string): Promise<AttributeMap> {
    const attributes = lookupAttributes(afm);

    if (attributes.length > 0) {
        const loadAttributeUris = areUris(attributes)
            ? Promise.resolve(attributes)
            : sdk.md.getUrisFromIdentifiers(projectId, attributes)
                .then(pairs => pairs.map(pair => pair.uri));

        return loadAttributeUris.then((objectUris) => {
            return sdk.md.getObjects(projectId, objectUris)
                .then(items => items.map(item => ({
                    attribute: item.attributeDisplayForm.content.formOf,
                    attributeDisplayForm: areUris(attributes) ?
                        item.attributeDisplayForm.meta.uri :
                        item.attributeDisplayForm.meta.identifier
                })));
        });
    }
    return Promise.resolve([]);
}

export const getMeasureFormat = (item: IMeasure, defaultFormat: string) =>
    (item.definition.showInPercent ? SHOW_IN_PERCENT_MEASURE_FORMAT : defaultFormat);

export const generateMetricDefinition = (
    afm: IAfm,
    transformation: ITransformation,
    attributesMapping: AttributeMap,
    item: IMeasure
) => {
    const { title, format } = getMeasureAdditionalInfo(transformation, item.id);

    return {
        expression: generateMetricExpression(item, afm, attributesMapping),
        identifier: item.id,
        title,
        format: getMeasureFormat(item, format)
    };
};
