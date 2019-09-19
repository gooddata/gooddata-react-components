// (C) 2007-2019 GoodData Corporation
declare module "*/package.json" {
    export const name: string;
    export const version: string;
}

declare module "*.svg" {
    const value: any;
    export default value;
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare module "custom-event" {
    export = CustomEvent;
}

declare module "react-day-picker/moment" {
    const formatDate: any;
    const parseDate: any;
    export { formatDate, parseDate };
}

// Mock some React types since we are supporting react@^16.5.2, but we use types for 16.0 due to inability to upgrade it
// tslint:disable-next-line:no-namespace
declare namespace React {
    type FC<P = {}> = FunctionComponent<P>;

    // tslint:disable-next-line:interface-name
    interface FunctionComponent<P = {}> {
        (props: any, context?: any): any;
        propTypes?: any;
        contextTypes?: any;
        defaultProps?: any;
        displayName?: string;
    }
}
