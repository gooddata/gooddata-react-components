// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import cx from "classnames";

interface ISeparatorProps {
    className?: string;
}

export const Separator = ({ className, ...restProps }: ISeparatorProps) => (
    <hr className={cx("gd-separator-generic", className)} {...restProps} />
);
