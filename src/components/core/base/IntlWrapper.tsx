// (C) 2007-2019 GoodData Corporation
import React from "react";
import { IntlProvider, addLocaleData } from "react-intl";
import { translations } from "@gooddata/js-utils";
import { DEFAULT_LOCALE } from "../../../constants/localization";

import deLocaleData from "react-intl/locale-data/de";
import esLocaleData from "react-intl/locale-data/es";
import enLocaleData from "react-intl/locale-data/en";
import frLocaleData from "react-intl/locale-data/fr";
import jaLocaleData from "react-intl/locale-data/ja";
import nlLocaleData from "react-intl/locale-data/nl";
import ptLocaleData from "react-intl/locale-data/pt";
import zhLocaleData from "react-intl/locale-data/zh";

addLocaleData([
    ...deLocaleData,
    ...esLocaleData,
    ...enLocaleData,
    ...frLocaleData,
    ...jaLocaleData,
    ...nlLocaleData,
    ...ptLocaleData,
    ...zhLocaleData,
]);

import enUS from "../../../translations/en-US.json";
import deDE from "../../../translations/de-DE.json";
import esES from "../../../translations/es-ES.json";
import frFR from "../../../translations/fr-FR.json";
import jaJP from "../../../translations/ja-JP.json";
import nlNL from "../../../translations/nl-NL.json";
import ptBR from "../../../translations/pt-BR.json";
import ptPT from "../../../translations/pt-PT.json";
import zhHans from "../../../translations/zh-Hans.json";

export const messagesMap = {
    "en-US": translations.removeMetadata(enUS),
    "de-DE": deDE,
    "es-ES": esES,
    "fr-FR": frFR,
    "ja-JP": jaJP,
    "nl-NL": nlNL,
    "pt-BR": ptBR,
    "pt-PT": ptPT,
    "zh-Hans": zhHans,
};

export interface IIntlWrapperProps {
    locale: string;
}

export class IntlWrapper extends React.PureComponent<IIntlWrapperProps> {
    public static defaultProps: IIntlWrapperProps = {
        locale: DEFAULT_LOCALE,
    };
    public render() {
        const { locale } = this.props;
        return (
            <IntlProvider locale={locale} messages={messagesMap[locale]}>
                {this.props.children}
            </IntlProvider>
        );
    }
}
