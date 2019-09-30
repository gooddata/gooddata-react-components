// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import pick = require("lodash/pick");
import noop = require("lodash/noop");
import { injectIntl, InjectedIntlProps } from "react-intl";
import { SDK, factory as createSdk } from "@gooddata/gooddata-js";
import { AFM, VisualizationInput } from "@gooddata/typings";

import { IntlWrapper } from "../../core/base/IntlWrapper";
import { AttributeDropdown, AttributeDropdownWrapped } from "./AttributeDropdown";
import { AttributeLoader, IAttributeLoaderChildrenProps } from "./AttributeLoader";
import { setTelemetryHeaders } from "../../../helpers/utils";
import { IAttributeElement } from "./model";
import * as Model from "../../../helpers/model";

export interface IAttributeFilterProps {
    projectId: string;
    onApply: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
    onApplyWithFilterDefinition?: (
        filter: VisualizationInput.IPositiveAttributeFilter | VisualizationInput.INegativeAttributeFilter,
    ) => void;
    sdk?: SDK;
    // one of these three needs to be provided
    uri?: string;
    identifier?: string;
    filter?: VisualizationInput.IPositiveAttributeFilter | VisualizationInput.INegativeAttributeFilter;
    locale?: string;
    fullscreenOnMobile?: boolean;
    title?: string;
    FilterLoading?: React.ComponentType<{}>;
    FilterError?: React.ComponentType<IFilterErrorProps>;
}

const DefaultFilterLoading = injectIntl(({ intl }) => {
    return (
        <button className="gd-button gd-button-secondary gd-button-small icon-right icon disabled s-button-loading">
            {intl.formatMessage({ id: "gs.filter.loading" })}
        </button>
    );
});

export interface IFilterErrorProps {
    error: string;
}
const DefaultFilterError = injectIntl(({ intl, error }: IFilterErrorProps & InjectedIntlProps) => {
    // tslint:disable-next-line:no-console
    console.error(error);
    const text = intl.formatMessage({ id: "gs.filter.error" });
    return <div className="gd-message error">{text}</div>;
});

function getElementId(element: IAttributeElement) {
    return element.uri.split("=")[1];
}

export function createOldFilterDefinition(
    id: string,
    selection: IAttributeElement[],
    isInverted: boolean,
    isUsingTextFilter: boolean = false,
) {
    return {
        id,
        type: "attribute",
        [isInverted ? "notIn" : "in"]: isUsingTextFilter
            ? selection.map(item => item.title)
            : selection.map(getElementId),
    };
}

export function createAfmFilter(
    id: string,
    selection: IAttributeElement[],
    isInverted: boolean,
    isUsingTextFilter: boolean = false,
) {
    const filterFactory = isInverted ? Model.negativeAttributeFilter : Model.positiveAttributeFilter;
    if (isUsingTextFilter) {
        return filterFactory(id, selection.map(item => item.title), true);
    }
    return filterFactory(id, selection.map(item => item.uri));
}

/**
 * AttributeFilter
 * is a component that renders a dropdown populated with attribute values
 */
export class AttributeFilter extends React.PureComponent<IAttributeFilterProps> {
    public static propTypes = {
        uri: PropTypes.string,
        identifier: PropTypes.string,
        filter: PropTypes.object,
        projectId: PropTypes.string.isRequired,
        onApply: PropTypes.func.isRequired,
        onApplyWithFilterDefinition: PropTypes.func,
        fullscreenOnMobile: PropTypes.bool,
        FilterLoading: PropTypes.func,
        FilterError: PropTypes.func,
        locale: PropTypes.string,
        title: PropTypes.string,
    };

    public static defaultProps: Partial<IAttributeFilterProps> = {
        uri: null,
        identifier: null,
        filter: null,
        locale: "en-US",

        FilterLoading: DefaultFilterLoading,
        FilterError: DefaultFilterError,
        fullscreenOnMobile: false,
        title: null,
        onApplyWithFilterDefinition: noop,
    };

    private sdk: SDK;

    constructor(props: IAttributeFilterProps) {
        super(props);

        const sdk = props.sdk || createSdk();
        this.sdk = sdk.clone();
        setTelemetryHeaders(this.sdk, "AttributeFilter", props);
    }

    public componentWillReceiveProps(nextProps: IAttributeFilterProps) {
        if (nextProps.sdk && this.sdk !== nextProps.sdk) {
            this.sdk = nextProps.sdk.clone();
            setTelemetryHeaders(this.sdk, "AttributeFilter", nextProps);
        }
    }

    public render() {
        const { locale, projectId } = this.props;
        const { md } = this.sdk;
        const { identifier, uri } = this.getIdentifierOrUri();

        return (
            <IntlWrapper locale={locale}>
                <AttributeLoader uri={uri} identifier={identifier} projectId={projectId} metadata={md}>
                    {(props: IAttributeLoaderChildrenProps) => this.renderContent(props)}
                </AttributeLoader>
            </IntlWrapper>
        );
    }

    public onApply = (selection: IAttributeElement[], isInverted: boolean) => {
        const { identifier, uri } = this.getIdentifierOrUri();
        let isUsingTextFilter = false;
        if (this.props.filter) {
            const filterBody = this.getFilterBody(this.props.filter);
            isUsingTextFilter = Boolean(filterBody.textFilter);
        }
        const id: string = identifier || uri;

        this.props.onApply(createOldFilterDefinition(id, selection, isInverted, isUsingTextFilter));
        this.props.onApplyWithFilterDefinition(createAfmFilter(id, selection, isInverted, isUsingTextFilter));
    };

    private isInverted() {
        const { filter } = this.props;

        return !VisualizationInput.isPositiveAttributeFilter(filter);
    }

    private getIdentifierOrUri() {
        const { filter, identifier, uri } = this.props;
        if ((filter && identifier) || (filter && uri) || (identifier && uri)) {
            throw new Error("Don't use multiple attribute definitions");
        }
        if (identifier || uri) {
            // tslint:disable-next-line:no-console
            console.warn(
                "Definition of an attribute using 'uri' or 'identifier' is deprecated, use 'filter' property instead. Please see the documentation of [AttributeFilter component](https://sdk.gooddata.com/gooddata-ui/docs/attribute_filter_component.html) for further details.",
            );
        }
        if (filter) {
            const displayForm = VisualizationInput.isPositiveAttributeFilter(filter)
                ? filter.positiveAttributeFilter.displayForm
                : filter.negativeAttributeFilter.displayForm;

            if (AFM.isObjIdentifierQualifier(displayForm)) {
                return { identifier: displayForm.identifier };
            }

            return { uri: displayForm.uri };
        } else if (identifier) {
            return { identifier };
        } else {
            return { uri };
        }
    }

    private getFilterBody = (
        filter: VisualizationInput.IPositiveAttributeFilter | VisualizationInput.INegativeAttributeFilter,
    ) => {
        return VisualizationInput.isPositiveAttributeFilter(filter)
            ? filter.positiveAttributeFilter
            : filter.negativeAttributeFilter;
    };

    private getSelection() {
        const { filter } = this.props;
        if (filter) {
            const filterBody = this.getFilterBody(filter);
            const inType = VisualizationInput.isPositiveAttributeFilter(filter) ? "in" : "notIn";
            const textFilter = Boolean(filterBody.textFilter);
            const selection = filterBody[inType];

            return selection
                ? selection.map((uriOrTitle: string) => ({
                      [textFilter ? "title" : "uri"]: uriOrTitle,
                  }))
                : [];
        }
        return [];
    }

    private renderContent({ isLoading, attributeDisplayForm, error }: IAttributeLoaderChildrenProps) {
        if (isLoading) {
            return <this.props.FilterLoading />;
        }
        if (error) {
            return <this.props.FilterError error={error} />;
        }

        const dropdownProps: any = pick(this.props, Object.keys(AttributeDropdownWrapped.propTypes));
        const { md } = this.sdk;
        return (
            <AttributeDropdown
                attributeDisplayForm={attributeDisplayForm}
                metadata={md}
                {...dropdownProps}
                selection={this.getSelection()}
                isInverted={this.isInverted()}
                onApply={this.onApply}
            />
        );
    }
}
