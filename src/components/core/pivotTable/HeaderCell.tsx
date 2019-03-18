// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as classNames from 'classnames';
import { AFM, Execution } from '@gooddata/typings';

import { IMenu, IMenuAggregationClickConfig } from '../../../interfaces/PivotTable';
import { IOnOpenedChangeParams } from '../../menu/MenuSharedTypes';
import { FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE, getParsedFields } from '../../../helpers/agGrid';
import { AVAILABLE_TOTALS as renderedTotalTypesOrder } from '../../visualizations/table/totals/utils';
import AggregationsMenu, {
    getHeaderMeasureLocalIdentifiers,
    getTotalsForAttributeHeader,
    getTotalsForMeasureHeader,
    ITotalForColumn
} from './AggregationsMenu';

export type AlignPositions = 'left' | 'right' | 'center';
export const ALIGN_LEFT = 'left';
export const ALIGN_RIGHT = 'right';

export interface IProps {
    displayText: string;
    className?: string;
    enableSorting?: boolean;
    defaultSortDirection?: AFM.SortDirection;
    menuPosition?: AlignPositions;
    textAlign?: AlignPositions;
    sortDirection?: AFM.SortDirection;
    onSortClick?: (direction: AFM.SortDirection) => void;
    onMenuAggregationClick?: (config: IMenuAggregationClickConfig) => void;
    menu?: IMenu;
    getExecutionResponse?: () => Execution.IExecutionResponse;
    getColumnTotals?: () => AFM.ITotalItem[];
    colId?: string;
    intl?: ReactIntl.InjectedIntl;
}

export interface IState {
    isMenuOpen: boolean;
    isMenuButtonVisible: boolean;
    currentSortDirection: AFM.SortDirection;
}

export default class HeaderCell extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        sortDirection: null,
        textAlign: ALIGN_LEFT,
        menuPosition: ALIGN_LEFT,
        defaultSortDirection: 'desc',
        menu: null,
        enableSorting: false,
        onMenuAggregationClick: () => null,
        onSortClick: () => null
    };

    public state: IState = {
        isMenuOpen: false,
        isMenuButtonVisible: false,
        currentSortDirection: null
    };

    public componentDidMount() {
        this.setState({
            currentSortDirection: this.props.sortDirection
        });
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.sortDirection !== this.props.sortDirection) {
            this.setState({
                currentSortDirection: this.props.sortDirection
            });
        }
    }

    public render() {
        const { menuPosition, className } = this.props;

        return (
            <div
                className={classNames(
                    'gd-pivot-table-header',
                    {
                        'gd-pivot-table-header--open': this.state.isMenuButtonVisible
                    },
                    className
                )}
                onMouseEnter={this.onMouseEnterHeaderCell}
                onMouseLeave={this.onMouseLeaveHeaderCell}
            >
                {menuPosition === 'left' && this.renderMenu()}
                {this.renderText()}
                {menuPosition === 'right' && this.renderMenu()}
            </div>
        );
    }

    private renderMenu() {
        if (!this.props.menu || !this.props.menu.aggregations) {
            return null;
        }

        // Because of Ag-grid react wrapper does not rerender the component when we pass
        // new gridOptions we need to pull the data manually on each render
        const executionResponse: Execution.IExecutionResponse = this.props.getExecutionResponse();
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

        const fields = getParsedFields(this.props.colId);
        const [lastFieldType, lastFieldId, lastFieldValudId = null] = fields[fields.length - 1];
        const columnTotals = this.props.getColumnTotals() || [];
        const measureGroupHeaderItems = measureGroupHeader.measureGroupHeader.items;

        const measureLocalIdentifiers =
            getHeaderMeasureLocalIdentifiers(measureGroupHeaderItems, lastFieldType, lastFieldId);
        if (measureLocalIdentifiers.length === 0) {
            return null;
        }

        let turnedOnAttributes: ITotalForColumn[] = [];
        if (lastFieldType === FIELD_TYPE_MEASURE) {
            const measureLocalIdentifier = measureGroupHeaderItems[lastFieldId].measureHeaderItem.localIdentifier;

            turnedOnAttributes = getTotalsForMeasureHeader(columnTotals, measureLocalIdentifier);

        } else if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
            const isColumnAttribute = lastFieldValudId === null;
            if (isColumnAttribute) {
                return null;
            }

            turnedOnAttributes = getTotalsForAttributeHeader(columnTotals, measureLocalIdentifiers);
        }

        return (
            <AggregationsMenu
                intl={this.props.intl}
                totalTypes={renderedTotalTypesOrder}
                enabledTotalsForColumn={turnedOnAttributes}
                measureLocalIdentifiers={measureLocalIdentifiers}
                rowAttributeHeaders={rowAttributeHeaders}
                isMenuOpen={this.state.isMenuOpen}
                isMenuButtonVisible={this.state.isMenuButtonVisible}
                handleMenuOpenedChange={this.handleMenuOpenedChange}
                menuItemClick={this.menuItemClick}
            />
        );
    }

    private renderText() {
        const { displayText, textAlign, enableSorting } = this.props;

        const classes = classNames('s-header-cell-label', 'gd-pivot-table-header-label', {
            'gd-pivot-table-header-label--right': textAlign === 'right',
            'gd-pivot-table-header-label--center': textAlign === 'center',
            'gd-pivot-table-header-label--clickable': enableSorting
        });

        return (
            <div
                className={classes}
                onClick={this.onTextClick}
                onMouseEnter={this.onMouseEnterHeaderCellText}
                onMouseLeave={this.onMouseLeaveHeaderCellText}
            >
                <span>{displayText ? displayText : ''}</span>
                {this.renderSorting()}
            </div>
        );
    }

    private renderSorting() {
        const { enableSorting } = this.props;
        const { currentSortDirection } = this.state;

        const sortClasses = classNames('s-sort-direction-arrow', `s-sorted-${currentSortDirection}`, {
            'gd-pivot-table-header-arrow-up': currentSortDirection === 'asc',
            'gd-pivot-table-header-arrow-down': currentSortDirection === 'desc'
        });

        return currentSortDirection && enableSorting && (
            <span className="gd-pivot-table-header-next-sort">
                <span className={sortClasses} />
            </span>
        );
    }

    private onMouseEnterHeaderCell = () => {
        this.showMenuButton();
    }

    private onMouseLeaveHeaderCell = () => {
        this.hideMenuButton();
    }

    private onMouseEnterHeaderCellText = () => {
        if (this.props.enableSorting) {
            const { sortDirection } = this.props;
            if (sortDirection === null) {
                return this.setState({
                    currentSortDirection: this.props.defaultSortDirection
                });
            } else if (sortDirection === 'asc') {
                return this.setState({
                    currentSortDirection: 'desc'
                });
            } else if (sortDirection === 'desc') {
                return this.setState({
                    currentSortDirection: 'asc'
                });
            } else {
                return this.setState({
                    currentSortDirection: null
                });
            }
        }
    }

    private onMouseLeaveHeaderCellText = () => {
        this.setState({
            currentSortDirection: this.props.sortDirection
        });
    }

    private onTextClick = () => {
        const { sortDirection, onSortClick, enableSorting, defaultSortDirection } = this.props;

        if (!enableSorting) {
            return;
        }
        if (sortDirection === null) {
            const nextSortDirection = defaultSortDirection;
            this.setState({
                currentSortDirection: nextSortDirection
            });
            onSortClick(nextSortDirection);
            return;
        }

        const nextSort = sortDirection === 'asc' ? 'desc' : 'asc';
        this.setState({
            currentSortDirection: nextSort
        });
        onSortClick(nextSort);
    }

    private showMenuButton = () => {
        if (this.state.isMenuOpen) {
            return;
        }

        this.setState({
            isMenuButtonVisible: true
        });
    }

    private hideMenuButton = () => {
        if (this.state.isMenuOpen) {
            return;
        }

        this.setState({
            isMenuButtonVisible: false
        });
    }

    private hideAndCloseMenu = () => {
        this.setState({
            isMenuButtonVisible: false,
            isMenuOpen: false
        });
    }

    private menuItemClick = (menuAggregationClickConfig: IMenuAggregationClickConfig) => {
        this.hideAndCloseMenu();
        if (this.props.onMenuAggregationClick) {
            this.props.onMenuAggregationClick(menuAggregationClickConfig);
        }
    }

    private handleMenuOpenedChange = ({ opened, source }: IOnOpenedChangeParams) => {
        this.setState({
            isMenuOpen: opened
        });

        // When source is 'TOGGLER_BUTTON_CLICK' we do not want to hide menu
        // button visibility. Because user is hovering over this button
        // so we do not want to hide it.
        if (source === 'OUTSIDE_CLICK' || source === 'SCROLL') {
            this.setState({
                isMenuButtonVisible: false
            });
        }
    }
}
