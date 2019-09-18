// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import { SDK, factory as createSdk } from "@gooddata/gooddata-js";
import pick = require("lodash/pick");
import { AFM } from "@gooddata/typings";

import { IntlWrapper } from "../../core/base/IntlWrapper";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { AttributeDropdown, AttributeDropdownWrapped } from "./AttributeDropdown";
import { AttributeLoader, IAttributeLoaderChildrenProps } from "./AttributeLoader";
import { setTelemetryHeaders } from "../../../helpers/utils";

export interface IAttributeFilterProps {
    projectId: string;
    onApply: (...params: any[]) => any; // TODO: make the types more specific (FET-282)
    sdk?: SDK;
    // one of these three needs to be provided
    uri?: string;
    identifier?: string;
    filter?: AFM.AttributeFilterItem;
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

    private isInverted() {
        const { filter } = this.props;

        return !AFM.isPositiveAttributeFilter(filter);
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
            const displayForm = AFM.isPositiveAttributeFilter(filter)
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

    private getSelection() {
        const { filter } = this.props;
        if (filter) {
            const filterBody = AFM.isPositiveAttributeFilter(filter)
                ? filter.positiveAttributeFilter
                : filter.negativeAttributeFilter;
            const inType = AFM.isPositiveAttributeFilter(filter) ? "in" : "notIn";
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

    private renderContent({
        isLoading,
        attributeDisplayForm,
        isUsingIdentifier,
        error,
    }: IAttributeLoaderChildrenProps) {
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
                isUsingIdentifier={isUsingIdentifier}
            />
        );
    }
}
