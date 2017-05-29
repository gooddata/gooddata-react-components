import * as React from 'react';
import noop = require('lodash/noop');
import LineFamilyChartTransformation from '@gooddata/indigo-visualizations/lib/Chart/LineFamilyChartTransformation';
import { Execute } from '../execution/Execute';
import { IAfm } from '../../interfaces/Afm';
import { ITransformation } from '../../interfaces/Transformation';
import { IntlWrapper } from './IntlWrapper';
import { generateConfig } from '../../helpers/config';
import { IEvents } from './events';
import { DATA_TOO_LARGE_DISPLAY } from './errorStates';


export type LineFamilyChartTypes = 'line' | 'bar' | 'column';

export interface ILineFamilyChartConfig {
    colors?: String[];
    legend?: {
        enabled?: boolean;
        position?: 'top' | 'left' | 'right' | 'bottom';
    };
    limits?: {
        series?: Number,
        categories?: Number
    };
}

export interface ILineFamilyChartProps extends IEvents {
    afm: IAfm;
    projectId: string;
    transformation: ITransformation;
    config?: ILineFamilyChartConfig;
    type: LineFamilyChartTypes;
}

export interface ILineFamilyChartState {
    error: boolean;
    result: any;
    isLoading: boolean;
}

const defaultErrorHandler = (error) => {
    console.error(error);
};

export class LineFamilyChart extends React.Component<ILineFamilyChartProps, ILineFamilyChartState> {
    public static defaultProps: Partial<ILineFamilyChartProps> = {
        onError: defaultErrorHandler,
        onLoadingChanged: noop,
        config: {}
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
        this.setState({ result: data, error: false });
    }

    public onError(error) {
        this.setState({ error: true });
        this.props.onError(error);
    }

    public onLoading(isLoading: boolean) {
        this.setState({ isLoading });
        this.props.onLoadingChanged({ isLoading });
    }

    public getComponent() {
        if (this.state.isLoading) {
            return null;
        }

        const { type, afm, config, transformation } = this.props;

        const visConfig = generateConfig(type, afm, transformation, config);

        return (
            <IntlWrapper>
                <LineFamilyChartTransformation
                    config={visConfig}
                    data={this.state.result}
                    onDataTooLarge={() => this.onError({ status: DATA_TOO_LARGE_DISPLAY })}
                    limits={config.limits}
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
            return null;
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
