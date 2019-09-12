// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";

export const TabsWrapper: React.FC<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>> = ({
    className,
    children,
    ...restProps
}) => (
    <div className={cx("gd-tabs small is-condensed", className)} {...restProps}>
        {children}
    </div>
);

export const Tab: React.FC<
    React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
        selected?: boolean;
    }
> = ({ selected, className, children, ...restProps }) => (
    <div className={cx(selected && "is-active", "gd-tab", className)} {...restProps}>
        {children}
    </div>
);
