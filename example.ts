import { SimpleExecutorAdapter } from './src/adapters/SimpleExecutorAdapter';
import { DataTable } from './src/DataTable';
import { IAfm } from './src/Afm';
import * as gooddata from 'gooddata';
import { testData } from './examples/data';

function dump(obj) {
    console.log(
        JSON.stringify(obj, null, 2)
    );
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // SSL

const data = testData[0];

const adapter = new SimpleExecutorAdapter(data.projectId);

const generatedMetricWithFilters: IAfm = {
    measures: [
        {
            id: 'close_bop_with_filters',
            definition: {
                baseObject: {
                    id: data.CLOSE_BOP
                },
                filters: [{
                    id: data.SALES_REP_DF,
                    in: [
                        data.SALES_REP_ADAM_BRADLEY,
                        data.SALES_REP_ALEJANDRO_VIBIANO,
                        data.SALES_RE_ALEXANDR_FYODR
                    ]
                }]
            }
        }
    ],
    attributes: [

    ]
};

const simplePopAfm: IAfm = {
    measures: [
        {
            id: data.CLOSE_BOP
        },
        {
            id: 'close_bop_pop',
            definition: {
                baseObject: {
                    id: data.CLOSE_BOP
                },
                popAttribute: {
                    id: data.DATE_CLOSED_YEAR_DF
                }
            }
        }
    ],
    attributes: [

    ]
};

const simpleShowInPercentAfm: IAfm = {
    measures: [
        {
            id: 'close_bop_percent',
            definition: {
                baseObject: {
                    id: data.CLOSE_BOP
                },
                showInPercent: true
            }
        }
    ],
    attributes: [
        {
            id: data.DATE_CLOSED_YEAR_DF
        }
    ]
};

const showInPercentWithFiltersAfm: IAfm = {
    measures: [
        {
            id: 'close_bop_percent',
            definition: {
                baseObject: {
                    id: data.CLOSE_BOP
                },
                filters: [{
                    id: data.SALES_REP_DF,
                    in: [
                        data.SALES_REP_ADAM_BRADLEY,
                        data.SALES_REP_ALEJANDRO_VIBIANO,
                        data.SALES_RE_ALEXANDR_FYODR
                    ]
                }],
                showInPercent: true
            }
        }
    ],
    attributes: [
        {
            id: data.DATE_CLOSED_YEAR_DF
        }
    ]
};

const popAndPercentAfm: IAfm = {
    measures: [
        {
            id: 'close_bop_percent',
            definition: {
                baseObject: {
                    id: data.CLOSE_BOP
                },
                showInPercent: true
            }
        },
        {
            id: 'close_bop_pop',
            definition: {
                baseObject: {
                    lookupId: 'close_bop_percent'
                },
                popAttribute: {
                    id: data.DATE_CLOSED_YEAR_DF
                }
            }
        }
    ],
    attributes: [
        {
            id: data.DATE_CLOSED_YEAR_DF
        }
    ]
};


const transformation = {
    visualization: {
        type: 'table'
    }//,
    // sorting: [
    //     {
    //         column: DEPARTMENT_DF,
    //         direction: 'desc'
    //     }
    // ]
};



gooddata.config.setCustomDomain(data.host);
gooddata.user.login('xxx', 'xxx').then(() => {
    const dt = new DataTable(adapter);

    dt.onData((d) => console.log(d));
    dt.onError((err) => {
        // console.log(err.response.body);

        console.error(dump(err));
    });

    dt.getData(
        // generatedMetricWithFilters
        // simplePopAfm
        popAndPercentAfm
        , transformation);
});

popAndPercentAfm;
showInPercentWithFiltersAfm;
simpleShowInPercentAfm;
simplePopAfm;
generatedMetricWithFilters;