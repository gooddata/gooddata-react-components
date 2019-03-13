// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { AFM, Execution } from '@gooddata/typings';
import { Header, Item, ItemsWrapper } from '@gooddata/goodstrap/lib/List/MenuList';

import SubMenu from '../../menu/SubMenu';
import { IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import { IColumnTotal } from './AggregationsMenu';
import menuHelper from './aggregationsMenuHelper';

const MENU_HEADER_OFFSET = -36;

export interface IAggregationsSubMenuProps {
    intl: ReactIntl.InjectedIntl;
    totalType: AFM.TotalType;
    toggler: JSX.Element;
    isMenuOpened?: boolean;
    rowAttributeHeaders: Execution.IAttributeHeader[];
    measureLocalIdentifiers: string[];
    columnTotals: IColumnTotal[];
    onAggregationSelect: (clickConfig: IMenuAggregationClickConfig) => void;
}

export default class AggregationsSubMenu extends React.Component<IAggregationsSubMenuProps> {
    public static defaultProps: Partial<IAggregationsSubMenuProps> = {
        isMenuOpened: false
    };

    public render() {
        const { toggler, isMenuOpened, intl } = this.props;
        const menuOpenedProp = isMenuOpened ? { opened: true } : {};

        return (
            <SubMenu
                toggler={toggler}
                offset={MENU_HEADER_OFFSET}
                {...menuOpenedProp}
            >
                <ItemsWrapper>
                    <div className="s-table-header-submenu-content">
                        <Header>{intl.formatMessage({ id: 'visualizations.menu.aggregations.rows' })}</Header>
                        {this.renderSubMenuItems()}
                    </div>
                </ItemsWrapper>
            </SubMenu>
        );
    }

    private getAttributeLocalIdentifier(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        headerIndex: number
    ): string {
        return rowAttributeHeaders[headerIndex].attributeHeader.localIdentifier;
    }

    private getPreviousAttributeName(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        attributeHeaderIndex: number
    ): string {
        return rowAttributeHeaders[attributeHeaderIndex - 1].attributeHeader.name;
    }

    private getAttributeName(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        afmAttributeHeaderIndex: number
    ): string {
        return afmAttributeHeaderIndex === 0
            ? this.props.intl.formatMessage({ id: 'visualizations.menu.aggregations.all-rows' })
            // subtotals are presented differently to the user and in AFM (menu displays the previous attribute name)
            : this.getPreviousAttributeName(rowAttributeHeaders, afmAttributeHeaderIndex);
    }

    private onItemClickFactory(
        totalType: AFM.TotalType,
        measureIdentifiers: string[],
        attributeLocalIdentifier: string,
        isSelected: boolean
    ): () => void {
        return () => this.props.onAggregationSelect({
            type: totalType,
            measureIdentifiers,
            include: !isSelected,
            attributeIdentifier: attributeLocalIdentifier
        });
    }

    private renderSubMenuItems() {
        const { totalType, rowAttributeHeaders, measureLocalIdentifiers, columnTotals } = this.props;

        return rowAttributeHeaders.map((_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
            const attributeLocalIdentifier = this.getAttributeLocalIdentifier(rowAttributeHeaders, headerIndex);
            const isSelected = menuHelper.isTotalEnabledForAttribute(attributeLocalIdentifier, totalType, columnTotals);
            const onClick = this.onItemClickFactory(
                totalType,
                measureLocalIdentifiers,
                attributeLocalIdentifier,
                isSelected
            );
            const attributeName = this.getAttributeName(rowAttributeHeaders, headerIndex);

            return (
                <Item
                    checked={isSelected}
                    key={attributeLocalIdentifier}
                >
                    <div
                        onClick={onClick}
                        className="gd-aggregation-menu-item-inner"
                    >
                        {attributeName}
                    </div>
                </Item>
            );
        });
    }
}
