// (C) 2019 GoodData Corporation
import { InjectedIntl } from "react-intl";

export type Translator = InjectedIntl;

export interface IMessageTranslator {
    formatMessage: InjectedIntl["formatMessage"];
}

export interface IDateTranslator {
    formatDate: InjectedIntl["formatDate"];
}

export interface IDateAndMessageTranslator extends IDateTranslator, IMessageTranslator {}

export const serializingTranslator: IDateAndMessageTranslator = {
    formatDate: (descriptor, options) => `${descriptor}__${JSON.stringify(options)}`,
    formatMessage: (descriptor, values) => `${descriptor.id}__${JSON.stringify(values)}`,
};
