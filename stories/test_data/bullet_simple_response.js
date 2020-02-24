// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "$ Franchise Fees",
                                            format: "#,##0",
                                            localIdentifier: "m_126",
                                            uri: "/gdc/md/" + projectId + "/obj/6685",
                                            identifier: "aaEGaXAEgB7U",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Location Resort",
                                localIdentifier: "va_84",
                                uri: "/gdc/md/" + projectId + "/obj/2207",
                                identifier: "label.restaurantlocation.locationresort",
                                formOf: {
                                    name: "Location Resort",
                                    uri: "/gdc/md/" + projectId + "/obj/2206",
                                    identifier: "attr.restaurantlocation.locationresort",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Short (Jan) (Date)",
                                localIdentifier: "va_85",
                                uri: "/gdc/md/" + projectId + "/obj/2073",
                                identifier: "date.abm81lMifn6q",
                                formOf: {
                                    name: "Month (Date)",
                                    uri: "/gdc/md/" + projectId + "/obj/2071",
                                    identifier: "date.month.in.year",
                                },
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/324570072936579008?c=9ac0480d508723e33732bb7bd117db7c&q=eAGlklFPwjAUhf%2FKUnzQZMnGhttCYowJjpCoDwhPZA%2FdeoHK2i5tJyLhv3sHQpD4Ary1Pe3Xc%2B89%0Aa6KhUtq%2BUQGkS8bSclsCIy4pVFkLaUh3sibUWs3z2sKoUfHeiyqo5Uo6QzD4Gq%2BbWgiqV6jhhnFT%0AlXSVKi0GDI%2B8GSs8wbwvYeIZ7dhpOAvld12wJEx8FeTwmShYyMpT%2BYcXBH6MjJwaeC5BgLTj4eAC%0ASOTB7rl55OwBidvS%2FjV%2FqO8it1HDVpaWTbMmWbZx11d2wI%2FD6zvgx%2B3TDlxTJ%2BLQE9O8LHtqKd8t%0AVE%2F7WPTSs%2BfT7gSI24anS6pFsz4kqA8SNC%2BcVyXtHJWD7X38toJz26MW7lDfD%2Fb0%2BHgmmUsEYIqL%0AXaKnGE1q0XXLbbX8P78fAW%2BcVFNZzLkBJwUwKO0g5%2BckipJ7skEXWi0bC7%2BgvlZ1RbLND%2BzdLKc%3D%0A&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
