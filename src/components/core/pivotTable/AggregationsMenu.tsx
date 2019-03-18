// (C) 2007-2018 GoodData Corporation
import { Header, Item, ItemsWrapper } from '@gooddata/goodstrap/lib/List/MenuList';
import { AFM, Execution } from '@gooddata/typings';
import * as classNames from 'classnames';
import * as React from 'react';
import * as invariant from 'invariant';
import uniq = require('lodash/uniq');

import Menu from '../../menu/Menu';
import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE, getParsedFields } from '../../../helpers/agGrid';
import { IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import { IOnOpenedChangeParams } from '../../menu/MenuSharedTypes';
import { AVAILABLE_TOTALS } from '../../visualizations/table/totals/utils';
import AggregationsSubMenu from './AggregationsSubMenu';

export interface ITotalForColumn {
    type: AFM.TotalType;
    attributes: string[];
}

// TODO BB-1410 Refactor this
function getTotalsForAttributeHeader(
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifiers: string[]
): ITotalForColumn[] {

    const turnedOnAttributes: ITotalForColumn[] = [];

    const totalsList: AFM.TotalType[] = AVAILABLE_TOTALS
        .filter((type) => {
            // Show checkmark for attribute aggregation only if all measure
            // locale identifiers have turned on aggregation
            const columnTotalsLength =
                columnTotals.filter((total: AFM.ITotalItem) => total.type === type).length;
            return columnTotalsLength === measureLocalIdentifiers.length;
        });

    totalsList.forEach((totalType: AFM.TotalType) => {
        const attributeIdentifiers = columnTotals
            .filter((total: AFM.ITotalItem) => total.type === totalType)
            .map((total: AFM.ITotalItem) => total.attributeIdentifier);

        turnedOnAttributes.push({ type: totalType, attributes: uniq(attributeIdentifiers) });
    });

    return turnedOnAttributes;
}

// TODO BB-1410 Refactor this
function getTotalsForMeasureHeader(
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifier: string
): ITotalForColumn[] {
    const turnedOnAttributes: ITotalForColumn[] = [];

    columnTotals.forEach((total: AFM.ITotalItem) => {
        if (total.measureIdentifier === measureLocalIdentifier) {
            const totalHeaderType = turnedOnAttributes.find(turned => turned.type === total.type);
            if (!totalHeaderType) {
                turnedOnAttributes.push({
                    type: total.type,
                    attributes: [total.attributeIdentifier]
                });
            } else {
                totalHeaderType.attributes.push(total.attributeIdentifier);
            }
        }
    });

    return turnedOnAttributes;
}

// TODO BB-1410 Refactor this
function getHeaderMeasureLocalIdentifiers(
    measureGroupHeaderItems: Execution.IMeasureHeaderItem[],
    lastFieldType: string,
    lastFieldId: string | number
): string[] {
    let measureLocalIdentifiers: string[] = [];

    if (lastFieldType === FIELD_TYPE_MEASURE) {
        if (!measureGroupHeaderItems.length || !measureGroupHeaderItems[lastFieldId]) {
            invariant(false, `Measure header with index ${lastFieldId} was not found`);
        }

        const headerItemData: Execution.IMeasureHeaderItem['measureHeaderItem'] =
            measureGroupHeaderItems[lastFieldId].measureHeaderItem;
        const localIdentifier = headerItemData.localIdentifier;

        measureLocalIdentifiers = [localIdentifier];

    } else if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        measureLocalIdentifiers = measureGroupHeaderItems.map(i => i.measureHeaderItem.localIdentifier);
    } else {
        invariant(false, `Uknown filed type '${lastFieldType}' provided`);
    }

    return measureLocalIdentifiers;
}

export interface IAggregationsMenuProps {
    intl: ReactIntl.InjectedIntl;
    isMenuOpened: boolean;
    isMenuButtonVisible: boolean;
    hasSubmenu: boolean;
    colId: string;
    getExecutionResponse: () => any;
    getColumnTotals: () => any;
    onAggregationSelect: (clickConfig: IMenuAggregationClickConfig) => void;
    onMenuOpenedChange: ({ opened, source }: IOnOpenedChangeParams) => void;
}

export default class AggregationsMenu extends React.Component<IAggregationsMenuProps> {
    public render() {
        const {
            intl,
            colId,
            getExecutionResponse,
            getColumnTotals,
            isMenuOpened,
            onMenuOpenedChange
        } = this.props;

        // Because of Ag-grid react wrapper does not rerender the component when we pass
        // new gridOptions we need to pull the data manually on each render
        const executionResponse: Execution.IExecutionResponse = getExecutionResponse();
        if (!executionResponse) {
            return null;
        }

        const rowAttributeHeaders = executionResponse.dimensions[0].headers as Execution.IAttributeHeader[];
        const isOneRowTable = rowAttributeHeaders.length === 0;
        if (isOneRowTable) {
            return null;
        }

        const dimensionHeader = executionResponse.dimensions[1].headers;
        if (!dimensionHeader) {
            return null;
        }

        const measureGroupHeader = dimensionHeader[dimensionHeader.length - 1] as Execution.IMeasureGroupHeader;
        if (!measureGroupHeader || !Execution.isMeasureGroupHeader(measureGroupHeader)) {
            return null;
        }

        const fields = getParsedFields(colId);
        const [lastFieldType, lastFieldId, lastFieldValudId = null] = fields[fields.length - 1];
        const isAttributeHeader = lastFieldType === FIELD_TYPE_ATTRIBUTE;
        const isColumnAttribute = lastFieldValudId === null;
        const isMeasureHeader = lastFieldType === FIELD_TYPE_MEASURE;
        const measureLocalIdentifiers = getHeaderMeasureLocalIdentifiers(
            measureGroupHeader.measureGroupHeader.items,
            lastFieldType,
            lastFieldId
        );

        if (measureLocalIdentifiers.length === 0) {
            return null;
        }

        if (isAttributeHeader && isColumnAttribute) {
            return null;
        }

        let turnedOnAttributes: ITotalForColumn[] = [];
        const columnTotals = getColumnTotals() || [];

        if (isMeasureHeader) {
            turnedOnAttributes = getTotalsForMeasureHeader(columnTotals, measureLocalIdentifiers[0]);

        } else if (isAttributeHeader) {
            turnedOnAttributes = getTotalsForAttributeHeader(columnTotals, measureLocalIdentifiers);
        }

        return (
            <Menu
                toggler={
                    <svg className="menu-icon">
                        <g transform="translate(4 3)">
                            <path d="M0 0h8v2H0V0zm0 4h8v2H0V4zm0 4h8v2H0V8z" fill="currentColor" />
                        </g>
                    </svg>
                }
                togglerWrapperClassName={this.getTogglerClassNames()}
                opened={isMenuOpened}
                onOpenedChange={onMenuOpenedChange}
            >
                <ItemsWrapper>
                    <div className="s-table-header-menu-content">
                        <Header>{intl.formatMessage({ id: 'visualizations.menu.aggregations' })}</Header>
                        {this.renderMainMenuItems(turnedOnAttributes, measureLocalIdentifiers, rowAttributeHeaders)}
                    </div>
                </ItemsWrapper>
            </Menu>
        );
    }

    private getTogglerClassNames() {
        const { isMenuButtonVisible, isMenuOpened } = this.props;

        return classNames('s-table-header-menu', 'gd-pivot-table-header-menu', {
            'gd-pivot-table-header-menu--show': isMenuButtonVisible,
            'gd-pivot-table-header-menu--hide': !isMenuButtonVisible,
            'gd-pivot-table-header-menu--open': isMenuOpened
        });
    }

    private renderMenuItemContent(
        totalType: AFM.TotalType,
        onClick: () => void,
        isSelected: boolean,
        hasSubMenu = false
    ) {
        return (
            <Item
                // Performance impact of this lambda is negligible
                // tslint:disable-next-line: jsx-no-lambda
                onClick={onClick}
                checked={isSelected}
                subMenu={hasSubMenu}
            >
                {this.props.intl.formatMessage({ id: `visualizations.totals.dropdown.title.${totalType}` })}
            </Item>
        );
    }

    private renderMainMenuItems(
        enabledTotalsForColumn: ITotalForColumn[],
        measureLocalIdentifiers: string[],
        rowAttributeHeaders: Execution.IAttributeHeader[]
    ) {
        const { intl, onAggregationSelect, hasSubmenu } = this.props;

        return AVAILABLE_TOTALS.map((type: AFM.TotalType) => {
            const isSelected = enabledTotalsForColumn.some((total: ITotalForColumn) => {
                return total.type === type;
            });
            const onClick = () => this.props.onAggregationSelect({
                type,
                measureIdentifiers: measureLocalIdentifiers,
                attributeIdentifier: rowAttributeHeaders[0].attributeHeader.localIdentifier,
                include: !isSelected
            });
            const itemClassNames = classNames(
                { 'gd-aggregation-submenu': hasSubmenu },
                's-menu-aggregation',
                `s-menu-aggregation-${type}`
            );

            return (
                <div className={itemClassNames} key={type}>
                    {
                        hasSubmenu &&  rowAttributeHeaders.length
                            ? (
                                <AggregationsSubMenu
                                    intl={intl}
                                    type={type}
                                    rowAttributeHeaders={rowAttributeHeaders}
                                    enabledTotalsForColumn={enabledTotalsForColumn}
                                    measureLocalIdentifiers={measureLocalIdentifiers}
                                    onAggregationSelect={onAggregationSelect}
                                    toggler={this.renderMenuItemContent(type, onClick, isSelected, true)}
                                />
                            )
                            : this.renderMenuItemContent(type, onClick, isSelected)
                    }
                </div>
            );
        });
    }
}

export const TEST_API = {
    getTotalsForAttributeHeader,
    getHeaderMeasureLocalIdentifiers,
    getTotalsForMeasureHeader
};
