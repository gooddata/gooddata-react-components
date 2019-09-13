// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";

import "./DateFilterButton.scss";

export interface IDateFilterButtonProps {
    title: React.ReactNode;
    isOpen?: boolean;
    isMobile: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

export const DateFilterButton = ({ isOpen, isMobile, title, children, disabled }: IDateFilterButtonProps) => {
    return (
        <div
            className={cx(
                "s-date-filter-button",
                "gd-date-filter-button",
                "attribute-filter-button",
                "dropdown-button",
                isMobile && "attribute-filter-button-mobile",
                isOpen && "is-active",
                disabled && "disabled",
            )}
        >
            <div className="button-content">
                <div className="s-date-filter-title button-title">{title}</div>
                <div className="button-subtitle">{children}</div>
            </div>
        </div>
    );
};
