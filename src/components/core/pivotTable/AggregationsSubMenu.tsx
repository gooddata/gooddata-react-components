// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { AFM, Execution } from '@gooddata/typings';
import { Header, Item, ItemsWrapper } from '@gooddata/goodstrap/lib/List/MenuList';

import SubMenu from '../../menu/SubMenu';
import { IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import { IColumnTotals } from './AggregationsMenu';

const MENU_HEADER_OFFSET = -36;

export interface IAggregationsSubMenuProps {
    intl: ReactIntl.InjectedIntl;
    totalType: AFM.TotalType;
    toggler: JSX.Element;
    isMenuOpened?: boolean;
    rowAttributeHeaders: Execution.IAttributeHeader[];
    measureLocalIdentifiers: string[];
    columnTotals: IColumnTotals[];
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

    private getAttributeName(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        headerIndex: number
    ): string {
        return headerIndex === 0
            ? this.props.intl.formatMessage({ id: 'visualizations.menu.aggregations.all-rows' })
            : rowAttributeHeaders[headerIndex - 1].attributeHeader.name;
    }

    private isItemSelected(
        totalType: AFM.TotalType,
        attributeLocalIdentifier: string
    ): boolean {
        return this.props.columnTotals.some(
            (total: IColumnTotals) => total.type === totalType && total.attributes.includes(attributeLocalIdentifier)
        );
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
        const { totalType, rowAttributeHeaders, measureLocalIdentifiers } = this.props;

        return rowAttributeHeaders.map((_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
            const attributeLocalIdentifier = this.getAttributeLocalIdentifier(rowAttributeHeaders, headerIndex);
            const isSelected = this.isItemSelected(totalType, attributeLocalIdentifier);
            const onClick = this.onItemClickFactory(
                totalType,
                measureLocalIdentifiers,
                attributeLocalIdentifier,
                isSelected
            );
            const attributeName = this.getAttributeName(rowAttributeHeaders, headerIndex);

            return (
                <Item
                    onClick={onClick}
                    checked={isSelected}
                    key={attributeLocalIdentifier}
                >
                    {attributeName}
                </Item>
            );
        });
    }
}
