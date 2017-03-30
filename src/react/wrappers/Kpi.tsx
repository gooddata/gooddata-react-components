import * as React from 'react';
import { Execute } from '../execution/Execute';
import { IAfm } from '../../interfaces/Afm';

type URIString = string;

export interface IKpiProps {
    measure: URIString;
    projectId: string;
}

export interface IKpiState {
    error: boolean;
    result: any;
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

export class Kpi extends React.Component<IKpiProps, IKpiState> {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            result: null
        };

        this.onError = this.onError.bind(this);
        this.onExecute = this.onExecute.bind(this);
    }

    public onExecute(result) {
        this.setState({ result, error: false });
    }

    public onError(error) {
        console.error(error);

        this.setState({ error: true });
    }

    public render() {
        if (this.state.error) {
            return <h1>Error</h1>;
        }

        const afm = buildAFM(this.props.measure);

        return (
            <Execute
                afm={afm}
                onError={this.onError}
                onExecute={this.onExecute}
                projectId={this.props.projectId}
            >
                {this.state.result}
            </Execute>
        );
    }
}
