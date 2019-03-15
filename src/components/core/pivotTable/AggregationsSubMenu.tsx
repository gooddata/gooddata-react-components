// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import { AFM, Execution } from '@gooddata/typings';
import { Header, Item, ItemsWrapper } from '@gooddata/goodstrap/lib/List/MenuList';

import SubMenu from '../../menu/SubMenu';
import { IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import { ITotalForColumn } from './AggregationsMenu';

const MENU_HEADER_OFFSET = -36;

export interface IAggregationsSubMenuProps {
    intl: ReactIntl.InjectedIntl;
    type: AFM.TotalType;
    toggler: JSX.Element;
    isMenuOpened?: boolean;
    rowAttributeHeaders: Execution.IAttributeHeader[];
    measureLocalIdentifiers: string[];
    enabledTotalsForColumn: ITotalForColumn[];
    onAggregationSelect: (clickConfig: IMenuAggregationClickConfig) => void;
}

export default class AggregationsSubMenu extends React.Component<IAggregationsSubMenuProps> {
    public static defaultProps: Partial<IAggregationsSubMenuProps> = {
        isMenuOpened: false
    };

    public render() {
        const { toggler, isMenuOpened } = this.props;

        // TODO BB-1410 Ad intl ro Rows text
        return (
            <SubMenu
                toggler={toggler}
                offset={MENU_HEADER_OFFSET}
                {...(isMenuOpened ? { opened: true } : {})}
            >
                <ItemsWrapper>
                    <div className="s-table-header-submenu-content">
                        <Header>
                            <div className="submenu-header-icon">
                                <svg>
                                    <g transform="translate(4 3)">
                                        <path d="M0 0h8v2H0V0zm0 4h8v2H0V4zm0 4h8v2H0V8z" fill="currentColor" />
                                    </g>
                                </svg>
                            </div>
                            Rows
                        </Header>
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
            measureLocalIdentifiers
        } = this.props;

        return rowAttributeHeaders.map((_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
            const attributeLocalIdentifier = rowAttributeHeaders[headerIndex].attributeHeader.localIdentifier;
            const attributeName = headerIndex === 0
                ? 'All rows' // TODO BB-1410 Translation
                : rowAttributeHeaders[headerIndex - 1].attributeHeader.name;
            const isSelected = enabledTotalsForColumn.some(
                (total: ITotalForColumn) => total.type === type && total.attributes.includes(attributeLocalIdentifier)
            );
            const onClick = () => this.props.onAggregationSelect({
                type,
                measureIdentifiers: measureLocalIdentifiers,
                attributeIdentifier: attributeLocalIdentifier,
                include: !isSelected
            });

            // TODO BB-1410 Remove brackets with attribute identifier
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
