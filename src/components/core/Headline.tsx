import * as React from 'react';
import noop = require('lodash/noop');
import { HeadlineTransformation } from '@gooddata/indigo-visualizations';
import { Execution } from '@gooddata/typings';

import { IntlWrapper } from './base/IntlWrapper';
import { IntlTranslationsProvider, ITranslationsComponentProps } from './base/TranslationsProvider';
import { fixEmptyHeaderItems } from './base/utils/fixEmptyHeaderItems';
import { HeadlinePropTypes, Requireable } from '../../proptypes/Headline';

import { ErrorStates } from '../../constants/errorStates';

import { IBaseVisualizationProps, IBaseVisualizationState, BaseVisualization } from './base/BaseVisualization';

export { Requireable };

const defaultErrorHandler = (error: any) => {
    if (error && error.status !== ErrorStates.OK) {
        console.error(error); // tslint:disable-line:no-console
    }
};

export class Headline extends BaseVisualization<IBaseVisualizationProps, IBaseVisualizationState> {
    public static defaultProps: Partial<IBaseVisualizationProps> = {
        resultSpec: {},
        onError: defaultErrorHandler,
        onLoadingChanged: noop,
        ErrorComponent: null,
        LoadingComponent: null,
        afterRender: noop,
        pushData: noop,
        locale: 'en-US',
        drillableItems: [],
        onFiredDrillEvent: noop
    };

    public static propTypes = HeadlinePropTypes;

    constructor(props: IBaseVisualizationProps) {
        super(props);
    }

    protected renderVisualization(): JSX.Element {
        const {
            afterRender,
            drillableItems,
            locale,
            dataSource,
            resultSpec
        } = this.props;
        const { result } = this.state;
        const {
            executionResponse,
            executionResult
        } = (result as Execution.IExecutionResponses);

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(props: ITranslationsComponentProps) => (
                        <HeadlineTransformation
                            onAfterRender={afterRender}
                            drillableItems={drillableItems}
                            executionRequest={{
                                afm: dataSource.getAfm(),
                                resultSpec
                            }}
                            executionResponse={executionResponse.executionResponse}
                            executionResult={
                                fixEmptyHeaderItems(executionResult, props.emptyHeaderString).executionResult
                            }
                        />
                    )}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}
