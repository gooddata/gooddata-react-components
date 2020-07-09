// (C) 2019-2020 GoodData Corporation
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import set = require("lodash/set");
import Dropdown, { DropdownButton, DropdownBody } from "@gooddata/goodstrap/lib/Dropdown/Dropdown";
import DisabledBubbleMessage from "../DisabledBubbleMessage";

import { getTranslation } from "../../utils/translations";
import { IVisualizationPropertiesContent } from "../../interfaces/Visualization";

export interface IDropdownItem {
    title?: string;
    value?: string | number | boolean;
    type?: string;
    icon?: string;
}

export interface IDropdownControlProps {
    valuePath: string;
    properties: IVisualizationPropertiesContent;
    labelText?: string;
    value?: string;
    items?: IDropdownItem[];
    disabled?: boolean;
    width?: number;
    showDisabledMessage?: boolean;
    pushData(data: any): void;
}

const alignPoints = ["bl tl", "tl bl", "br tr", "tr br"];

export const DROPDOWN_ALIGMENTS = alignPoints.map(align => ({ align, offset: { x: 1, y: 0 } }));

class DropdownControl extends React.PureComponent<IDropdownControlProps & WrappedComponentProps> {
    public static defaultProps = {
        value: "",
        items: [] as IDropdownItem[],
        disabled: false,
        width: 117,
        showDisabledMessage: false,
    };

    constructor(props: IDropdownControlProps & WrappedComponentProps) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    public render() {
        const { disabled, labelText, value, width, items, showDisabledMessage, intl } = this.props;
        const selectedItem = this.getSelectedItem(value) || {};

        return (
            <DisabledBubbleMessage showDisabledMessage={showDisabledMessage}>
                <div className="adi-properties-dropdown-container">
                    <span className="input-label-text">{getTranslation(labelText, intl)}</span>
                    <label className="adi-bucket-inputfield gd-input gd-input-small">
                        <Dropdown
                            disabled={disabled}
                            button={this.getDropdownButton(selectedItem)}
                            closeOnParentScroll={true}
                            closeOnMouseDrag={true}
                            alignPoints={DROPDOWN_ALIGMENTS}
                            body={
                                <DropdownBody
                                    width={width}
                                    items={items}
                                    onSelect={this.onSelect}
                                    selection={selectedItem}
                                />
                            }
                            className="adi-bucket-dropdown"
                        />
                    </label>
                </div>
            </DisabledBubbleMessage>
        );
    }

    private getDropdownButton(selectedItem: IDropdownItem) {
        const { icon, title } = selectedItem;

        return <DropdownButton value={title} iconLeft={icon} />;
    }

    private onSelect(selectedItem: IDropdownItem) {
        const { valuePath, properties, pushData } = this.props;
        const newProperties = set(properties, `controls.${valuePath}`, selectedItem.value);

        pushData({ properties: newProperties });
    }

    private getSelectedItem(value: string): IDropdownItem {
        if (this.props.items) {
            return this.props.items.find(item => item.value === value);
        }

        return undefined;
    }
}

export default injectIntl(DropdownControl);
