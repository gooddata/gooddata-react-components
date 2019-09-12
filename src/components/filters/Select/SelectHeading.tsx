// (C) 2007-2019 GoodData Corporation
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

interface ISelectHeading extends React.PropsWithoutRef<JSX.IntrinsicElements["div"]> {
    children: React.ReactNode;
}

export const SelectHeading: React.FC<ISelectHeading> = ({ children, className, ...otherProps }) => (
    <div className={cx("gd-select-heading gd-list-item gd-list-item-header", className)} {...otherProps}>
        {children}
    </div>
);

SelectHeading.propTypes = {
    children: PropTypes.node.isRequired,
};
