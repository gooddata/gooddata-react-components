// (C) 2007-2018 GoodData Corporation
import { VisualizationObject, AFM } from '@gooddata/typings';

export const MEASURE_1: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm1',
        definition: {
            measureDefinition: {
                item: {
                    uri: '/gdc/md/storybook/obj/1'
                }
            }
        }
    }
};

export const MEASURE_2: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm2',
        definition: {
            measureDefinition: {
                item: {
                    uri: '/gdc/md/storybook/obj/2'
                }
            }
        }
    }
};

export const MEASURE_3: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm3',
        definition: {
            measureDefinition: {
                item: {
                    uri: '/gdc/md/storybook/obj/3'
                }
            }
        }
    }
};

export const MEASURE_1_POP: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm1_pop',
        definition: {
            popMeasureDefinition: {
                measureIdentifier: 'm1',
                popAttribute: {
                    uri: '/gdc/md/storybook/obj/3.df'
                }
            }
        },
        alias: 'Previous period'
    }
};

export const MEASURE_1_PREVIOUS_PERIOD: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm1_previous_period',
        definition: {
            previousPeriodMeasure: {
                measureIdentifier: 'm1',
                dateDataSets: [{
                    dataSet: {
                        uri: '/gdc/md/storybook/obj/3.df'
                    },
                    periodsAgo: 1
                }]
            }
        },
        alias: 'Previous period'
    }
};

export const MEASURE_1_WITH_ALIAS: VisualizationObject.IMeasure = {
    measure: {
        ...MEASURE_1.measure,
        alias: 'My measure alias'
    }
};

export const MEASURE_WITH_FORMAT: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm3',
        definition: {
            measureDefinition: {
                item: {
                    uri: '/gdc/md/storybook/obj/4'
                }
            }
        }
    }
};

export const MEASURE_WITH_NULLS: VisualizationObject.IMeasure = {
    measure: {
        localIdentifier: 'm4',
        definition: {
            measureDefinition: {
                item: {
                    uri: '/gdc/md/storybook/obj/9'
                }
            }
        }
    }
};

export const ATTRIBUTE_1: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a1',
        displayForm: {
            uri: '/gdc/md/storybook/obj/4.df'
        }
    }
};

export const ATTRIBUTE_1_WITH_ALIAS: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        ...ATTRIBUTE_1.visualizationAttribute,
        alias: 'My attribute alias'
    }
};

export const ATTRIBUTE_2: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a2',
        displayForm: {
            uri: '/gdc/md/storybook/obj/5.df'
        }
    }
};

export const ATTRIBUTE_3: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a3',
        displayForm: {
            uri: '/gdc/md/storybook/obj/6.df'
        }
    }
};

export const ATTRIBUTE_4: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/7.df'
        }
    }
};

export const ATTRIBUTE_5: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a5',
        displayForm: {
            uri: '/gdc/md/storybook/obj/3.df'
        }
    }
};

export const ATTRIBUTE_8: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/8.df'
        }
    }
};

export const ATTRIBUTE_9: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/9.df'
        }
    }
};

export const ATTRIBUTE_10: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/10.df'
        }
    }
};

export const ATTRIBUTE_11: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/11.df'
        }
    }
};

export const ATTRIBUTE_12: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/12.df'
        }
    }
};

export const ATTRIBUTE_13: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/13.df'
        }
    }
};

export const ATTRIBUTE_14: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/14.df'
        }
    }
};

export const ATTRIBUTE_15: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/15.df'
        }
    }
};

export const ATTRIBUTE_16: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/16.df'
        }
    }
};

export const ATTRIBUTE_17: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/17.df'
        }
    }
};

export const ATTRIBUTE_18: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/18.df'
        }
    }
};

export const ATTRIBUTE_19: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/19.df'
        }
    }
};

export const ATTRIBUTE_20: VisualizationObject.IVisualizationAttribute = {
    visualizationAttribute: {
        localIdentifier: 'a4',
        displayForm: {
            uri: '/gdc/md/storybook/obj/20.df'
        }
    }
};

export const TOTAL_M1_A1: VisualizationObject.IVisualizationTotal = {
    measureIdentifier: MEASURE_1.measure.localIdentifier,
    type: 'sum',
    attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier
};

export const TOTAL_M2_A1: VisualizationObject.IVisualizationTotal = {
    measureIdentifier: MEASURE_2.measure.localIdentifier,
    type: 'nat',
    attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier
};

export const ATTRIBUTE_1_SORT_ITEM: AFM.IAttributeSortItem = {
    attributeSortItem: {
        direction: 'asc',
        attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier
    }
};

export const MEASURE_2_SORT_ITEM: AFM.IMeasureSortItem = {
    measureSortItem: {
        direction: 'asc',
        locators: [{
            measureLocatorItem: {
                measureIdentifier: MEASURE_2.measure.localIdentifier
            }
        }]
    }
};
