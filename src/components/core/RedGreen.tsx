// (C) 2007-2018 GoodData Corporation
import * as React from "react";
import { IntlWrapper } from "./base/IntlWrapper";
import { IntlTranslationsProvider, ITranslationsComponentProps } from "./base/TranslationsProvider";
import { fixEmptyHeaderItems } from "./base/utils/fixEmptyHeaderItems";
import { Requireable } from "../../proptypes/Headline";
import { IDataSourceProviderInjectedProps } from "../afm/DataSourceProvider";
import {
    ICommonVisualizationProps,
    visualizationLoadingHOC,
    ILoadingInjectedProps,
    commonDefaultProps,
} from "./base/VisualizationLoadingHOC";
import { BaseVisualization } from "./base/BaseVisualization";
import RedGreenTransformation from "../visualizations/redGreen/RedGreenTransformation";

export { Requireable };

export interface IRedGreenProps extends ICommonVisualizationProps {
    limit?: string;
}

export class RedGreenStateless extends BaseVisualization<
    IRedGreenProps & ILoadingInjectedProps & IDataSourceProviderInjectedProps,
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
            config,
        } = this.props;

        return (
            <IntlWrapper locale={locale}>
                <IntlTranslationsProvider>
                    {(props: ITranslationsComponentProps) => (
                        <RedGreenTransformation
                            onAfterRender={afterRender}
                            onFiredDrillEvent={onFiredDrillEvent}
                            drillableItems={drillableItems}
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

export const RedGreen = visualizationLoadingHOC(RedGreenStateless);
