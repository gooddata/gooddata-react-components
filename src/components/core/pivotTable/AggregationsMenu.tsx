// (C) 2007-2018 GoodData Corporation
import { Header, Item, ItemsWrapper } from '@gooddata/goodstrap/lib/List/MenuList';
import { AFM, Execution } from '@gooddata/typings';
import * as classNames from 'classnames';
import * as React from 'react';
import * as invariant from 'invariant';
import uniq = require('lodash/uniq');
import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE } from '../../../helpers/agGrid';
import { IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import Menu from '../../menu/Menu';
import { IOnOpenedChangeParams } from '../../menu/MenuSharedTypes';
import SubMenu from '../../menu/SubMenu';
import { AVAILABLE_TOTALS as renderedTotalTypesOrder } from '../../visualizations/table/totals/utils';

export interface ITotalForColumn {
    type: AFM.TotalType;
    attributes: string[];
}

// TODO BB-1410 Refactor this
export function getTotalsForAttributeHeader(
    columnTotals: AFM.ITotalItem[],
    measureLocalIdentifiers: string[]
): ITotalForColumn[] {

    const turnedOnAttributes: ITotalForColumn[] = [];

    const totalsList: AFM.TotalType[] = renderedTotalTypesOrder
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
export function getTotalsForMeasureHeader(
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
export function getHeaderMeasureLocalIdentifiers(
    measureGroupHeaderItems: Execution.IMeasureHeaderItem[],
    lastFieldType: string,
    lastFieldId: string
): string[] {
    let measureLocalIdentifiers: string[] = [];

    if (lastFieldType === FIELD_TYPE_MEASURE) {
        const headerItemData: Execution.IMeasureHeaderItem['measureHeaderItem'] =
            measureGroupHeaderItems[lastFieldId].measureHeaderItem;

        const localIdentifier = headerItemData.localIdentifier;

        measureLocalIdentifiers = [localIdentifier];

    } else if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        measureLocalIdentifiers = measureGroupHeaderItems.map(i => i.measureHeaderItem.localIdentifier);
    } else {
        invariant(true, `Uknown filed type '${lastFieldType}' provided`);
    }

    return measureLocalIdentifiers;
}

export interface IAggregationsMenuProps {
    intl: ReactIntl.InjectedIntl;
    totalTypes: AFM.TotalType[];
    measureLocalIdentifiers: string[];
    enabledTotalsForColumn: ITotalForColumn[];
    rowAttributeHeaders: Execution.IAttributeHeader[];
    isMenuOpen: boolean;
    isMenuButtonVisible: boolean;
    menuItemClick: (menuAggregationClickConfig: IMenuAggregationClickConfig) => void;
    handleMenuOpenedChange: ({ opened, source }: IOnOpenedChangeParams) => void;
}

export default class AggregationsMenu extends React.Component<IAggregationsMenuProps> {
    public render() {
        return (
            <Menu
                toggler={
                    <svg className="menu-icon">
                        <g transform="translate(4 3)">
                            <path d="M0 0h8v2H0V0zm0 4h8v2H0V4zm0 4h8v2H0V8z" fill="currentColor" />
                        </g>
                    </svg>
                }
                togglerWrapperClassName={classNames('s-table-header-menu', 'gd-pivot-table-header-menu', {
                    'gd-pivot-table-header-menu--show': this.props.isMenuButtonVisible,
                    'gd-pivot-table-header-menu--hide': !this.props.isMenuButtonVisible,
                    'gd-pivot-table-header-menu--open': this.props.isMenuOpen
                })}
                opened={this.props.isMenuOpen}
                onOpenedChange={this.props.handleMenuOpenedChange}
            >
                <ItemsWrapper>
                    <div className="s-table-header-menu-content">
                        <Header>{this.props.intl.formatMessage({ id: 'visualizations.menu.aggregations' })}</Header>
                        {this.renderMenuItems()}
                    </div>
                </ItemsWrapper>
            </Menu>
        );
    }

    private renderMenuItemContent(type: AFM.TotalType, onClick: () => void, checked: boolean, subMenu = false) {
        return (
            <Item
                // Performance impact of this lambda is negligible
                // tslint:disable-next-line: jsx-no-lambda
                onClick={onClick}
                checked={checked}
                subMenu={subMenu}
                key={type}
            >
                {this.props.intl.formatMessage({ id: `visualizations.totals.dropdown.title.${type}` })}
            </Item>
        );
    }

    private renderMenuItems = () => {
        const { enabledTotalsForColumn, measureLocalIdentifiers, rowAttributeHeaders, totalTypes } = this.props;
        return totalTypes.map((type: AFM.TotalType) => {
            const isSelected = enabledTotalsForColumn.some((total: ITotalForColumn) => {
                return total.type === type;
            });
            const onClick = () => this.props.menuItemClick({
                type,
                measureIdentifiers: measureLocalIdentifiers,
                attributeIdentifier: rowAttributeHeaders[0].attributeHeader.localIdentifier,
                include: !isSelected
            });

            return (
                <div className={'s-menu-aggregation-' + type} key={type}>
                    {
                        rowAttributeHeaders.length
                        ? (
                            <SubMenu
                                toggler={this.renderMenuItemContent(type, onClick, isSelected, true)}
                                offset={-36}
                            >
                                <ItemsWrapper>
                                    <div className="s-table-header-menu-content">
                                        <Header>Rows</Header>
                                        {this.renderSubmenuItems(rowAttributeHeaders, type)}
                                    </div>
                                </ItemsWrapper>
                            </SubMenu>
                        )
                        : this.renderMenuItemContent(type, onClick, isSelected)
                    }
                </div>
            );
        });
    }

    private renderSubmenuItems(rowAttributeHeaders: Execution.IAttributeHeader[], type: AFM.TotalType) {
        const { enabledTotalsForColumn } = this.props;
        return rowAttributeHeaders.map((_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
            const attributeLocalIdentifier = rowAttributeHeaders[headerIndex].attributeHeader.localIdentifier;
            const attributeName = headerIndex === 0
                ? 'All rows'
                : rowAttributeHeaders[headerIndex - 1].attributeHeader.name;
            const isSelected = enabledTotalsForColumn.some(
                (total: ITotalForColumn) => total.type === type && total.attributes.includes(attributeLocalIdentifier)
            );
            const onClick = () => this.props.menuItemClick({
                type,
                measureIdentifiers: this.props.measureLocalIdentifiers,
                attributeIdentifier: attributeLocalIdentifier,
                include: !isSelected
            });

            return (
                <Item
                    // Performance impact of this lambda is negligible
                    // tslint:disable-next-line: jsx-no-lambda
                    onClick={onClick}
                    checked={isSelected}
                    key={attributeLocalIdentifier}
                >
                    {attributeName} ({attributeLocalIdentifier})
                </Item>
            );
        });
    }
}
