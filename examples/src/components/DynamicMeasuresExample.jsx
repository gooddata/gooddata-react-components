import React, { Component } from 'react';
import { AfmComponents } from '@gooddata/react-components';
import PropTypes from 'prop-types';
import * as GD from 'gooddata';

import '@gooddata/react-components/styles/css/main.css';

import { Loading } from './utils/Loading';
import { Error } from './utils/Error';
import {
    monthDateIdentifier,
    projectId,
    franchiseFeesTag,
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty
} from '../utils/fixtures';

const franchiseFeesMeasureIdentifiers = [
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
    franchiseFeesInitialFranchiseFeeIdentifier,
    franchiseFeesIdentifierOngoingRoyalty
];

const { ColumnChart } = AfmComponents;

export class AttributeFilterItem extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired
    };

    onChange(uri) {
        // eslint-disable-next-line no-console
        return event => console.log('AttributeFilterItem onChange', uri, event.target.value === 'on');
    }

    render() {
        const { title, uri } = this.props;
        return (
            <label className="gd-list-item s-attribute-filter-list-item" style={{ display: 'inline-flex' }}>
                <input type="checkbox" className="gd-input-checkbox" onChange={this.onChange(uri)} />
                <span>{title}</span>
            </label>
        );
    }
}

export class DynamicMeasuresExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            measures: null,
            error: null
        };

        this.onMeasuresChange = this.onMeasuresChange.bind(this);
    }

    componentWillMount() {
        GD.xhr.get(`/gdc/md/${projectId}/tags/${franchiseFeesTag}`).then(
            (response) => {
                console.log('tags success', response);
                if (!response.entries.length) {
                    return this.setState({
                        measures: null,
                        error: {
                            status: '404',
                            message: `No measures with tag ${franchiseFeesTag}. Please check your project.
                                Measures with identifiers ${franchiseFeesMeasureIdentifiers.join(', ')} should have assigned tag ${franchiseFeesTag}.`
                        }
                    });
                }
                return this.setState({
                    measures: response.entries,
                    error: null
                });
            }
        ).catch((error) => {
            console.error('tags Error', error);
            this.setState({
                measures: null,
                error: { status: '400', message: `Error while requesting measures by tag ${franchiseFeesTag}` }
            });
        });
    }

    onMeasuresChange(measureIdentifier, value) {
        console.log('onMeasuresChange measure, value', measureIdentifier, value);
        const { measureList } = this.state;
        const updatedMeasure = measureList.find(measure => (measure.identifier === measureIdentifier));
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
        console.log('measureItem', measureItem);

        return {
            localIdentifier: 'totalSales',
            definition: {
                measure: {
                    item: {
                        identifier: measureItem.identifier
                    },
                    aggregation: 'sum'
                }
            },
            alias: '$ Total Sales',
            format: '#,##0'
        };
    }

    render() {
        const { measureList, error } = this.state;

        const measures = measureList.filter(measure => measure.isSelected).map(this.getMeasureDefinition);

        const afm = {
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

        return (
            <div className="s-date-picker">
                <style jsx>{`
                    label {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: 20px;
                    }
                    hr {
                        border: 1px solid #EEE;
                        border-width: 1px 0 0 0;
                        margin: 20px 0;
                    }
                    h4 {
                        margin-bottom: 0;
                    }
                    :global(.gd-input-field) {
                        min-width: 212px;
                    }
                `}</style>
                <pre>
                    { JSON.stringify(measureList, null, '  ') }
                </pre>
                <hr />
                <div style={{ height: 300 }} className="s-date-picker-chart">
                    {error ? <Error error={{ status: '400', message: error }} /> : (
                        <ColumnChart
                            projectId={projectId}
                            afm={afm}
                            onLoadingChanged={this.onLoadingChanged}
                            onError={this.onError}
                            LoadingComponent={Loading}
                            ErrorComponent={Error}
                        />
                    )}
                </div>
                <hr />
            </div>
        );
    }
}

export default DynamicMeasuresExample;
