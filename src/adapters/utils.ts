import { isEmpty, compact, flow, uniq, flatten, pick, get } from 'lodash';
import { ISort, ITransformation } from '../interfaces/Transformation';
import {
    IMeasure,
    IMeasureAttributeFilter,
    ISpecificObject,
    ILookupObject,
    IAfm,
    IDateFilter,
    IAttributeFilter,
    IPositiveFilter,
    INegativeFilter
} from '../interfaces/Afm';

type ObjectUri = string;

interface IAttributeMapKeys {
    attribute: ObjectUri;
    attributeDisplayForm: ObjectUri;
}

export type AttributeMap = IAttributeMapKeys[];

const getFilterExpression = (filter: IMeasureAttributeFilter, attributesMapping) => {
    const elements = (filter as IPositiveFilter).in || (filter as INegativeFilter).notIn;

    if (isEmpty(elements)) {
        return null;
    }

    const uri = getAttributeByDisplayForm(attributesMapping, filter.id);
    const inExpr = (filter as INegativeFilter).notIn ? 'NOT IN' : 'IN';
    const elementsForQuery = elements.map((e) => `[${uri}/elements?id=${e}]`);

    return `[${uri}] ${inExpr} (${elementsForQuery.join(',')})`;
};

const getFiltersExpression = (filters: IMeasureAttributeFilter[] = [], attributesMapping) => {
    const filterExpressions = filters.map((filter) => getFilterExpression(filter, attributesMapping));

    return compact(filterExpressions).join(' AND ');
};

const getSimpleMetricExpression = (item: IMeasure, attributesMapping, includeFilters = true) => {
    const { filters, baseObject, aggregation } = item.definition;
    const filterExpression = includeFilters ? getFiltersExpression(filters, attributesMapping) : null;
    const uri = (baseObject as ISpecificObject).id;

    return `${aggregation ? `${aggregation.toUpperCase()}([${uri}])` : `[${uri}]`
        }${filterExpression ? ` WHERE ${filterExpression}` : ''}`;
};

const getGeneratedMetricExpression = (item: IMeasure, attributesMapping, includeFilters = true) => {
    return `SELECT ${getSimpleMetricExpression(item, attributesMapping, includeFilters)}`;
};

const getPercentMetricExpression = (item: IMeasure, attributesMapping, attributesUris) => {
    const metricExpressionWithoutFilters = getGeneratedMetricExpression(item, attributesMapping, false);

    const filterExpression = getFiltersExpression(item.definition.filters, attributesMapping);
    const whereExpression = filterExpression ? ` WHERE ${filterExpression}` : '';

    const byAllExpression = attributesUris.map((attributeUri) => `ALL [${attributeUri}]`).join(',');

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
        const base = afm.measures.find((measure) => measure.id === baseObject.lookupId);
        generatedMetricExpression = `SELECT (${generateMetricDefinition(base, afm, attributesMapping)})`;
    } else {
        generatedMetricExpression = `SELECT ${getSimpleMetricExpression(item, attributesMapping)}`;
    }
    const attributeUri = getAttributeByDisplayForm(attributesMapping, item.definition.popAttribute.id);
    return `${generatedMetricExpression} FOR PREVIOUS ([${attributeUri}])`;
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

const getAttributeByDisplayForm = (mapping, displayForm): string => {
    return mapping.find((item) => item.attributeDisplayForm === displayForm).attribute;
};

export const generateMetricDefinition = (item: IMeasure, afm: IAfm, attributesMapping) => {
    if (isPoP(item)) {
        return createPoPMetric(item, afm, attributesMapping);
    }

    if (isShowInPercent(item)) {
        const attributesUris = afm.attributes.map(
            (attribute) => getAttributeByDisplayForm(attributesMapping, attribute.id)
        );
        return createContributionMetric(item, attributesMapping, attributesUris);
    }

    return getGeneratedMetricExpression(item, attributesMapping);
};

export const lookupAttributes = (afm: IAfm) => {
    const attributes = afm.measures.map((measure) => {
        if (isPoP(measure)) { // MAQL - FOR PREVIOUS ([attributeUri])
            return measure.definition.popAttribute.id;
        }

        if (isShowInPercent(measure)) { // MAQL - BY ALL [attributeUri1], ALL [attributeUri2]
            return afm.attributes.map((attribute) => attribute.id);
        }

        if (hasFilters(measure)) {
            return measure.definition.filters.map((filter) => filter.id);
        }

        return null;
    });

    return flow(
        flatten,
        compact,
        uniq
    )(attributes);
};

export const normalizeAfm = (afm: IAfm) => {
    if (!afm.attributes) {
        afm.attributes = [];
    }

    if (!afm.filters) {
        afm.filters = [];
    }

    if (!afm.measures) {
        afm.measures = [];
    }

    return afm;
};

const generateDateFilter = (filter: IDateFilter) => {
    return {
        $between: [...filter.between],
        $granularity: `GDC.time.${filter.granularity}`
    };
};

const generateAttributeFilter = (filter: IAttributeFilter) => {
    return (filter.in) ?
        { $in: filter.in.map((id) => ({ id })) } :
        { $not: { $in: filter.notIn.map((id) => ({ id })) }};
};

export const generateFilters = (afm: IAfm) => {
    return afm.filters.reduce((memo, filter) => {
        if (filter.type === 'date') {
            memo[filter.id] = generateDateFilter(filter as IDateFilter);
        }

        if (filter.type === 'attribute') {
            memo.$and.push({
                [filter.id]: generateAttributeFilter(filter as IAttributeFilter)
            });
        }

        return memo;
    }, { $and: [] });
};

export const generateSorting = (transformation): ISort[] => {
    return get(transformation, 'sorting', []).map((sort) => ({
        column: sort.column,
        direction: sort.direction
    }));
};

export const getMeasureAdditionalInfo = (transformation: ITransformation, id: string) => {
    const info = get(transformation, 'measures', []).find((measure) => measure.id === id);
    return pick(info, ['title', 'format']);
};
