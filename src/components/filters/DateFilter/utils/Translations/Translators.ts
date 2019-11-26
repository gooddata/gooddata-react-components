// (C) 2019 GoodData Corporation
import { IntlFormatters } from "react-intl";

export interface IMessageTranslator {
    formatMessage: IntlFormatters["formatMessage"];
}

export interface IDateTranslator {
    formatDate: IntlFormatters["formatDate"];
}

export interface IDateAndMessageTranslator extends IDateTranslator, IMessageTranslator {}
