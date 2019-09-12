// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";

interface IListHeading extends React.PropsWithoutRef<JSX.IntrinsicElements["div"]> {
    className?: string;
    children: React.ReactNode;
}

export const ListHeading: React.FC<IListHeading> = ({ children, className, ...otherProps }) => (
    <div className={cx("gd-list-item gd-list-item-header gd-filter-list-heading", className)} {...otherProps}>
        {children}
    </div>
);
