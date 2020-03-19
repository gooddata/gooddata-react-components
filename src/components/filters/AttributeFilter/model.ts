// (C) 2007-2020 GoodData Corporation
export interface IMeta {
    title: string;
    uri: string;
    identifier: string;
}
export interface IAttributeDisplayForm {
    content: {
        formOf: string;
        expression: string[];
        default: number;
    };
    meta: IMeta;
}

export interface IAttribute {
    meta: IMeta;
}

export interface IAttributeElement {
    uri: string;
    title: string;
}
