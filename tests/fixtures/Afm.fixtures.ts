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
                id: 'm2',
                definition: {
                    baseObject: {
                        lookupId: 'm1'
                    },
                    popAttribute: {
                        id: '/gdc/md/project/obj/attr.id'
                    }
                }
            }
        ],
        attributes: [
            {
                id: '/gdc/md/project/obj/attr.id'
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
               id: 'm2',
               title: 'Measure M2'
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
                id: 'm2',
                definition: {
                    baseObject: {
                        lookupId: 'm1'
                    },
                    popAttribute: {
                        id: '/gdc/md/project/obj/attr.id'
                    }
                }
            }
        ],
        attributes: [
            {
                id: '/gdc/md/project/obj/attr.id'
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
                id: 'm2',
                title: 'Measure M2'
            }
        ],

        sorting: [
            { column: 'm2', direction: 'desc' }
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
                id: '/gdc/md/project/obj/attr.id'
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
                id: '/gdc/md/project/obj/date.id'
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
            { id: '/gdc/md/project/obj/attr.id' }
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
                    aggregation: 'SUM'
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
                    aggregation: 'COUNT'
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
