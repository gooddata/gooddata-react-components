// (C) 2019 GoodData Corporation
import { AFM, Execution } from '@gooddata/typings';
import { mount } from 'enzyme';
import * as React from 'react';
import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE } from '../../../../helpers/agGrid';
import { EXECUTION_RESPONSE_2A_3M } from '../../../visualizations/table/fixtures/2attributes3measures';
import { AVAILABLE_TOTALS } from '../../../visualizations/table/totals/utils';
import { createIntlMock } from '../../../visualizations/utils/intlUtils';
import AggregationsMenu, {
    IAggregationsMenuProps,
    getTotalsForMeasureHeader,
    getTotalsForAttributeHeader,
    getHeaderMeasureLocalIdentifiers
} from '../AggregationsMenu';
import AggregationsSubMenu from '../AggregationsSubMenu';

describe('getTotalsForMeasureHeader', () => {
    it('should return empty totals for measure when no total defined', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm2',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([]);

    });

    it('should return totals for measure when multiple totals defined', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'min',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([
            {
                type: 'sum',
                attributes: ['a1']
            },
            {
                type: 'min',
                attributes: ['a1']
            }
        ]);
    });

    it('should return total for measure when total defined for multiple attributes', () => {
        const measure = 'm1';
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a2'
            }
        ];

        expect(getTotalsForMeasureHeader(totals, measure)).toEqual([
            {
                type: 'sum',
                attributes: ['a1', 'a2']
            }
        ]);
    });
});

describe('getTotalsForAttributeHeader', () => {
    it('should return empty totals when totals are not defined for all measures', () => {
        const measures = ['m1', 'm2'];
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForAttributeHeader(totals, measures)).toEqual([]);
    });

    it('should return totals when totals are defined for all measures', () => {
        const measures = ['m1', 'm2'];
        const totals: AFM.ITotalItem[] = [
            {
                type: 'sum',
                measureIdentifier: 'm1',
                attributeIdentifier: 'a1'
            },
            {
                type: 'sum',
                measureIdentifier: 'm2',
                attributeIdentifier: 'a1'
            }
        ];

        expect(getTotalsForAttributeHeader(totals, measures)).toEqual([
            {
                type: 'sum',
                attributes: ['a1']
            }
        ]);
    });
});

describe('getHeaderMeasureLocalIdentifiers', () => {
    describe('attribute header', () => {
        const lastFieldType = FIELD_TYPE_ATTRIBUTE;
        const lastFieldId = 'whatever';

        it('should return empty list when no measure header items provided', () => {
            const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [];

            expect(getHeaderMeasureLocalIdentifiers(measureGroupHeaderItems, lastFieldType, lastFieldId)).toEqual([]);
        });

        it('should return measure identifiers when multiple measure headers provided', () => {
            const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [
                {
                    measureHeaderItem: {
                        localIdentifier: 'foo',
                        name: '',
                        format: ''
                    }
                },
                {
                    measureHeaderItem: {
                        localIdentifier: 'bar',
                        name: '',
                        format: ''
                    }
                }
            ];

            expect(getHeaderMeasureLocalIdentifiers(measureGroupHeaderItems, lastFieldType, lastFieldId)).toEqual([
                'foo',
                'bar'
            ]);
        });
    });

    describe('measure header', () => {
        const lastFieldType = FIELD_TYPE_MEASURE;
        const lastFieldId = 0;
        const measureGroupHeaderItems: Execution.IMeasureHeaderItem[] = [
            {
                measureHeaderItem: {
                    localIdentifier: 'foo',
                    name: '',
                    format: ''
                }
            },
            {
                measureHeaderItem: {
                    localIdentifier: 'bar',
                    name: '',
                    format: ''
                }
            }
        ];

        it('should throw error no measure header items provided', () => {
            expect(
                getHeaderMeasureLocalIdentifiers.bind(this, [], lastFieldType, lastFieldId)
            ).toThrowError();
        });

        it('should throw error when uknown field type provided', () => {
            expect(
                getHeaderMeasureLocalIdentifiers.bind(this, measureGroupHeaderItems, 'X', lastFieldId)
            ).toThrowError();
        });

        it('should return first measure identifier when multiple measure headers provided', () => {
            expect(
                getHeaderMeasureLocalIdentifiers(measureGroupHeaderItems, lastFieldType, lastFieldId)
            ).toEqual([
                'foo'
            ]);
        });
    });
});

describe('AggregationsMenu', () => {
    const intlMock = createIntlMock();
    const attributeColumnId = 'a_6_2-m_1';
    const getExecutionResponse = () => EXECUTION_RESPONSE_2A_3M;
    const getColumnTotals = () => [] as AFM.ITotalItem[];
    const onMenuOpenedChange = jest.fn();
    const onAggregationSelect = jest.fn();

    function render(customProps: Partial<IAggregationsMenuProps> = {}) {
        return mount(
            <AggregationsMenu
                intl={intlMock}
                isMenuOpened={true}
                isMenuButtonVisible={true}
                showSubmenu={false}
                colId={attributeColumnId}
                getExecutionResponse={getExecutionResponse}
                getColumnTotals={getColumnTotals}
                onMenuOpenedChange={onMenuOpenedChange}
                onAggregationSelect={onAggregationSelect}
                {...customProps}
            />);
    }

    it('should render opened main menu', () => {
        const wrapper = render();
        const menu = wrapper.find('.s-table-header-menu');

        expect(menu.length).toBe(1);
        expect(menu.hasClass('gd-pivot-table-header-menu--open')).toBe(true);
    });

    it('should render main menu with all total items', () => {
        const wrapper = render();

        expect(wrapper.find('.s-menu-aggregation').length).toBe(AVAILABLE_TOTALS.length);
    });

    it('should render closed main menu when isMenuOpen is set to false', () => {
        const wrapper = render({ isMenuOpened: false });

        expect(wrapper.find('.s-table-header-menu').hasClass('gd-pivot-table-header-menu--open')).toBe(false);
    });

    it('should render visible main menu button', () => {
        const wrapper = render();

        expect(wrapper.find('.s-table-header-menu').hasClass('gd-pivot-table-header-menu--show')).toBe(true);
    });

    it('should render invisible visible main menu button', () => {
        const wrapper = render({ isMenuButtonVisible: false });

        expect(wrapper.find('.s-table-header-menu').hasClass('gd-pivot-table-header-menu--hide')).toBe(true);
    });

    it('should render submenu with correct props', () => {
        const wrapper = render({ isMenuButtonVisible: false, showSubmenu: true });
        const subMenu = wrapper.find('.s-menu-aggregation-sum').find(AggregationsSubMenu);

        expect(subMenu.props()).toMatchObject({
            totalType: 'sum',
            rowAttributeHeaders: [
                expect.objectContaining({ attributeHeader: expect.anything() }),
                expect.objectContaining({ attributeHeader: expect.anything() })
            ],
            columnTotals: []
        });
    });
});
