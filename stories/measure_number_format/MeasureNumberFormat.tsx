// (C) 2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ISeparators } from "@gooddata/numberjs";
import { screenshotWrap } from "@gooddata/test-storybook";

import {
    IFormatPreset,
    IToggleButtonProps,
    PresetType,
} from "../../src/components/measureNumberFormat/typings";
import { screenshotTarget } from "../utils/wrap";
import {
    MeasureNumberFormat,
    CUSTOM_FORMAT_PRESET_LOCAL_IDENTIFIER,
} from "../../src/components/measureNumberFormat/MeasureNumberFormat";
import { PresetsDropdown } from "../../src/components/measureNumberFormat/presetsDropdown/PresetsDropdown";
import { IFormatTemplate } from "../../src/components/measureNumberFormat/customFormatDialog/formatTemplatesDropdown/FormatTemplatesDropdown";
import { createIntlMock } from "../../src/components/visualizations/utils/intlUtils";
import { CustomFormatDialog } from "../../src/components/measureNumberFormat/customFormatDialog/CustomFormatDialog";
import { IntlWrapper } from "../../src/components/core/base/IntlWrapper";

const intlMock = createIntlMock();

const customPreset: IFormatPreset = {
    name: intlMock.formatMessage({ id: "measureNumberFormat.custom.optionLabel" }),
    localIdentifier: CUSTOM_FORMAT_PRESET_LOCAL_IDENTIFIER,
    format: null,
    previewNumber: null,
    type: PresetType.CUSTOM_FORMAT,
};

const documentationLink =
    "https://help.gooddata.com/doc/en/reporting-and-dashboards/reports/working-with-reports/formatting-numbers-in-reports";

const presets: IFormatPreset[] = [
    {
        name: "Whole number",
        localIdentifier: "whole-number",
        format: "#,##0",
        previewNumber: 1000.12,
    },
    {
        name: "Decimal number",
        localIdentifier: "decimal-number",
        format: "[=null]--;\n" + "[<.3][red]#,##0.00;\n" + "[>.8][green]#,##0.00;\n" + "#,##0.00",
        previewNumber: 1000.12,
    },
    {
        name: "Percentage",
        localIdentifier: "percentage",
        format: "#,##0.0%",
        previewNumber: 1000.12,
    },
    {
        name: "Currency",
        localIdentifier: "currency",
        format: "€ #,##0.0",
        previewNumber: 1000.12,
    },
];

const templates: IFormatTemplate[] = [
    {
        name: "Whole number",
        localIdentifier: "whole-number",
        format: "#,##0",
    },
    {
        name: "Decimal number",
        localIdentifier: "decimal-number",
        format: "[=null]--;\n" + "[<.3][red]#,##0.00;\n" + "[>.8][green]#,##0.00;\n" + "#,##0.00",
    },
    {
        name: "Percentage",
        localIdentifier: "percentage",
        format: "#,##0.0%",
    },
    {
        name: "Currency",
        localIdentifier: "currency",
        format: "€ #,##0.0",
    },
];

const separators: ISeparators = {
    thousand: " ",
    decimal: ".",
};

storiesOf("Measure Number Format", module)
    .add("Measure Number Format", () => {
        const ToggleButton: React.FC<IToggleButtonProps> = ({ toggleDropdown, text }) => (
            <button
                type="button"
                className="gd-button gd-button-secondary gd-button-small"
                onClick={toggleDropdown}
            >
                {text}
            </button>
        );

        class MeasureNumberFormatWrapper extends React.Component<{}> {
            public render() {
                return (
                    <React.Fragment>
                        <MeasureNumberFormat
                            toggleButton={ToggleButton}
                            presets={presets}
                            separators={separators}
                            templates={templates}
                            selectedFormat={null}
                            setFormat={this.setFormat}
                            documentationLink={documentationLink}
                        />
                    </React.Fragment>
                );
            }

            private setFormat = (format: string) => {
                action(`selected format`)(format);
            };
        }

        return screenshotTarget(<MeasureNumberFormatWrapper />);
    })
    .add("Format presets dropdown", () => {
        class FormatPresetsWrapper extends React.Component<{}> {
            public render() {
                return (
                    <React.Fragment>
                        <div className={"anchor"} style={{ height: "50px", width: "50px" }} />
                        <IntlWrapper>
                            <PresetsDropdown
                                presets={presets}
                                customPreset={customPreset}
                                separators={separators}
                                selectedPreset={presets[1]}
                                onSelect={this.onSelect}
                                onClose={this.onClose}
                                anchorEl={".anchor"}
                            />
                        </IntlWrapper>
                    </React.Fragment>
                );
            }

            private onSelect = (format: IFormatPreset) => {
                action(`onSelect`)(format);
            };

            private onClose = () => {
                action(`onClose`)();
            };
        }

        return screenshotWrap(screenshotTarget(<FormatPresetsWrapper />));
    })
    .add("Custom format dialog", () => {
        class CustomFormatDialogWrapper extends React.Component<{}> {
            public render() {
                return (
                    <React.Fragment>
                        <div className={"anchor"} style={{ height: "50px", width: "50px" }} />
                        <IntlWrapper>
                            <CustomFormatDialog
                                onApply={this.onApply}
                                onCancel={this.onCancel}
                                formatString={"€ #,##0.0"}
                                anchorEl={".anchor"}
                                intl={intlMock}
                            />
                        </IntlWrapper>
                    </React.Fragment>
                );
            }

            private onApply = (format: string) => {
                action(`onApply`)(format);
            };

            private onCancel = () => {
                action(`onCancel`)();
            };
        }

        return screenshotWrap(screenshotTarget(<CustomFormatDialogWrapper />));
    });
