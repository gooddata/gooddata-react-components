// (C) 2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Overlay from "@gooddata/goodstrap/lib/core/Overlay";
import * as numberJS from "@gooddata/numberjs";

import { IFormatPreset } from "../typings";
import { PresetsDropdownItem } from "./PresetsDropdownItem";
import { IPositioning, SnapPoint } from "../../../typings/positioning";
import { positioningToAlignPoints } from "../../../helpers/utils";

interface IMeasureNumberFormatDropdownOwnProps {
    presets: ReadonlyArray<IFormatPreset>;
    customPreset: IFormatPreset;
    selectedPreset: IFormatPreset;
    separators: numberJS.ISeparators;
    onSelect: (selectedPreset: IFormatPreset) => void;
    onClose: () => void;
    anchorEl?: string | EventTarget;
    positioning?: IPositioning[];
}

type IMeasureNumberFormatDropdownProps = IMeasureNumberFormatDropdownOwnProps & WrappedComponentProps;

export class PresetsDropdown extends React.PureComponent<IMeasureNumberFormatDropdownProps> {
    public static defaultProps: Partial<IMeasureNumberFormatDropdownProps> = {
        positioning: [
            { snapPoints: { parent: SnapPoint.BottomLeft, child: SnapPoint.TopLeft } },
            { snapPoints: { parent: SnapPoint.TopLeft, child: SnapPoint.BottomLeft } },
        ],
    };

    public render() {
        const { presets, anchorEl, onClose, positioning } = this.props;

        return (
            <Overlay
                closeOnOutsideClick={true}
                closeOnParentScroll={true}
                alignTo={anchorEl}
                alignPoints={positioningToAlignPoints(positioning)}
                onClose={onClose}
            >
                <div className="gd-dropdown overlay">
                    <div className="gd-measure-number-format-dropdown-body s-measure-number-format-dropdown-body">
                        {presets.map((preset, index) => this.renderPresetOption(preset, index))}
                        {this.renderCustomFormatItem()}
                    </div>
                </div>
            </Overlay>
        );
    }

    private renderPresetOption(preset: IFormatPreset, index?: number) {
        const { selectedPreset, separators, onSelect } = this.props;
        return (
            <PresetsDropdownItem
                key={`${preset.localIdentifier}_${index}`} // eliminate possible collision with hardcoded options
                preset={preset}
                separators={separators}
                onClick={onSelect}
                isSelected={selectedPreset && preset.localIdentifier === selectedPreset.localIdentifier}
            />
        );
    }

    private renderCustomFormatItem() {
        const { customPreset, presets } = this.props;
        return this.renderPresetOption(customPreset, presets.length);
    }
}

export default injectIntl(PresetsDropdown);
