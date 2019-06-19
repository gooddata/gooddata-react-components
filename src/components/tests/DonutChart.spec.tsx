// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { factory } from "@gooddata/gooddata-js";

import { DonutChart as AfmDonutChart } from "../afm/DonutChart";
import { DonutChart, IDonutChartProps } from "../DonutChart";
import { M1 } from "./fixtures/buckets";
import { IChartConfig } from "../../interfaces/Config";

describe("DonutChart", () => {
    function renderChart(props: Partial<IDonutChartProps>): ShallowWrapper {
        return shallow(<DonutChart measures={[M1]} projectId="foo" {...props} />);
    }

    it("should render with custom SDK", () => {
        const wrapper = renderChart({
            sdk: factory({ domain: "example.com" }),
        });
        expect(wrapper.find(AfmDonutChart)).toHaveLength(1);
    });

    describe("Separators", () => {
        const config: IChartConfig = { separators: { thousand: "'", decimal: "," } };

        it("should update format of measures", () => {
            const wrapper = renderChart({ config });
            expect(wrapper.find(AfmDonutChart).prop("afm")).toEqual({
                measures: [
                    {
                        definition: {
                            measure: {
                                item: {
                                    identifier: "m1",
                                },
                            },
                        },
                        format: "#'##0,00",
                        localIdentifier: "m1",
                    },
                ],
            });
        });
    });
});
