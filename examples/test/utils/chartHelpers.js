// (C) 2020 GoodData Corporation

export const getTracker = async (chart, groupIndex, index) => {
    return chart
        .find(
            ".highcharts-series-" +
                `${groupIndex}` +
                ".highcharts-tracker rect," +
                ".highcharts-series-" +
                `${groupIndex}` +
                ".highcharts-tracker path," +
                ".highcharts-series-" +
                `${groupIndex}` +
                ".highcharts-tracker circle",
        )
        .nth(index);
};
