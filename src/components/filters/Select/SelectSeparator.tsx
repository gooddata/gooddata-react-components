// (C) 2007-2019 GoodData Corporation
import React from "react";
import cx from "classnames";
import { Separator } from "../ExtendedDateFilter/Separator/Separator"; // TODO ONE-4000 We should not traverse like that

export const SelectSeparator: React.FC<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>> = ({
    className,
    ...otherProps
}) => (
    <div className={cx("gd-select-separator", className)} {...otherProps}>
        <Separator />
    </div>
);
