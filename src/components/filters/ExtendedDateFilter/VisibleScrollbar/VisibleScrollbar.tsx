// (C) 2019 GoodData Corporation
import React from "react";
import cx from "classnames";
import "./VisibleScrollbar.scss";

type VisibleScrollbarProps = React.HTMLProps<HTMLDivElement>;

export const VisibleScrollbar = ({ className, children, ...restProps }: VisibleScrollbarProps) => (
    <div className={cx("gd-visible-scrollbar", className)} {...restProps}>
        {children}
    </div>
);
