import {
    lookupAttributes,
    normalizeAfm,
    generateMetricDefinition,
    generateFilters,
    generateSorting,
    getMeasureAdditionalInfo
} from '../../src/adapters/utils';
import { IAfm, IFilter } from '../../src/interfaces/Afm';
import { ITransformation } from '../../src/interfaces/Transformation';

describe('lookupAttributes', () => {
    it('should extract displayForm from showInPercent', () => {
        const showInPercentAfm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/close_bop'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/date_display_form'
                }
            ]
        };

        expect(lookupAttributes(showInPercentAfm)).toEqual([
            '/gdc/md/date_display_form'
        ]);
    });

    it('should extract displayForm from PoP', () => {
        const simplePopAfm: IAfm = {
            measures: [
                {
                    id: 'close_bop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/close_bop'
                        }
                    }
                },
                {
                    id: 'close_bop_pop',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/close_bop'
                        },
                        popAttribute: {
                            id: '/gdc/md/date_display_form'
                        }
                    }
                }
            ]
        };

        expect(lookupAttributes(simplePopAfm)).toEqual([
            '/gdc/md/date_display_form'
        ]);
    });

    it('should extract displayForm from metric filters', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'measure_with_filter',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/close_bop'
                        },
                        filters: [{
                            id: '/gdc/md/attr_display_form',
                            in: [
                                '/gdc/md/attr?id=1',
                                '/gdc/md/attr?id=2'
                            ]
                        }]
                    }
                }
            ]
        };

        expect(lookupAttributes(afm)).toEqual([
            '/gdc/md/attr_display_form'
        ]);
    });

    it('should not extract displayForm for simple AFM', () => {
        const simpleAfm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/md/close_bop/percent'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/md/date_display_form'
                }
            ]
        };

        expect(lookupAttributes(simpleAfm)).toEqual([]);
    });
});

describe('normalizeAfm', () => {
    it('should add optional arrays', () => {
        const afm: IAfm = {};
        expect(normalizeAfm(afm)).toEqual({
            measures: [],
            attributes: [],
            filters: []
        });

        expect(normalizeAfm({
            attributes: [
                {
                    id: '1'
                }
            ]
        })).toEqual({
            attributes: [
                {
                    id: '1'
                }
            ],
            measures: [],
            filters: []
        });

        expect(normalizeAfm({
            measures: [
                {
                    id: '1',
                    definition: {
                        baseObject: {
                            id: '/uri'
                        }
                    }
                }
            ]
        })).toEqual({
            measures: [
                {
                    id: '1',
                    definition: {
                        baseObject: {
                            id: '/uri'
                        }
                    }
                }
            ],
            attributes: [],
            filters: []
        });

        expect(normalizeAfm({
            filters: [
                {
                    id: '1',
                    type: 'date',
                    between: [0, 1]
                }
            ]
        })).toEqual({
            attributes: [],
            measures: [],
            filters: [
                {
                    id: '1',
                    type: 'date',
                    between: [0, 1]
                }
            ]
        });
    });
});

describe('generateMetricDefinition', () => {
    it('should generate metric with aggregation', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_sum',
                definition: {
                    baseObject: {
                        id: '/gdc/measure'
                    },
                    aggregation: 'sum'
                }
            }]
        };
        expect(generateMetricDefinition(afm.measures[0], afm, [])).toEqual(
            'SELECT SUM([/gdc/measure])'
        );
    });

    it('should generate metric with empty filter', () => {
        const afm: IAfm = {
            measures: [{
                id: 'metric_empty_filter',
                definition: {
                    baseObject: {
                        id: '/gdc/measure'
                    },
                    filters: [
                        {
                            id: '/uri',
                            in: []
                        }
                    ]
                }
            }]
        };
        expect(generateMetricDefinition(afm.measures[0], afm, [])).toEqual(
            'SELECT [/gdc/measure]'
        );
    });

    it('should generate metric with filters', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'metric_with_filters',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        },
                        filters: [{
                            id: '/gdc/filter_attr_display_form1',
                            in: [
                                '1',
                                '2'
                            ]
                        }, {
                            id: '/gdc/filter_attr_display_form2',
                            in: [
                                '1',
                                '2'
                            ]
                        }]
                    }
                }
            ]
        };
        const mapping = [
            {
                attribute: '/gdc/filter_attr1',
                attributeDisplayForm: '/gdc/filter_attr_display_form1'
            },
            {
                attribute: '/gdc/filter_attr2',
                attributeDisplayForm: '/gdc/filter_attr_display_form2'
            }
        ];
        expect(generateMetricDefinition(afm.measures[0], afm, mapping)).toEqual(
            'SELECT [/gdc/measure] ' +
            'WHERE [/gdc/filter_attr1] ' +
            'IN ([/gdc/filter_attr1/elements?id=1],[/gdc/filter_attr1/elements?id=2]) ' +
            'AND [/gdc/filter_attr2] ' +
            'IN ([/gdc/filter_attr2/elements?id=1],[/gdc/filter_attr2/elements?id=2])'
        );
    });

    it('should generate PoP', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'm1',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        }
                    }
                },
                {
                    id: 'close_bop_pop',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        },
                        popAttribute: {
                            id: '/gdc/date_display_form'
                        }
                    }
                }
            ],
            attributes: [

            ]
        };
        const mapping = [
            {
                attribute: '/gdc/date_attribute',
                attributeDisplayForm: '/gdc/date_display_form'
            }
        ];
        expect(generateMetricDefinition(afm.measures[1], afm, mapping)).toEqual(
            'SELECT [/gdc/measure] FOR PREVIOUS ([/gdc/date_attribute])'
        );
    });

    it('should generate showInPercent', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        },
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/attribute_display_form'
                }
            ]
        };

        const mapping = [
            {
                attribute: '/gdc/attribute',
                attributeDisplayForm: '/gdc/attribute_display_form'
            }
        ];

        expect(generateMetricDefinition(afm.measures[0], afm, mapping)).toEqual(
            'SELECT (SELECT [/gdc/measure]) / (SELECT [/gdc/measure] BY ALL [/gdc/attribute])'
        );
    });

    it('should generate showInPercent with filters', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'close_bop_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        },
                        filters: [{
                            id: '/gdc/filter_attr_display_form',
                            in: [
                                '1',
                                '2'
                            ]
                        }],
                        showInPercent: true
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/attribute_display_form'
                }
            ]
        };

        const mapping = [
            {
                attribute: '/gdc/attribute',
                attributeDisplayForm: '/gdc/attribute_display_form'
            },
            {
                attribute: '/gdc/filter_attr',
                attributeDisplayForm: '/gdc/filter_attr_display_form'
            }
        ];

        expect(generateMetricDefinition(afm.measures[0], afm, mapping)).toEqual(
            'SELECT ' +
            '(SELECT [/gdc/measure] ' +
                'WHERE [/gdc/filter_attr] ' +
                'IN ([/gdc/filter_attr/elements?id=1],[/gdc/filter_attr/elements?id=2])) ' +
            '/ ' +
            '(SELECT [/gdc/measure] ' +
                'BY ALL [/gdc/attribute] ' +
                'WHERE [/gdc/filter_attr] ' +
                'IN ([/gdc/filter_attr/elements?id=1],[/gdc/filter_attr/elements?id=2]))'
        );
    });

    it('should generate PoP & showInPercent (referenced definitions)', () => {
        const afm: IAfm = {
            measures: [
                {
                    id: 'measure_in_percent',
                    definition: {
                        baseObject: {
                            id: '/gdc/measure'
                        },
                        showInPercent: true
                    }
                },
                {
                    id: 'measure_pop',
                    definition: {
                        baseObject: {
                            lookupId: 'measure_in_percent'
                        },
                        popAttribute: {
                            id: '/gdc/attribute_display_form'
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '/gdc/attribute_display_form'
                }
            ]
        };

        const mapping = [
            {
                attribute: '/gdc/attribute',
                attributeDisplayForm: '/gdc/attribute_display_form'
            }
        ];

        expect(generateMetricDefinition(afm.measures[0], afm, mapping)).toEqual(
            'SELECT (SELECT [/gdc/measure]) / (SELECT [/gdc/measure] BY ALL [/gdc/attribute])'
        );
        expect(generateMetricDefinition(afm.measures[1], afm, mapping)).toEqual(
            'SELECT (SELECT (SELECT [/gdc/measure]) ' +
            '/ (SELECT [/gdc/measure] BY ALL [/gdc/attribute])) FOR PREVIOUS ([/gdc/attribute])'
        );
    });
});

describe('generateSorting', () => {
    it('should generate sorting from transformation', () => {
        const transformation: ITransformation = {
            sorting: [
                {
                    column: '/gdc/md/column1',
                    direction: 'desc'
                },
                {
                    column: '/gdc/md/column2',
                    direction: 'asc'
                }
            ]
        };

        expect(generateSorting(transformation)).toEqual([
            {
                column: '/gdc/md/column1',
                direction: 'desc'
            }, {
                column: '/gdc/md/column2',
                direction: 'asc'
            }
        ]);
    });
});

describe('getMeasureAdditionalInfo', () => {
    it('should generate measure info with titles and formats', () => {
        const transformation: ITransformation = {
            measures: [
                {
                    id: 'a',
                    title: 'A',
                    format: 'fA'
                },
                {
                    id: 'b',
                    title: 'B',
                    format: 'fB'
                }
            ]
        };

        expect(getMeasureAdditionalInfo(transformation, 'a')).toEqual({
            title: 'A',
            format: 'fA'
        });

        expect(getMeasureAdditionalInfo(transformation, 'b')).toEqual({
            title: 'B',
            format: 'fB'
        });
    });
});

describe('generateFilters', () => {
    it('should generate date and attribute filters', () => {
        const afm: IAfm = {
            filters: [
                {
                    id: '/gdc/datefilter',
                    type: 'date',
                    between: [0, 12],
                    granularity: 'year'
                },
                {
                    id: '/gdc/attribute1',
                    type: 'attribute',
                    in: [
                        'a',
                        'b'
                    ]
                },
                {
                    id: '/gdc/attribute2',
                    type: 'attribute',
                    notIn: [
                        'c',
                        'd'
                    ]
                }
            ]
        };

        expect(generateFilters(afm)).toEqual(
            {
                '$and': [{
                    '/gdc/attribute1': {
                        $in: [{
                            id: 'a'
                        }, {
                            id: 'b'
                        }]
                    }
                }, {
                    '/gdc/attribute2': {
                        $not: {
                            $in: [{
                                id: 'c'
                            }, {
                                id: 'd'
                            }]
                        }
                    }
                }],
                '/gdc/datefilter': {
                    $between: [0, 12],
                    $granularity: 'GDC.time.year'
                }
            }
        );
    });
});
