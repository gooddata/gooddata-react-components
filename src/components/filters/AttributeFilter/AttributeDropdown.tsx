// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import InvertableList from "@gooddata/goodstrap/lib/List/InvertableList";
import Button from "@gooddata/goodstrap/lib/Button/Button";
import Dropdown, { DropdownButton } from "@gooddata/goodstrap/lib/Dropdown/Dropdown";
import LoadingMask from "@gooddata/goodstrap/lib/core/LoadingMask";
import { string as stringUtils } from "@gooddata/js-utils";
import DataSource from "@gooddata/goodstrap/lib/DataSource/DataSource";
import { injectIntl, intlShape, InjectedIntlProps, InjectedIntl } from "react-intl";
import { IValidElementsResponse, IElement } from "@gooddata/gooddata-js";
import * as Model from "../../../helpers/model";
import * as classNames from "classnames";
import last = require("lodash/last");
import pick = require("lodash/pick");
import range = require("lodash/range");
import isEqual = require("lodash/isEqual");
import debounce = require("lodash/debounce");
import noop = require("lodash/noop");

import { AttributeFilterItem } from "./AttributeFilterItem";
import { IAttributeDisplayForm, IAttributeElement } from "./model";

const ITEM_HEIGHT = 28;
const LIST_WIDTH = 240;
const MAX_SELECTION_SIZE = 500;

export const VISIBLE_ITEMS_COUNT = 10;
const LIMIT = 50;
const INITIAL_OFFSET = 0;

const getLoadingClass = () => <LoadingMask style={{ height: 306 }} />;
const getDefaultListError = (_listError: any, { intl }: { intl: InjectedIntl }) => {
    const text = intl.formatMessage({ id: "gs.list.error" });
    return <div className="gd-message error">{text}</div>;
};

export interface IValidElementsItem {
    uri: string;
    title: string;
}

export interface IAttributeMetadata {
    getValidElements: (
        projectId: string,
        objectId: string,
        options: object,
    ) => Promise<IValidElementsResponse>;
}

export interface IAttributeDropdownProps {
    attributeDisplayForm: IAttributeDisplayForm;
    projectId: string;
    selection: IAttributeElement[];
    isInverted: boolean;
    onApply: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
    fullscreenOnMobile?: boolean;
    isUsingIdentifier: boolean;
    metadata: IAttributeMetadata;
    title?: string;

    getListItem?: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
    getListError?: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
}

export interface IAttributeDropdownStateItem {
    title: string;
    uri: string;
}

export interface IAttributeDropdownState {
    items: IAttributeDropdownStateItem[];
    totalCount?: string;
    selection: IAttributeElement[];
    prevSelection: IAttributeElement[];
    isListReady: boolean;
    isListInitialising: boolean;
    listError?: any;
    isInverted: boolean;
    wasInverted: boolean;
    filterError?: any;
    searchString?: string;
}

export function getObjectIdFromUri(uri: string) {
    return last(uri.split("/"));
}

export function getProjectIdFromUri(uri: string) {
    return uri.split("/")[3];
}

export function loadAttributeElements(
    metadata: IAttributeMetadata,
    uri: string,
    searchString: string,
    offset = INITIAL_OFFSET,
    limit = LIMIT,
) {
    const encodedSearchString = encodeURIComponent(searchString);
    const projectId = getProjectIdFromUri(uri);
    const objectId = getObjectIdFromUri(uri);
    const options = {
        limit,
        offset,
        filter: encodedSearchString,
    };

    return metadata.getValidElements(projectId, objectId, options).then((res: IValidElementsResponse) => {
        const {
            items,
            paging: { total },
        } = res.validElements;
        return {
            data: {
                offset,
                limit,
                items: items.map((item: IElement) => pick(item.element, "uri", "title")),
                totalCount: total,
            },
        };
    });
}

export function createAfmFilter(id: string, selection: IAttributeElement[], isInverted: boolean) {
    const filterFactory = isInverted ? Model.negativeAttributeFilter : Model.positiveAttributeFilter;
    return filterFactory(id, selection.map(item => item.uri));
}

export class AttributeDropdownWrapped extends React.PureComponent<
    IAttributeDropdownProps & InjectedIntlProps,
    IAttributeDropdownState
> {
    public static propTypes = {
        attributeDisplayForm: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        selection: PropTypes.array,
        isInverted: PropTypes.bool,
        isUsingIdentifier: PropTypes.bool,
        intl: intlShape.isRequired,

        onApply: PropTypes.func.isRequired,
        fullscreenOnMobile: PropTypes.bool,
        title: PropTypes.string,

        getListItem: PropTypes.func,
        getListError: PropTypes.func,

        metadata: PropTypes.shape({
            getValidElements: PropTypes.func.isRequired,
        }).isRequired,
    };

    public static defaultProps: Partial<IAttributeDropdownProps> = {
        fullscreenOnMobile: false,
        isUsingIdentifier: false,
        title: null,
        selection: new Array<IAttributeElement>(),

        getListItem: () => <AttributeFilterItem />,
        getListError: getDefaultListError,
    };

    private dataSource: any;
    private dropdownRef: any;
    private MediaQuery: (...params: any[]) => any; // TODO: make the types more specific (FET-282);

    constructor(props: IAttributeDropdownProps & InjectedIntlProps) {
        super(props);

        this.state = {
            isListInitialising: false,
            isListReady: false,
            listError: null,
            items: [],
            selection: props.selection || [],
            prevSelection: null,
            isInverted: props.isInverted !== undefined ? props.isInverted : !props.selection.length,
            wasInverted: null,
            searchString: "",
        };

        this.createMediaQuery(props.fullscreenOnMobile);

        this.onSearch = debounce(this.onSearch, 250);
    }

    public componentWillReceiveProps(nextProps: IAttributeDropdownProps) {
        if (!isEqual(nextProps.attributeDisplayForm, this.props.attributeDisplayForm)) {
            this.setupDataSource(nextProps.attributeDisplayForm.meta.uri);
        }
        if (this.props.fullscreenOnMobile !== nextProps.fullscreenOnMobile) {
            this.createMediaQuery(nextProps.fullscreenOnMobile);
        }
    }

    public render() {
        const { attributeDisplayForm, title } = this.props;
        const classes = classNames(
            "gd-attribute-filter",
            attributeDisplayForm ? `gd-id-${stringUtils.simplifyText(attributeDisplayForm.meta.title)}` : "",
        );

        return (
            <Dropdown
                button={<DropdownButton value={title || attributeDisplayForm.meta.title} />}
                ref={(ref: any) => (this.dropdownRef = ref)}
                body={this.renderList()}
                className={classes}
                onOpenStateChanged={this.onDropdownToggle}
                MediaQuery={this.MediaQuery}
            />
        );
    }

    private createMediaQuery(fullscreenOnMobile: boolean) {
        this.MediaQuery = fullscreenOnMobile
            ? undefined
            : ({
                  children,
              }: {
                  children: (...params: any[]) => any /* TODO: make the types more specific (FET-282) */;
              }) => children(false);
    }

    private backupSelection = (callback: () => any = noop) => {
        const { selection, isInverted } = this.state;
        this.setState(
            {
                prevSelection: selection,
                wasInverted: isInverted,
            },
            callback,
        );
    };

    private restoreSelection = () => {
        const { prevSelection, wasInverted } = this.state;
        this.setState({
            selection: prevSelection,
            isInverted: wasInverted,
        });
    };

    private onApply = () => {
        const { selection, isInverted } = this.state;
        const { attributeDisplayForm, isUsingIdentifier } = this.props;
        const id: string = isUsingIdentifier
            ? attributeDisplayForm.meta.identifier
            : attributeDisplayForm.meta.uri;

        this.props.onApply(createAfmFilter(id, selection, isInverted));
        this.backupSelection(() => this.dropdownRef.closeDropdown());
    };

    private onCancel = () => {
        this.restoreSelection();
        this.dropdownRef.closeDropdown();
    };

    private getAttributeElements = (uri: string) => (query: any) => {
        const { paging: { offset = 0, limit = LIMIT } = {} } = query;
        const { metadata } = this.props;
        const { searchString } = this.state;
        return loadAttributeElements(metadata, uri, searchString, offset, limit).catch((error: any) => {
            this.setState({
                isListInitialising: false,
                isListReady: false,
                listError: error,
            });
            throw error;
        });
    };

    private updateSelectionByData = (selection: IAttributeElement[], items: any[]) => {
        return selection.map(selectedItem => {
            const foundItem = items.find(
                (item: any) =>
                    (selectedItem.uri && item.uri === selectedItem.uri) ||
                    (selectedItem.title && item.title === selectedItem.title),
            );
            return foundItem || selectedItem;
        });
    };

    private setupDataSource(uri: string) {
        const request = this.getAttributeElements(uri);

        this.setState({
            isListInitialising: true,
            listError: null,
        });

        this.dataSource = new DataSource(request, request, {
            pageSize: LIMIT,
        });

        this.dataSource.onChange((result: any) => {
            const { selection, prevSelection } = this.state;
            const items = result.data.items.map((i: any) => i || { empty: true });
            const updatedSelection = this.updateSelectionByData(selection, items);
            const updatedPrevSelection = this.updateSelectionByData(prevSelection, items);

            this.setState({
                totalCount: result.data.totalCount,
                isListReady: true,
                listError: null,
                items,
                selection: updatedSelection,
                prevSelection: updatedPrevSelection,
                isListInitialising: false,
            });
        });

        this.dataSource.getData({});
    }

    private onSelect = (selection: IAttributeElement[], isInverted: boolean) => {
        this.setState({
            selection,
            isInverted,
        });
    };

    private onSearch = (searchString: string) => {
        const { attributeDisplayForm } = this.props;
        this.setState({
            searchString,
            isListReady: false,
        });
        this.setupDataSource(attributeDisplayForm.meta.uri);
    };

    private onRangeChange = (_searchString: string, from: number, to: number) => {
        range(from, to).forEach(this.dataSource.getRowAt);
    };

    private onDropdownToggle = (isDropdownOpen: boolean) => {
        const { isListReady, isListInitialising } = this.state;
        const { attributeDisplayForm } = this.props;
        if (isDropdownOpen && !isListReady && !isListInitialising) {
            this.setupDataSource(attributeDisplayForm.meta.uri);
        }
        if (isDropdownOpen) {
            this.backupSelection();
        } else {
            this.restoreSelection();
        }
    };

    private renderOverlayWrap(overlayContent: React.ReactNode, applyDisabled = false) {
        return (
            <div className="gd-attribute-filter-overlay">
                {overlayContent}
                {this.renderButtons(applyDisabled)}
            </div>
        );
    }

    private renderList() {
        const { isListReady, items, selection, listError, totalCount, searchString } = this.state;
        const { getListError } = this.props;

        if (listError) {
            return this.renderOverlayWrap(getListError(listError, this.props, this.state), true);
        }

        return this.renderOverlayWrap(
            <InvertableList
                items={items}
                itemsCount={parseInt(totalCount, 10)}
                filteredItemsCount={parseInt(totalCount, 10)}
                selection={selection}
                isInverted={this.state.isInverted}
                showSearchField={true}
                searchString={searchString}
                isLoading={!isListReady}
                isLoadingClass={getLoadingClass}
                noItemsFound={isListReady && !items.length}
                rowItem={<AttributeFilterItem />}
                maxSelectionSize={MAX_SELECTION_SIZE}
                width={LIST_WIDTH}
                itemHeight={ITEM_HEIGHT}
                height={ITEM_HEIGHT * VISIBLE_ITEMS_COUNT}
                onRangeChange={this.onRangeChange}
                onSearch={this.onSearch}
                onSelect={this.onSelect}
            />,
        );
    }

    private renderButtons(applyDisabled: boolean) {
        const { intl } = this.props;
        const cancelText = intl.formatMessage({ id: "gs.list.cancel" });
        const applyText = intl.formatMessage({ id: "gs.list.apply" });
        return (
            <div className="gd-attribute-filter-actions">
                <Button
                    className="gd-button-secondary gd-button-small cancel-button s-cancel"
                    onClick={this.onCancel}
                    value={cancelText}
                    title={cancelText}
                />
                <Button
                    disabled={applyDisabled}
                    className="gd-button-action gd-button-small s-apply"
                    onClick={this.onApply}
                    value={applyText}
                    title={applyText}
                />
            </div>
        );
    }
}

export const AttributeDropdown = injectIntl(AttributeDropdownWrapped);
