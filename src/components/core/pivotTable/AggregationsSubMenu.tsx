// (C) 2007-2018 GoodData Corporation
import React from "react";
import classNames from "classnames";
import { AFM, Execution } from "@gooddata/typings";
import { MenuList } from "@gooddata/goodstrap";

import { getNthAttributeLocalIdentifier, getNthAttributeName } from "../../../helpers/executionResultHelper";
import SubMenu from "../../menu/SubMenu";
import { IMenuAggregationClickConfig } from "../../../interfaces/PivotTable";
import { IColumnTotal } from "./AggregationsMenu";
import menuHelper from "./aggregationsMenuHelper";

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
        isMenuOpened: false,
    };

    public render() {
        const { toggler, isMenuOpened, intl } = this.props;
        const menuOpenedProp = isMenuOpened ? { opened: true } : {};

        return (
            <SubMenu toggler={toggler} offset={MENU_HEADER_OFFSET} {...menuOpenedProp}>
                <MenuList.ItemsWrapper>
                    <div className="gd-aggregation-submenu s-table-header-submenu-content">
                        <MenuList.Header>
                            {intl.formatMessage({ id: "visualizations.menu.aggregations.rows" })}
                        </MenuList.Header>
                        {this.renderSubMenuItems()}
                    </div>
                </MenuList.ItemsWrapper>
            </SubMenu>
        );
    }

    private getPreviousAttributeName(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        attributeHeaderIndex: number,
    ): string {
        return getNthAttributeName(rowAttributeHeaders, attributeHeaderIndex - 1);
    }

    private getAttributeName(
        rowAttributeHeaders: Execution.IAttributeHeader[],
        afmAttributeHeaderIndex: number,
    ): string {
        const { intl } = this.props;
        if (afmAttributeHeaderIndex === 0) {
            return intl.formatMessage({ id: "visualizations.menu.aggregations.all-rows" });
        }
        const attributeName = this.getPreviousAttributeName(rowAttributeHeaders, afmAttributeHeaderIndex);
        return intl.formatMessage(
            { id: "visualizations.menu.aggregations.within-attribute" },
            { attributeName },
        );
    }

    private getSubtotalNameTestClass(attributeLocalIdentifier: string) {
        const attributeClass = attributeLocalIdentifier.replace(/\./g, "-");
        return `s-aggregation-item-${attributeClass}`;
    }

    private renderSubMenuItems() {
        const { totalType, rowAttributeHeaders, measureLocalIdentifiers, columnTotals } = this.props;

        return rowAttributeHeaders.map(
            (_attributeHeader: Execution.IAttributeHeader, headerIndex: number) => {
                const attributeLocalIdentifier = getNthAttributeLocalIdentifier(
                    rowAttributeHeaders,
                    headerIndex,
                );
                const isSelected = menuHelper.isTotalEnabledForAttribute(
                    attributeLocalIdentifier,
                    totalType,
                    columnTotals,
                );
                const onClick = () =>
                    this.props.onAggregationSelect({
                        type: totalType,
                        measureIdentifiers: measureLocalIdentifiers,
                        include: !isSelected,
                        attributeIdentifier: attributeLocalIdentifier,
                    });

                const attributeName = this.getAttributeName(rowAttributeHeaders, headerIndex);
                return (
                    <MenuList.Item checked={isSelected} key={attributeLocalIdentifier}>
                        <div
                            onClick={onClick}
                            className={classNames(
                                "gd-aggregation-menu-item-inner",
                                "s-menu-aggregation-inner",
                                this.getSubtotalNameTestClass(attributeLocalIdentifier),
                                {
                                    "s-menu-aggregation-inner-selected": isSelected,
                                },
                            )}
                        >
                            {attributeName}
                        </div>
                    </MenuList.Item>
                );
            },
        );
    }
}
