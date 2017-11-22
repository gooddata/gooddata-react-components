import { AFM } from '@gooddata/typings';

const MEASURE_1: AFM.IMeasure = {
    localIdentifier: 'm1',
    definition: {
        measure: {
            item: {
                uri: '/gdc/md/storybook/obj/1'
            }
        }
    }
};

const MEASURE_2: AFM.IMeasure = {
    localIdentifier: 'm2',
    definition: {
        measure: {
            item: {
                uri: '/gdc/md/storybook/obj/2'
            }
        }
    }
};

const ATTRIBUTE_COLOURS: AFM.IAttribute = {
    localIdentifier: 'a1',
    displayForm: {
        uri: '/gdc/md/storybook/obj/4.df'
    }
};

export const AFM_ONE_MEASURE_ONE_ATTRIBUTE: AFM.IAfm = {
    measures: [
        MEASURE_1
    ],
    attributes: [
        ATTRIBUTE_COLOURS
    ]
};

export const AFM_TWO_MEASURES: AFM.IAfm = {
    measures: [
        MEASURE_1,
        MEASURE_2
    ],
};

export const AFM_TWO_MEASURES_ONE_ATTRIBUTE: AFM.IAfm = {
    measures: [
        MEASURE_1,
        MEASURE_2
    ],
    attributes: [
        ATTRIBUTE_COLOURS
    ]
};
