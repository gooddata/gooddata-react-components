// (C) 2007-2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import * as React from "react";

import { dataSourceProvider, IDataSourceProviderProps } from "./DataSourceProvider";

export { IDataSourceProviderProps };

import { Xirr as CoreXirr } from "../core/Xirr";

function generateDefaultDimensions(afm: AFM.IAfm): AFM.IDimension[] {
    return [
        {
            itemIdentifiers: ["measureGroup", ...(afm.attributes || []).map(a => a.localIdentifier)],
        },
    ];
}

/**
 * AFM Xirr
 * is an internal component that accepts afm, resultSpec
 * @internal
 */
export const Xirr: React.ComponentClass<IDataSourceProviderProps> = dataSourceProvider(
    CoreXirr,
    generateDefaultDimensions,
    "CoreXirr",
    "Xirr",
);
