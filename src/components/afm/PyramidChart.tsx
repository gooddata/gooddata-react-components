// (C) 2007-2019 GoodData Corporation
import * as React from "react";

import { dataSourceProvider, IDataSourceProviderProps } from "./DataSourceProvider";
import { ICommonChartProps } from "../core/base/BaseChart";
import { PyramidChart as CorePyramidChart } from "../core/PyramidChart";
import { generateDefaultDimensionsForRoundChart } from "../../helpers/dimensions";

export const PyramidChart: React.ComponentClass<IDataSourceProviderProps> = dataSourceProvider<
    ICommonChartProps
>(CorePyramidChart, generateDefaultDimensionsForRoundChart, "PyramidChart");
