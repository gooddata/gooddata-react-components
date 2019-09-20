// (C) 2019 GoodData Corporation
import * as React from "react";

import { IExtendedDateFilterBodyState } from "./ExtendedDateFilterBody";

interface IExtendedDateFilterHeaderProps {
    children: any;
    changeRoute: (route: IExtendedDateFilterBodyState["route"]) => void;
}

export const ExtendedDateFilterHeader = ({
    children,
    changeRoute,
    ...otherProps
}: IExtendedDateFilterHeaderProps) => {
    return (
        <button
            className="gd-extended-date-filter-header s-do-not-close-dropdown-on-click"
            onClick={
                // tslint:disable-next-line:jsx-no-lambda
                e => {
                    e.preventDefault();
                    changeRoute(null);
                }
            }
            {...otherProps}
        >
            <span className="icon-navigateleft" />
            &emsp;{children}
        </button>
    );
};
