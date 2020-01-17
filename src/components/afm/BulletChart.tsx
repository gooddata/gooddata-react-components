// (C) 2007-2020 GoodData Corporation
import * as React from "react";

import { dataSourceProvider, IDataSourceProviderProps } from "./DataSourceProvider";

export { IDataSourceProviderProps };

import { ICommonChartProps } from "../core/base/BaseChart";
import { BulletChart as CoreBulletChart } from "../core/BulletChart";
import { generateDefaultDimensions } from "../../helpers/dimensions";

/**
 * AFM BulletChart
 * is an internal component that accepts afm, resultSpec
 * @internal
 */
export const BulletChart: React.ComponentClass<IDataSourceProviderProps> = dataSourceProvider<
    ICommonChartProps
>(CoreBulletChart, generateDefaultDimensions, "BulletChart");
