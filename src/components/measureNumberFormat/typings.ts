// (C) 2020 GoodData Corporation
import * as React from "react";

export interface IFormatPreset {
    name: string;
    localIdentifier: string;
    format: string;
    previewNumber: number;
    shortFormat?: string;
    type?: PresetType;
}

export enum PresetType {
    CUSTOM_FORMAT = "customFormat",
}

export interface IToggleButtonProps {
    text: string;
    isOpened: boolean;
    toggleDropdown: (e: React.SyntheticEvent) => void;
}

export interface IFormatTemplate {
    localIdentifier: string;
    format: string;
    name: string;
}
