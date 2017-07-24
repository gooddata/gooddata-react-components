import * as validate from 'validate.js';

validate.validators.isString = function (value, options) {
    if (!options.presence && !validate.isDefined(value)) {
        return null;
    }

    if (validate.isString(value)) {
        return null;
    }

    return `needs to be a string but ${typeof value} was provided.`;
};

validate.validators.isArray = function (value, options) {
    if (!options.presence && !validate.isDefined(value)) {
        return null;
    }

    if (validate.isArray(value)) {
        return null;
    }

    return `needs to be an Array but ${typeof value} was provided.`;
};

validate.validators.afmBaseObject = function (value, options, key, attributes) {
    if (!validate.isDefined(value)) {
        return 'needs to be defined';
    }

    if (!value.hasOwnProperty('lookupId') && !value.hasOwnProperty('id')) {
        return 'needs to contain either id or lookupId';
    }

    if (value.hasOwnProperty('lookupId') && !validate.isString(value.lookupId)) {
        return `lookupId needs to be a string but ${typeof value.lookupId} was provided.`;
    }

    if (value.hasOwnProperty('id') && !validate.isString(value.id)) {
        return `id needs to be a string but ${typeof value.id} was provided.`;
    }

    return null;
};

validate.validators.afmMeasuresArray = function (value, options, key, attributes) {
    const measuresValidations = value.map((measure) => {
        return validate(measure, measureConstraint);
    });

    const errorValidations = measuresValidations.filter((result) => {
        return validate.isDefined(result);
    });

    if (errorValidations.length > 0) {
        return errorValidations;
    }

    return null;
};

validate.validators.afmFiltersArray = function (value, options, key, attributes) {
    return null;
};

validate.validators.afmAttributesArray = function (value, options, key, attributes) {
    if (validate.isDefined(value)) {
        if (!validate.isArray(value)) {
            return `needs to be an array but ${typeof value.id} was provided.`;
        }

        const attributesValidations = value.map((attribute) => {
            return validate(attribute, attributeConstaraint);
        });

        const errorValidations = attributesValidations.filter((result) => {
            return validate.isDefined(result);
        });

        if (errorValidations.length > 0) {
            return errorValidations;
        }

        return null;
    }
    return null;
};

const attributeConstaraint = {
    id: {
        presence: true,
        isString: true
    },
    type: {
        presence:true,
        inclusion: ['date', 'attribute']
    }
};

export const measureConstraint = {
    id: {
        presence: true,
        isString: true
    },
    definition: {
        presence: true
    }
    'definition.baseObject': {
        afmBaseObject: true
    },
    'definition.filters': {

    },
    'definition.aggregation': {

    },
    'definition.popAttribute': {

    },
    'definition.showInPercent': {

    }
};

const afmConstraint = {
    attributes: {
        isArray: true,
        afmAttributesArray: true
    },
    filters: {
        isArray: true,
        afmFiltersArray: true
    },
    measures: {
        isArray: true,
        afmMeasuresArray: true
    }
};


export default function afmValidator(afm) {
    return validate(afm, afmConstraint, {format: "flat"});
}