// (C) 2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

type VisibleScrollbarProps = React.HTMLProps<HTMLDivElement>;

export const VisibleScrollbar = ({ className, children, ...restProps }: VisibleScrollbarProps) => (
    <div className={cx("gd-visible-scrollbar", className)} {...restProps}>
        {children}
    </div>
);
