// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";

import "./SelectOption.scss";

interface ISelectOptionProps extends React.PropsWithoutRef<JSX.IntrinsicElements["div"]> {
    isFocused: boolean;
    isSelected: boolean;
}

export const SelectOption: React.FC<ISelectOptionProps> = ({
    isFocused,
    isSelected,
    className,
    children,
    ...restProps
}) => (
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
