import { IAfm } from '../../src/interfaces/Afm';
import { ITransformation } from '../../src/interfaces/Transformation';

interface IFixture {
    afm: IAfm;
    transformation: ITransformation;
}

export const empty: IFixture = {
    afm: {},

    transformation: {}
};

export const simpleMeasure: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    }
                }
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            }
        ]
    }
};

export const filteredMeasure: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    },
                    filters: [
                        {
                            id: '/gdc/md/project/obj/attr.df.id',
                            in: [
                                '1', '2'
                            ]
                        }
                    ]
                }
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            }
        ]
    }
};

export const popMeasure: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    }
                }
            },
            {
                id: 'm1_pop',
                definition: {
                    baseObject: {
                        lookupId: 'm1'
                    },
                    popAttribute: {
                        id: '/gdc/md/project/obj/attr.df.id'
                    }
                }
            }
        ],
        attributes: [
            {
                id: '/gdc/md/project/obj/attr.df.id',
                type: 'date'
            }
        ]
    },

    transformation: {
       measures: [
           {
               id: 'm1',
               title: 'Measure M1'
           },
           {
               id: 'm1_pop',
               title: 'Measure M1 - previous year'
           }
       ],

        sorting: [
            { column: 'm1', direction: 'desc' }
        ]
    }
};

export const popMeasureWithSorting: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    }
                }
            },
            {
                id: 'm1_pop',
                definition: {
                    baseObject: {
                        lookupId: 'm1'
                    },
                    popAttribute: {
                        id: '/gdc/md/project/obj/attr.df.id'
                    }
                }
            }
        ],
        attributes: [
            {
                id: '/gdc/md/project/obj/attr.df.id',
                type: 'date'
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            },
            {
                id: 'm1_pop',
                title: 'Measure M1 - previous year'
            }
        ],

        sorting: [
            {
                column: 'm1_pop',
                direction: 'desc'
            }
        ]
    }
};

export const showInPercent: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    },
                    showInPercent: true
                }
            }
        ],

        attributes: [
            {
                id: '/gdc/md/project/obj/attr.id',
                type: 'attribute'
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            }
        ]
    }
};

export const showInPercentWithDate: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    },
                    showInPercent: true
                }
            }
        ],

        attributes: [
            {
                id: '/gdc/md/project/obj/date.id',
                type: 'date'
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            }
        ]
    }
};

export const measureWithSorting: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    }
                }
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'Measure M1'
            }
        ],
        sorting: [
            { column: 'm1', direction: 'desc' }
        ]
    }
};

export const categoryWithSorting: IFixture = {
    afm: {
        attributes: [
            {
                id: '/gdc/md/project/obj/attr.id',
                type: 'attribute'
            }
        ]
    },

    transformation: {
        sorting: [
            { column: '/gdc/md/project/obj/attr.id', direction: 'desc' }
        ]
    }
};

export const factBasedMeasure: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/fact.id'
                    },
                    aggregation: 'sum'
                }
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'SUM of Measure M1'
            }
        ]
    }
};

export const attributeBasedMeasure: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: '/gdc/md/project/obj/attr.id'
                    },
                    aggregation: 'count'
                }
            }
        ]
    },

    transformation: {
        measures: [
            {
                id: 'm1',
                title: 'COUNT of Measure M1'
            }
        ]
    }
};

export const stackingAttribute: IFixture = {
    afm: {
        measures: [
            {
                id: 'm1',
                definition: {
                    aggregation: 'sum',
                    baseObject: {
                        id: '/gdc/md/project/obj/metric.id'
                    }
                }
            }
        ],
        attributes: [
            {
                id: '/gdc/md/project/obj/date.df.id',
                type: 'date'
            },
            {
                id: '/gdc/md/project/obj/attr.df.id',
                type: 'attribute'
            }
        ],
        filters: [
            {
                between: [-3, 0],
                granularity: 'quarter',
                id: '/gdc/md/project/obj/dataset.id',
                type: 'date'
            },
            {
                id: '/gdc/md/project/obj/attr.df.id',
                type: 'attribute',
                notIn: []
            }
        ]
    },

    transformation: {
        measures: [
            { id: 'm1', title: 'Sum of Bundle cost', format: '#,##0.00' }
        ],
        buckets: [
            {
                name: 'stacks',
                attributes: [
                    {
                        id: '/gdc/md/project/obj/attr.df.id'
                    }
                ]
            }
        ]
    }
};

export const attributeFilter: IFixture = {
    afm: {
        filters: [{
            id: '/gdc/md/project/obj/attr.df.id',
            type: 'attribute',
            in: [
                '1', '2', '3'
            ]
        }, {
            id: '/gdc/md/project/obj/attr2.df.id',
            type: 'attribute',
            in: []
        }]
    },
    transformation: {}
};

export const dateFilter: IFixture = {
    afm: {
        filters: [{
            id: '/gdc/md/project/obj/dataset.id',
            type: 'date',
            between: [-89, 0],
            granularity: 'date'
        }]
    },
    transformation: {}
};
