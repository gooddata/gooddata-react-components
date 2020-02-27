// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps, IntlShape } from "react-intl";

export interface ITranslationsProviderProps {
    children: any;
}

export interface ITranslationsComponentProps {
    numericSymbols: string[];
    emptyHeaderString: string;
}

export const getNumericSymbols = (intl: IntlShape): string[] => {
    return [
        "visualization.numericValues.k",
        "visualization.numericValues.m",
        "visualization.numericValues.g",
        "visualization.numericValues.t",
        "visualization.numericValues.p",
        "visualization.numericValues.e",
    ].map((id: string) => intl.formatMessage({ id }));
};

export class TranslationsProvider extends React.PureComponent<
    ITranslationsProviderProps & WrappedComponentProps
> {
    public render() {
        const props: ITranslationsComponentProps = {
            numericSymbols: getNumericSymbols(this.props.intl),
            emptyHeaderString: this.getEmptyHeaderString(),
        };
        return this.props.children(props);
    }

    private getEmptyHeaderString() {
        const emptyValueTranslation = this.props.intl.formatMessage({ id: "visualization.emptyValue" });
        return `(${emptyValueTranslation})`;
    }
}

export const IntlTranslationsProvider = injectIntl(TranslationsProvider);
