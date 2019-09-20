// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import Bubble from "@gooddata/goodstrap/lib/Bubble/Bubble";
import BubbleHoverTrigger from "@gooddata/goodstrap/lib/Bubble/BubbleHoverTrigger";
import cx from "classnames";

type ListItemTooltipProps = React.HTMLProps<HTMLSpanElement>;

export const ListItemTooltip = ({ children, className, ...restProps }: ListItemTooltipProps) => (
    <span className={cx("gd-list-item-tooltip", className)} {...restProps}>
        <BubbleHoverTrigger>
            <span className="icon-circle-question gd-list-item-tooltip-icon" />
            <Bubble alignPoints={[{ align: "bc tc" }]}>{children}</Bubble>
        </BubbleHoverTrigger>
    </span>
);
