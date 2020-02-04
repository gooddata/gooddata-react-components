// (C) 2020 GoodData Corporation
import * as React from "react";
import { injectIntl } from "react-intl";

import { IGeoChartInnerProps } from "../GeoChart";
import { IntlWrapper } from "./IntlWrapper";
import { ErrorComponent as DefaultErrorComponent } from "../../simple/ErrorComponent";
import { ErrorStates } from "../../../constants/errorStates";
import { RuntimeError } from "../../../errors/RuntimeError";
import { generateErrorMap, IErrorMap } from "../../../helpers/errorHandlers";
import { isLocationMissing } from "../../../helpers/geoChart";

type IGeoValidatorProps = IGeoChartInnerProps;

export function geoValidatorHOC<T>(InnerComponent: React.ComponentClass<T>): React.ComponentClass<T> {
    class LoadingHOCWrapped extends React.Component<T & IGeoValidatorProps> {
        private errorMap: IErrorMap;

        constructor(props: T & IGeoValidatorProps) {
            super(props);
            this.errorMap = generateErrorMap(props.intl);
        }

        public render() {
            const {
                config: { mdObject: { buckets = [] } = {} },
                onError,
            } = this.props;

            if (isLocationMissing(buckets)) {
                const error = ErrorStates.GEO_LOCATION_MISSING;
                if (onError) {
                    onError(new RuntimeError(error));
                }

                const errorProps = this.errorMap[error];
                const ErrorComponent = this.props.ErrorComponent || DefaultErrorComponent;
                return <ErrorComponent code={error} {...errorProps} />;
            }

            return <InnerComponent key={"InnerComponent"} {...this.props} />;
        }
    }

    const IntlLoadingHOC = injectIntl<"intl", T & IGeoValidatorProps>(LoadingHOCWrapped);

    return class LoadingHOC extends React.Component<T & IGeoValidatorProps, null> {
        public render() {
            return (
                <IntlWrapper locale={this.props.locale}>
                    <IntlLoadingHOC {...this.props} />
                </IntlWrapper>
            );
        }
    };
}
