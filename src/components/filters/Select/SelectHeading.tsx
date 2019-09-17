// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import * as PropTypes from "prop-types";
import cx from "classnames";

interface ISelectHeading {
    children: React.ReactNode;
    className?: string;
    key?: string;
    style?: React.CSSProperties;
}

export const SelectHeading = ({ children, className, ...otherProps }: ISelectHeading) => (
    <div className={cx("gd-select-heading gd-list-item gd-list-item-header", className)} {...otherProps}>
        {children}
    </div>
);

SelectHeading.propTypes = {
    children: PropTypes.node.isRequired,
};
