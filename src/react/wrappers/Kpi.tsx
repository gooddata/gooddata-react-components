import * as React from 'react';
import numeral from 'numeral';
import { get } from 'lodash';
import { Execute } from '../execution/Execute';
import { IAfm } from '../../interfaces/Afm';

type URIString = string;

export interface IKpiProps {
    measure: URIString;
    projectId: string;
    format?: string;
}

export interface IKpiState {
    error: boolean;
    result: any;
    isLoading: boolean;
}

function buildAFM(measureUri: string): IAfm {
    return {
        measures: [
            {
                id: 'm1',
                definition: {
                    baseObject: {
                        id: measureUri
                    }
                }
            }
        ]
    };
}

function Loading() {
    return <span style={{ background: '#cacaca', color: '#cacaca' }}>⃞⃞⃞</span>;
}

export class Kpi extends React.Component<IKpiProps, IKpiState> {
    public static defaultProps = {
        format: '$0,0.00'
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            result: null,
            isLoading: true
        };

        this.onError = this.onError.bind(this);
        this.onExecute = this.onExecute.bind(this);
        this.onLoading = this.onLoading.bind(this);
    }

    public onExecute(data) {
        const result = get(data, 'rawData.0.0');

        this.setState({ result, error: false });
    }

    public onError(error) {
        console.error(error);

        this.setState({ error: true });
    }

    public onLoading(isLoading: boolean) {
        this.setState({ isLoading });
    }

    public getFormattedResult(): string {
        return numeral(this.state.result).format(this.props.format);
    }

    public render() {
        if (this.state.error) {
            return <h1>Error</h1>;
        }

        const afm = buildAFM(this.props.measure);

        return (
            <Execute
                className="gdc-kpi"
                afm={afm}
                onError={this.onError}
                onExecute={this.onExecute}
                onLoading={this.onLoading}
                projectId={this.props.projectId}
            >
                {this.state.isLoading ? <Loading /> : this.getFormattedResult()}
            </Execute>
        );
    }
}
