// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

interface ITabsWrapperProps {
    className?: string;
    children: React.ReactNode;
}

export const TabsWrapper = ({ className, children, ...restProps }: ITabsWrapperProps) => (
    <div className={cx("gd-tabs small is-condensed", className)} {...restProps}>
        {children}
    </div>
);

interface ITabProps {
    selected?: boolean;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const Tab = ({ selected, className, children, ...restProps }: ITabProps) => (
    <div className={cx(selected && "is-active", "gd-tab", className)} {...restProps}>
        {children}
    </div>
);
