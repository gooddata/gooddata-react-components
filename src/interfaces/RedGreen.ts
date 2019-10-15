// (C) 2007-2018 GoodData Corporation
import { Execution, AFM } from "@gooddata/typings";
import { CSSProperties } from "react";

export interface IRedGreenDataItem {
    localIdentifier: AFM.Identifier;
    title?: string;
    value: string;
    format?: string;
    isDrillable?: boolean;
}

export interface IFormattedRedGreenDataItem {
    cssStyle?: CSSProperties;
    value: Execution.DataValue;
    isValueEmpty: boolean;
}

export interface IRedGreenData {
    value: string;
}
