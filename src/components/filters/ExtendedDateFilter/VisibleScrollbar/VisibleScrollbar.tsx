// (C) 2019 GoodData Corporation
import React from "react";
import cx from "classnames";
import "./VisibleScrollbar.scss";

export const VisibleScrollbar: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    className,
    children,
    ...restProps
}) => (
    <div className={cx("gd-visible-scrollbar", className)} {...restProps}>
        {children}
    </div>
);
