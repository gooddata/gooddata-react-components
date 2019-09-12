// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";
import "./Separator.scss";

export const Separator: React.FC<React.PropsWithoutRef<JSX.IntrinsicElements["hr"]>> = ({
    className,
    ...restProps
}) => <hr className={cx("gd-separator-generic", className)} {...restProps} />;
