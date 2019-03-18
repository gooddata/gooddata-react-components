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
    type: AFM.TotalType;
    toggler: JSX.Element;
    isMenuOpened?: boolean;
    rowAttributeHeaders: Execution.IAttributeHeader[];
    measureLocalIdentifiers: string[];
    enabledTotalsForColumn: IColumnTotals[];
    onAggregationSelect: (clickConfig: IMenuAggregationClickConfig) => void;
}

export default class AggregationsSubMenu extends React.Component<IAggregationsSubMenuProps> {
    public static defaultProps: Partial<IAggregationsSubMenuProps> = {
        isMenuOpened: false
    };

    public render() {
        const { toggler, isMenuOpened, intl } = this.props;

        return (
            <SubMenu
                toggler={toggler}
                offset={MENU_HEADER_OFFSET}
                {...(isMenuOpened ? { opened: true } : {})}
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

    private renderSubMenuItems() {
        const {
            type,
            rowAttributeHeaders,
            enabledTotalsForColumn,
            measureLocalIdentifiers,
            intl
        } = this.props;

        return rowAttributeHeaders.map((_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
            const attributeLocalIdentifier = rowAttributeHeaders[headerIndex].attributeHeader.localIdentifier;
            const attributeName = headerIndex === 0
                ? intl.formatMessage({ id: 'visualizations.menu.aggregations.all-rows' })
                : rowAttributeHeaders[headerIndex - 1].attributeHeader.name;
            const isSelected = enabledTotalsForColumn.some(
                (total: IColumnTotals) => total.type === type && total.attributes.includes(attributeLocalIdentifier)
            );
            const onClick = () => this.props.onAggregationSelect({
                type,
                measureIdentifiers: measureLocalIdentifiers,
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
                    {attributeName}
                </Item>
            );
        });
    }
}
