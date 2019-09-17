// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

import "./SelectOption.scss";

interface ISelectOptionProps {
    isFocused: boolean;
    isSelected: boolean;
    className?: string;
    children: React.ReactNode;
}

export const SelectOption = ({
    isFocused,
    isSelected,
    className,
    children,
    ...restProps
}: ISelectOptionProps) => (
    <div
        className={cx(
            "gd-list-item",
            "gd-select-option",
            isSelected && "gd-select-option-is-selected",
            isFocused && "gd-select-option-is-focused s-select-item-focused",
            className,
        )}
        {...restProps}
    >
        {children}
    </div>
);
