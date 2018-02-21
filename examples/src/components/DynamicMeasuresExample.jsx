import React, { Component } from 'react';
import { AfmComponents } from '@gooddata/react-components';
import * as GD from 'gooddata';

import '@gooddata/react-components/styles/css/main.css';

import { Layout } from './utils/Layout';
import { Loading } from './utils/Loading';
import { Error } from './utils/Error';
import { SidebarItem } from './utils/SidebarItem';
import {
    monthDateIdentifier,
    projectId,
    franchiseFeesTag
} from '../utils/fixtures';

const { LineChart, ColumnChart } = AfmComponents;

export class DynamicMeasuresExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            measureList: null,
            error: null
        };

        this.onMeasureChange = this.onMeasureChange.bind(this);
    }

    componentWillMount() {
        GD.xhr.get(`/gdc/md/${projectId}/tags/${franchiseFeesTag}`).then(
            (response) => {
                if (!response.entries.length) {
                    return this.setState({
                        measureList: null,
                        error: {
                            status: '404',
                            message: `No measures with tag ${franchiseFeesTag}. Please check your project.
                                Franchise fees measures should have assigned the tag ${franchiseFeesTag}.`
                        }
                    });
                }
                return this.setState({
                    measureList: response.entries.map(entry => ({ ...entry, isSelected: true })),
                    error: null
                });
            }
        ).catch((error) => {
            this.setState({
                measureList: null,
                error: { status: '400', message: `Error while requesting measures by tag ${franchiseFeesTag}. ${JSON.stringify(error)}` }
            });
        });
    }

    onMeasureChange(measureIdentifier) {
        const { measureList } = this.state;
        const updatedMeasure = measureList.find(measure => (measure.link === measureIdentifier));
        const updatedMeasureIndex = measureList.indexOf(updatedMeasure);
        const updatedMeasures = [...measureList];
        updatedMeasures[updatedMeasureIndex] = {
            ...updatedMeasure,
            isSelected: !updatedMeasure.isSelected
        };

        this.setState({
            measureList: updatedMeasures
        });
    }

    getMeasureDefinition(measureItem) {
        return {
            localIdentifier: measureItem.link.split('/').reverse()[0],
            definition: {
                measure: {
                    item: {
                        uri: measureItem.link
                    }
                }
            },
            format: '#,##0'
        };
    }

    render() {
        const { measureList, error } = this.state;

        if (error) {
            return <Error error={{ status: '400', message: error }} />;
        }

        const loadingBlock = <div style={{ height: '100%', minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>;

        const sidebar = measureList
            ? (<ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {measureList.map(({ title, link, isSelected }) => (
                    <SidebarItem
                        key={link}
                        label={title}
                        id={link}
                        isSelected={isSelected}
                        onClick={this.onMeasureChange}
                    />
                ))}
            </ul>)
            : loadingBlock;

        const config = { legend: { position: 'bottom' } };
        let content = loadingBlock;

        if (measureList) {
            const selectedMeasures = measureList.filter(measure => measure.isSelected);
            const measures = selectedMeasures.map(this.getMeasureDefinition);

            if (selectedMeasures.length) {
                const lineChartAfm = {
                    measures,
                    attributes: [
                        {
                            displayForm: {
                                identifier: monthDateIdentifier
                            },
                            localIdentifier: 'month'
                        }
                    ]
                };
                const columnChartAfm = {
                    measures
                };

                content = (<div className="graph-wrapper">
                    <style jsx>{`
                        .graph-wrapper {
                            display: flex;
                        }
                        .graph-line {
                            flex-basis: 60%;
                            margin-right: 20px;
                        }
                    `}</style>
                    <div style={{ height: 300 }} className="graph graph-line s-dynamic-line-chart">
                        <LineChart
                            projectId={projectId}
                            afm={lineChartAfm}
                            onLoadingChanged={this.onLoadingChanged}
                            onError={this.onError}
                            LoadingComponent={Loading}
                            ErrorComponent={Error}
                            config={config}
                        />
                    </div>
                    <div style={{ height: 300 }} className="graph graph-column s-dynamic-column-chart">
                        <ColumnChart
                            projectId={projectId}
                            afm={columnChartAfm}
                            onLoadingChanged={this.onLoadingChanged}
                            onError={this.onError}
                            LoadingComponent={Loading}
                            ErrorComponent={Error}
                            config={config}
                        />
                    </div>
                </div>);
            } else {
                content = <Error error={{ status: '400', message: 'Please select at least one measure' }} />;
            }
        }

        return (
            <div className="s-dynamic-measures">
                <hr className="separator" />
                <Layout sidebar={sidebar} >
                    {content}
                </Layout>
                <hr className="separator" />
            </div>
        );
    }
}

export default DynamicMeasuresExample;
