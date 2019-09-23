// (C) 2019 GoodData Corporation
import * as React from "react";

import { IExtendedDateFilterBodyState } from "./ExtendedDateFilterBody";

export const ExtendedDateFilterHeader: React.FC<{
    children: any;
    changeRoute: (route: IExtendedDateFilterBodyState["route"]) => void;
}> = ({ children, changeRoute, ...otherProps }) => {
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
