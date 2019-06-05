// (C) 2007-2019 GoodData Corporation
import * as React from "react";

import { dataSourceProvider, IDataSourceProviderProps } from "./DataSourceProvider";
import { ICommonChartProps } from "../core/base/BaseChart";
import { Pyramid as CorePyramidChart } from "../core/PyramidChart";
import { generateDefaultDimensions } from "../../helpers/dimensions";

export const PyramidChart: React.ComponentClass<IDataSourceProviderProps> = dataSourceProvider<
    ICommonChartProps
>(CorePyramidChart, generateDefaultDimensions, "PyramidChart");
