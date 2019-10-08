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
