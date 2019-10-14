// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { Select } from "../../../src/components/filters/DateFilter/Select/Select";
import { ISelectItem, ISelectItemOption } from "../../../src/components/filters/DateFilter/Select/types";

import "../../../styles/css/dateFilter.css";

const wrapperStyle = { width: 400, height: 400, padding: "1em 1em" };

storiesOf("Internal/DateFilter/Select", module).add("renders", () => {
    const items: Array<ISelectItem<string>> = [
        { type: "option", value: "first", label: "First item" },
        { type: "separator" },
        { type: "heading", label: "heading" },
        { type: "option", value: "next", label: "Next" },
        { type: "option", value: "more", label: "More options here" },
    ];

    class SelectExample extends React.Component<{}, { selectedItemValue: string | null }> {
        constructor(props: {}) {
            super(props);

            const selectedItem = items[0];
            this.state = {
                selectedItemValue: selectedItem.type === "option" ? selectedItem.value : null,
            };
        }

        public render() {
            return (
                <div>
                    <Select
                        items={items}
                        value={this.state.selectedItemValue}
                        onChange={this.onSelectChange}
                        style={{ display: "inline-block" }}
                    />
                </div>
            );
        }

        private onSelectChange = (item: ISelectItemOption<string>) => {
            this.setState({ selectedItemValue: item.value });
        };
    }

    return screenshotWrap(
        <div style={wrapperStyle} className="screenshot-target">
            <SelectExample />
        </div>,
    );
});
