// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { IntlProvider } from "react-intl";
import { translations } from "@gooddata/js-utils";

import { DEFAULT_LOCALE } from "../../../constants/localization";

import * as enUS from "../../../translations/en-US.json";
import * as deDE from "../../../translations/de-DE.json";
import * as esES from "../../../translations/es-ES.json";
import * as frFR from "../../../translations/fr-FR.json";
import * as jaJP from "../../../translations/ja-JP.json";
import * as nlNL from "../../../translations/nl-NL.json";
import * as ptBR from "../../../translations/pt-BR.json";
import * as ptPT from "../../../translations/pt-PT.json";
import * as zhHans from "../../../translations/zh-Hans.json";

interface ITranslations {
    [key: string]: string;
}

export const messagesMap: { [locale: string]: ITranslations } = {
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
        const localeMessages = messagesMap[locale];

        return (
            <IntlProvider locale={locale} messages={localeMessages}>
                {this.props.children}
            </IntlProvider>
        );
    }
}
