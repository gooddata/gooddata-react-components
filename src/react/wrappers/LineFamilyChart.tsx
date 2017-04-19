import * as React from 'react';
import { get } from 'lodash';
import LineFamilyChartTransformation from '@gooddata/indigo-visualizations/lib/Chart/LineFamilyChartTransformation';
import { Execute } from '../execution/Execute';
import { IAfm } from '../../interfaces/Afm';
import { ITransformation } from '../../interfaces/Transformation';
import { IntlWrapper } from './IntlWrapper';
import { Loading } from '../Loading';

export interface ILineFamilyChartConfig {
    colours?: String[];
}

export interface ILineFamilyChartProps {
    afm: IAfm;
    projectId: string;
    transformation: ITransformation;
    config?: ILineFamilyChartConfig;
    type: 'line' | 'bar' | 'column';
}

export interface ILineFamilyChartState {
    error: boolean;
    result: any;
    isLoading: boolean;
}

function generateConfig(type, afm, config) {
    const attribute = get(afm, 'attributes.0.id');
    const category =  attribute ? {
        category: {
            collection: 'trend',
            displayForm: attribute,
            type: 'attribute'
        }
    } : null;

    return {
        type,
        buckets: {
            categories: category ? [category] : []
        },
        ...config
    };
}

export class LineFamilyChart extends React.Component<ILineFamilyChartProps, ILineFamilyChartState> {
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
        this.setState({ result: data, error: false });
    }

    public onError(error) {
        this.setState({ error: true });
    }

    public onLoading(isLoading: boolean) {
        this.setState({ isLoading });
    }

    public getComponent() {
        if (this.state.isLoading) {
            return <Loading />;
        }

        const { type, afm, config } = this.props;

        const visConfig = generateConfig(type, afm, config);

        return (
            <IntlWrapper>
                <LineFamilyChartTransformation
                    config={visConfig}
                    data={this.state.result}
                />
            </IntlWrapper>
        );
    }

    public render() {
        const {
            afm,
            projectId,
            type,
            transformation
        } = this.props;

        if (this.state.error) {
            return <h1>Error</h1>;
        }

        return (
            <Execute
                className={`gdc-${type}-chart`}
                afm={afm}
                transformation={transformation}
                onError={this.onError}
                onExecute={this.onExecute}
                onLoading={this.onLoading}
                projectId={projectId}
            >
                {this.getComponent()}
            </Execute>
        );
    }
}
