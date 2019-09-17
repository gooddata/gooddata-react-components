// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

import "./ListItem.scss";

type ListItemProps = { isSelected?: boolean } & React.HTMLProps<HTMLButtonElement>;

export const ListItem = ({ isSelected: isActive, className, children, ...restProps }: ListItemProps) => (
    <button
        className={cx(
            "gd-list-item",
            "gd-filter-list-item",
            {
                "is-selected": isActive,
                "gd-filter-list-item-selected": isActive,
            },
            className,
        )}
        {...restProps}
    >
        {children}
    </button>
);
