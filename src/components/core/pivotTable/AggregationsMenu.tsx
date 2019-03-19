// (C) 2019 GoodData Corporation
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

export interface IColumnTotal {
    type: AFM.TotalType;
    attributes: string[];
}

// TODO BB-1410 move to separate file?
const getTotalTypesAppliedOnAllMeasures = (
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifiers: string[]
): AFM.TotalType[] => AVAILABLE_TOTALS.filter((type) => {
    const columnTotalsLength = columnTotals.filter((total: AFM.ITotalItem) => total.type === type).length;
    return columnTotalsLength === measureLocalIdentifiers.length;
});

// TODO BB-1410 move to separate file?
export function getTotalsForAttributeHeader(
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifiers: string[]
): IColumnTotal[] {
    const totalTypesAppliedOnAllMeasures = getTotalTypesAppliedOnAllMeasures(columnTotals, measureLocalIdentifiers);

    return totalTypesAppliedOnAllMeasures.map((totalType: AFM.TotalType) => {
        const attributeIdentifiers = columnTotals
            .filter((total: AFM.ITotalItem) => total.type === totalType)
            .map((total: AFM.ITotalItem) => total.attributeIdentifier);

        return { type: totalType, attributes: uniq(attributeIdentifiers) };
    });
}

// TODO BB-1410 move to separate file?
export function getTotalsForMeasureHeader(
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifier: string
): IColumnTotal[] {
    return columnTotals.reduce((turnedOnAttributes: IColumnTotal[], total: AFM.ITotalItem) => {
        if (total.measureIdentifier === measureLocalIdentifier) {
            const totalHeaderType = turnedOnAttributes.find(turned => turned.type === total.type);
            if (totalHeaderType === undefined) {
                turnedOnAttributes.push({
                    type: total.type,
                    attributes: [total.attributeIdentifier]
                });
            } else {
                totalHeaderType.attributes.push(total.attributeIdentifier);
            }
        }
        return turnedOnAttributes;
    }, []);
}

// TODO BB-1410 move to separate file?
export function getHeaderMeasureLocalIdentifiers(
    measureGroupHeaderItems: Execution.IMeasureHeaderItem[],
    lastFieldType: string,
    lastFieldId: string | number
): string[] {
    if (lastFieldType === FIELD_TYPE_MEASURE) {
        if (measureGroupHeaderItems.length === 0 || !measureGroupHeaderItems[lastFieldId]) {
            invariant(false, `Measure header with index ${lastFieldId} was not found`);
        }
        const { measureHeaderItem: { localIdentifier } } = measureGroupHeaderItems[lastFieldId];
        return [localIdentifier];
    } else if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        return measureGroupHeaderItems.map(i => i.measureHeaderItem.localIdentifier);
    }
    invariant(false, `Unknown filed type '${lastFieldType}' provided`);
}

export interface IAggregationsMenuProps {
    intl: ReactIntl.InjectedIntl;
    isMenuOpened: boolean;
    isMenuButtonVisible: boolean;
    showSubmenu: boolean;
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
        if (isAttributeHeader && isColumnAttribute) {
            return null;
        }

        const measureLocalIdentifiers = getHeaderMeasureLocalIdentifiers(
            measureGroupHeader.measureGroupHeader.items,
            lastFieldType,
            lastFieldId
        );

        const totalsForHeader = this.getColumnTotals(measureLocalIdentifiers, isAttributeHeader);

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
                openAction={'click'}
            >
                <ItemsWrapper>
                    <div className="s-table-header-menu-content">
                        <Header>{intl.formatMessage({ id: 'visualizations.menu.aggregations' })}</Header>
                        {this.renderMainMenuItems(totalsForHeader, measureLocalIdentifiers, rowAttributeHeaders)}
                    </div>
                </ItemsWrapper>
            </Menu>
        );
    }

    private getColumnTotals(measureLocalIdentifiers: string[], isAttributeHeader: boolean): IColumnTotal[] {
        const columnTotals = this.props.getColumnTotals() || [];

        if (isAttributeHeader) {
            return getTotalsForAttributeHeader(columnTotals, measureLocalIdentifiers);
        }

        return getTotalsForMeasureHeader(columnTotals, measureLocalIdentifiers[0]);
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
                onClick={onClick}
                checked={isSelected}
                subMenu={hasSubMenu}
            >
                {this.props.intl.formatMessage({ id: `visualizations.totals.dropdown.title.${totalType}` })}
            </Item>
        );
    }

    private getFirstAttributeIdentifier(rowAttributeHeaders: Execution.IAttributeHeader[]): string {
        return rowAttributeHeaders.length && rowAttributeHeaders[0].attributeHeader.localIdentifier;
    }

    private isItemSelected(
        totalType: AFM.TotalType,
        columnTotals: IColumnTotal[],
        firstAttributeIdentifier: string
    ): boolean {
        return columnTotals.some((total: IColumnTotal) => {
            return total.type === totalType && total.attributes.includes(firstAttributeIdentifier);
        });
    }

    private onItemClickFactory(
        totalType: AFM.TotalType,
        measureIdentifiers: string[],
        rowAttributeHeaders: Execution.IAttributeHeader[],
        isSelected: boolean
    ): () => void {
        return () => this.props.onAggregationSelect({
            type: totalType,
            measureIdentifiers,
            include: !isSelected,
            attributeIdentifier: rowAttributeHeaders[0].attributeHeader.localIdentifier
        });
    }

    private getItemClassNames(totalType: AFM.TotalType, hasSubmenu: boolean): string {
        return classNames(
            { 'gd-aggregation-submenu': hasSubmenu },
            's-menu-aggregation',
            `s-menu-aggregation-${totalType}`
        );
    }

    private renderMainMenuItems(
        columnTotals: IColumnTotal[],
        measureLocalIdentifiers: string[],
        rowAttributeHeaders: Execution.IAttributeHeader[]
    ) {
        const { intl, onAggregationSelect, showSubmenu } = this.props;
        const firstAttributeIdentifier = this.getFirstAttributeIdentifier(rowAttributeHeaders);

        return AVAILABLE_TOTALS.map((totalType: AFM.TotalType) => {
            const isSelected = this.isItemSelected(totalType, columnTotals, firstAttributeIdentifier);
            const onClick = this.onItemClickFactory(
                totalType,
                measureLocalIdentifiers,
                rowAttributeHeaders,
                isSelected
            );
            const itemClassNames = this.getItemClassNames(totalType, showSubmenu);
            const renderSubmenu = showSubmenu && rowAttributeHeaders.length > 0;
            const toggler = this.renderMenuItemContent(totalType, onClick, isSelected, renderSubmenu);

            return (
                <div className={itemClassNames} key={totalType}>
                    {
                        renderSubmenu
                            ? (
                                <AggregationsSubMenu
                                    intl={intl}
                                    totalType={totalType}
                                    rowAttributeHeaders={rowAttributeHeaders}
                                    columnTotals={columnTotals}
                                    measureLocalIdentifiers={measureLocalIdentifiers}
                                    onAggregationSelect={onAggregationSelect}
                                    toggler={toggler}
                                />
                            )
                            : toggler
                    }
                </div>
            );
        });
    }
}
