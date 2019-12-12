// (C) 2019 GoodData Corporation
import * as React from "react";

import {
    ICommonVisualizationProps,
    ILoadingInjectedProps,
    visualizationLoadingHOC,
    commonDefaultProps,
} from "./base/VisualizationLoadingHOC";
import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import { BaseVisualization } from "./base/BaseVisualization";
import { IntlWrapper } from "./base/IntlWrapper";
import { IntlTranslationsProvider, ITranslationsComponentProps } from "./base/TranslationsProvider";
import XirrTransformation from "../visualizations/headline/XirrTransformation";
import { fixEmptyHeaderItems } from "./base/utils/fixEmptyHeaderItems";

export class XirrStateless extends BaseVisualization<
    ICommonVisualizationProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps,
    {}
> {
    public static defaultProps: Partial<ICommonVisualizationProps> = commonDefaultProps;

    protected renderVisualization(): JSX.Element {
        const {
            afterRender,
            drillableItems,
            locale,
            dataSource,
            resultSpec,
            execution,
            onFiredDrillEvent,
            onDrill,
            config,
        } = this.props;

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(props: ITranslationsComponentProps) => (
                        <XirrTransformation
                            onAfterRender={afterRender}
                            onFiredDrillEvent={onFiredDrillEvent}
                            drillableItems={drillableItems}
                            onDrill={onDrill}
                            config={config}
                            executionRequest={{
                                afm: dataSource.getAfm(),
                                resultSpec,
                            }}
                            executionResponse={execution.executionResponse}
                            executionResult={fixEmptyHeaderItems(
                                execution.executionResult,
                                props.emptyHeaderString,
                            )}
                        />
                    )}
                </IntlTranslationsProvider>
            </IntlWrapper>
        );
    }
}

export const Xirr = visualizationLoadingHOC(XirrStateless);
