// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

import "./DateFilterFormWrapper.scss";

interface IDateFilterFormWrapperProps {
    children: React.ReactNode;
    isMobile: boolean;
}

export const DateFilterFormWrapper = ({
    children,
    isMobile,
    className,
    ...restProps
}: IDateFilterFormWrapperProps & React.HTMLProps<HTMLDivElement>) => (
    <div
        className={cx(
            className,
            "gd-date-filter-form-wrapper",
            !isMobile && "gd-date-filter-form-wrapper-desktop",
        )}
        {...restProps}
    >
        <div className="gd-date-filter-form-wrapper-inner">{children}</div>
    </div>
);
