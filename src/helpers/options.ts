import every = require('lodash/every');
import some = require('lodash/some');
import isEmpty = require('lodash/isEmpty');
import { AFM } from '@gooddata/typings';
import { AfmUtils } from '@gooddata/data-layer';

export interface IVisualizationOptions {
    dateOptionsDisabled: boolean;
}

export function getVisualizationOptions(afm: AFM.IAfm): IVisualizationOptions {
    if (isEmpty(afm.measures)) {
        return {
            dateOptionsDisabled: false
        };
    }

    const dateOptionsDisabled = every<AFM.IMeasure>(
        afm.measures,
        (measure) => {
            if (AfmUtils.isPoP(measure)) {
                return true; // TODO check this and write test!
            }
            const filters = AfmUtils.unwrapSimpleMeasure(measure).filters;
            return some<AFM.FilterItem>(filters, filter => AfmUtils.isDateFilter(filter));
        }
    );

    return {
        dateOptionsDisabled
    };
}
