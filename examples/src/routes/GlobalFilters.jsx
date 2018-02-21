import * as React from 'react';
import { AttributeElements, AfmComponents, Kpi } from '@gooddata/react-components';
import { EmployeeCard } from '../components/GlobalFiltersComponents/EmployeeCard';
import { EmployeeItem } from '../components/GlobalFiltersComponents/EmployeeItem';
import { KpiMetricBox } from '../components/GlobalFiltersComponents/KpiMetricBox';
import {
    projectId,
    employeeNameIdentifier,
    averageDailyTotalSales,
    averageCheckSizeByServer, menuItemNameAttributeDFIdentifier
} from '../utils/fixtures';
import { Layout } from '../components/utils/Layout';
import { Loading } from '../components/utils/Loading';
import { Error } from '../components/utils/Error';

const { BarChart, PieChart } = AfmComponents;

const employeeAdditionalInfo = [
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        startDate: '2001'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        startDate: '2006'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        startDate: '2017'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        startDate: '2015'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        startDate: '2015'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
        startDate: '2016'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
        startDate: '2000'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
        startDate: '2014'
    },
    {
        gender: 'M',
        avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
        startDate: '2003'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        startDate: '2017'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
        startDate: '2016'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
        startDate: '2008'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
        startDate: '2013'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
        startDate: '2015'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
        startDate: '2016'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
        startDate: '2017'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
        startDate: '2012'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/11.jpg',
        startDate: '2018'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
        startDate: '2000'
    },
    {
        gender: 'F',
        avatarUrl: 'https://randomuser.me/api/portraits/women/13.jpg',
        startDate: '2005'
    }
]

export class GlobalFiltersXXX extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedEmployeeUri: props.validElements.items[0].element.uri,
            selectedEmployeeIndex: 0
        };

        this.selectEmployee = this.selectEmployee.bind(this);
        this.setDefaultSelection = this.setDefaultSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.validElements !== this.props.validElements) {
            this.setDefaultSelection(nextProps);
        }
    }

    setDefaultSelection(props) {
        this.setState({
            selectedEmployeeUri: props.validElements.items[0].element.uri
        });
    }

    selectEmployee(uri, index) {
        console.log('selected index:', uri);

        this.setState({
            selectedEmployeeUri: uri,
            selectedEmployeeIndex: index
        });
    }

    render() {
        const { selectedEmployeeUri, selectedEmployeeIndex } = this.state;
        const { validElements } = this.props;


        const sidebar = (<div>
            <style jsx>{`
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0 0 20px 0;
                }
            `}</style>
            <ul>
                {validElements ? validElements.items.map((item, index) => (
                    <EmployeeItem
                        key={item.element.uri}
                        label={item.element.title}
                        uri={item.element.uri}
                        index={index}
                        isSelected={selectedEmployeeUri === item.element.uri}
                        onClick={this.selectEmployee}
                    />
                )) : null}
            </ul>
        </div>);

        const employeeFilter = {
            positiveAttributeFilter: {
                displayForm: {
                    identifier: employeeNameIdentifier
                },
                in: [selectedEmployeeUri]
            }
        }
        const employeeName = validElements.items.find(item => item.element.uri === selectedEmployeeUri).element.title;
        const { avatarUrl, gender, startDate } = employeeAdditionalInfo[selectedEmployeeIndex];

        return (<Layout sidebar={sidebar} >
            <div>
                { /*language=CSS*/ }
                <style jsx>{`
                    .header {
                        border-bottom: 2px solid #14b2e2;
                    }
                    .details {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
                        grid-column-gap: 20px;
                        grid-row-gap: 40px;
                    }

                    .loading {
                        color: white;
                        font: 300 4em/150% Impact;
                        text-align: center;
                    }

                    .loading:after {
                        content: ' .';
                        animation: dots 1s steps(5, end) infinite;}

                    @keyframes dots {
                        0%, 20% {
                            color: rgba(0,0,0,0);
                            text-shadow:
                                .25em 0 0 rgba(0,0,0,0),
                                .5em 0 0 rgba(0,0,0,0);}
                        40% {
                            color: white;
                            text-shadow:
                                .25em 0 0 rgba(0,0,0,0),
                                .5em 0 0 rgba(0,0,0,0);}
                        60% {
                            text-shadow:
                                .25em 0 0 white,
                                .5em 0 0 rgba(0,0,0,0);}
                        80%, 100% {
                            text-shadow:
                                .25em 0 0 white,
                                .5em 0 0 white;}}
                `}</style>
                <div className="header"><h1>Employee overview</h1></div>
                <div className="details">
                    <div>
                        <EmployeeCard name={employeeName} avatarUrl={avatarUrl} startDate={startDate} gender={gender} />
                    </div>
                    <div>
                        <KpiMetricBox title={'Daily sales'}>
                            $<Kpi filters={[employeeFilter]} measure={averageDailyTotalSales} projectId={projectId} loadingComponent={Loading} />
                        </KpiMetricBox>

                        <KpiMetricBox title={'Average check size'}>
                            $<Kpi filters={[employeeFilter]} measure={averageCheckSizeByServer} projectId={projectId} loadingComponent={Loading} />
                        </KpiMetricBox>
                    </div>
                    <div>
                        <h2>Average daily total sales by menu category</h2>
                        <PieChart
                            afm={{
                                measures: [
                                    {
                                        localIdentifier: 'm1',
                                        definition: {
                                            measure: {
                                                item: {
                                                    identifier: averageDailyTotalSales
                                                }
                                            }
                                        },
                                        alias: "$ Avg Daily Total Sales"
                                    }
                                ],
                                attributes: [
                                    {
                                        localIdentifier: 'a1',
                                        displayForm: {
                                            uri: "/gdc/md/ws7pxsamkx8o0t1s7kfvkj5o41uwcmqg/obj/2188"
                                        }
                                    }
                                ],
                                filters: [employeeFilter]
                            }}
                            projectId={projectId}
                        />
                    </div>
                    <div>
                        <h2>Average daily total sales by menu item</h2>
                        <BarChart
                            afm={{
                                measures: [
                                    {
                                        localIdentifier: 'm1',
                                        definition: {
                                            measure: {
                                                item: {
                                                    identifier: averageDailyTotalSales
                                                }
                                            }
                                        },
                                        alias: "$ Avg Daily Total Sales"
                                    }
                                ],
                                attributes: [
                                    {
                                        localIdentifier: 'a1',
                                        displayForm: {
                                            identifier: menuItemNameAttributeDFIdentifier
                                        }
                                    }
                                ],
                                filters: [employeeFilter]
                            }}
                            projectId={projectId}
                        />
                    </div>
                </div>
            </div>
        </Layout>);
    }
}

export const GlobalFilters = () => (
    <AttributeElements identifier={employeeNameIdentifier} projectId={projectId} options={{ limit: 20 }}>
        {({ validElements, error, isLoading }) => {
            console.log('AttributeElements');
            console.log('validElements', validElements);
            console.log('error', error);
            console.log('isLoading', isLoading);
            if (error) {
                return <Error error={{ status: '400', message: error }} />;
            }
            if (isLoading) {
                return <Loading />;
            }
            return <GlobalFiltersXXX validElements={validElements} />;
        }}
    </AttributeElements>
);

export default GlobalFilters;
