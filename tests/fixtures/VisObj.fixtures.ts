import { IVisualizationObject } from '../../src/legacy/model/VisualizationObject';

const simpleMeasure: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/metric.id',
                showInPercent: false,
                showPoP: false,
                title: 'Measure M1',
                type: 'metric'
            }
        }],
        categories: [],
        filters: []
    }
};

const filteredMeasure: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [{
                    listAttributeFilter: {
                        attribute: '/gdc/md/project/obj/attr.id',
                        displayForm: '/gdc/md/project/obj/attr.df.id',
                        default: {
                            negativeSelection: false,
                            attributeElements: [
                                '/gdc/md/project/obj/attr.id?id=1',
                                '/gdc/md/project/obj/attr.id?id=2'
                            ]
                        }
                    }
                }],
                objectUri: '/gdc/md/project/obj/metric.id',
                showInPercent: false,
                showPoP: false,
                title: 'Measure M1',
                type: 'metric'
            }
        }],
        categories: [],
        filters: []
    }
};

const factBasedMeasure: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/fact.id',
                showInPercent: false,
                showPoP: false,
                title: 'SUM of Measure M1',
                type: 'fact',
                aggregation: 'sum'
            }
        }],
        categories: [],
        filters: []
    }
};

const attributeBasedMeasure: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/attr.id',
                showInPercent: false,
                showPoP: false,
                title: 'COUNT of Measure M1',
                type: 'attribute',
                aggregation: 'count'
            }
        }],
        categories: [],
        filters: []
    }
};

const showInPercent: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/metric.id',
                showInPercent: true,
                showPoP: false,
                title: 'Measure M1',
                type: 'metric'
            }
        }],
        categories: [{
            category: {
                type: 'attribute',
                collection: 'attribute',
                displayForm: '/gdc/md/project/obj/attr.id'
            }
        }],
        filters: []
    }
};

const showInPercentWithDate: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/metric.id',
                showInPercent: true,
                showPoP: false,
                title: 'Measure M1',
                type: 'metric'
            }
        }],
        categories: [{
            category: {
                collection: 'attribute',
                displayForm: '/gdc/md/project/obj/date.id',
                type: 'date'
            }
        }],
        filters: []
    }
};

const measureWithSorting: IVisualizationObject = {
    type: 'bar',

    buckets: {
        measures: [{
            measure: {
                measureFilters: [],
                objectUri: '/gdc/md/project/obj/metric.id',
                showInPercent: false,
                showPoP: false,
                title: 'Measure M1',
                type: 'metric',
                sort: {
                    direction: 'desc',
                    sortByPoP: false
                }
            }
        }],
        categories: [],
        filters: []
    }
};

const popMeasure: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/project/obj/metric.id',
                    title: 'Measure M1',
                    measureFilters: [],
                    showInPercent: false,
                    showPoP: true,
                    sort: {
                        direction: 'desc',
                        sortByPoP: false
                    }
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'date',
                    collection: 'attribute',
                    displayForm: '/gdc/md/project/obj/attr.df.id',
                    attribute: '/gdc/md/project/obj/attr.id'
                }
            }
        ],
        filters: []
    }
};

const popMeasureWithSorting: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/project/obj/metric.id',
                    title: 'Measure M1',
                    measureFilters: [],
                    showInPercent: false,
                    showPoP: true,
                    sort: {
                        direction: 'desc',
                        sortByPoP: true
                    }
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'date',
                    collection: 'attribute',
                    displayForm: '/gdc/md/project/obj/attr.df.id',
                    attribute: '/gdc/md/project/obj/attr.id'
                }
            }
        ],
        filters: []
    }
};

const categoryWithSorting: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [],
        categories: [{
            category: {
                collection: 'attribute',
                displayForm: '/gdc/md/project/obj/attr.id',
                type: 'attribute',
                sort: 'desc'
            }
        }],
        filters: []
    }
};

const dateFilter: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [],
        categories: [],
        filters: [{
            dateFilter: {
                attribute: '/gdc/md/project/obj/attr.id',
                dataset: '/gdc/md/project/obj/dataset.id',
                from: -89,
                granularity: 'GDC.time.date',
                to: 0,
                type: 'relative'
            }
        }]
    }
};

const attributeFilter: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [],
        categories: [],
        filters: [{
            listAttributeFilter: {
                attribute: '/gdc/md/project/obj/attr.id',
                displayForm: '/gdc/md/project/obj/attr.df.id',
                default: {
                    negativeSelection: false,
                    attributeElements: [
                        '/gdc/md/project/obj/attr.id?id=1',
                        '/gdc/md/project/obj/attr.id?id=2',
                        '/gdc/md/project/obj/attr.id?id=3'
                    ]
                }
            }
        },
        {
            listAttributeFilter: {
                attribute: '/gdc/md/project/obj/attr2.id',
                displayForm: '/gdc/md/project/obj/attr2.df.id',
                default: {
                    negativeSelection: false,
                    attributeElements: []
                }
            }
        }]
    }
};

const stackingAttribute: IVisualizationObject = {
    type: 'bar',
    buckets: {
        measures: [
            {
                measure: {
                    aggregation: 'sum',
                    showInPercent: false,
                    objectUri: '/gdc/md/project/obj/metric.id',
                    showPoP: false,
                    format: '#,##0.00',
                    title: 'Sum of Bundle cost',
                    type: 'fact',
                    measureFilters: [

                    ]
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'date',
                    collection: 'attribute',
                    displayForm: '/gdc/md/project/obj/date.df.id',
                    attribute: '/gdc/md/project/obj/attr.id'
                }
            },
            {
                category: {
                    type: 'attribute',
                    collection: 'stack',
                    attribute: '/gdc/md/project/obj/attr.id',
                    displayForm: '/gdc/md/project/obj/attr.df.id'
                }
            }
        ],
        filters: [
            {
                dateFilter: {
                    type: 'relative',
                    from: -3,
                    to: 0,
                    granularity: 'GDC.time.quarter',
                    dataset: '/gdc/md/project/obj/dataset.id',
                    attribute: '/gdc/md/project/obj/attr.id'
                }
            },
            {
                listAttributeFilter: {
                    attribute: '/gdc/md/project/obj/attr.id',
                    displayForm: '/gdc/md/project/obj/attr.df.id',
                    default: {
                        negativeSelection: true,
                        attributeElements: [

                        ]
                    }
                }
            }
        ]
    }
};

export const charts = {
    bar: {
        simpleMeasure,
        filteredMeasure,
        factBasedMeasure,
        attributeBasedMeasure,
        showInPercent,
        showInPercentWithDate,
        measureWithSorting,
        popMeasure,
        popMeasureWithSorting,
        categoryWithSorting,
        dateFilter,
        attributeFilter,
        stackingAttribute
    }
};
