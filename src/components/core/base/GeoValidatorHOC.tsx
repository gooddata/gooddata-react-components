// (C) 2020 GoodData Corporation
import * as React from "react";
import isEqual = require("lodash/isEqual");
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
    class ValidatorHOCWrapped extends React.Component<T & IGeoValidatorProps> {
        private readonly errorMap: IErrorMap;

        private isLocationMissing: boolean;

        constructor(props: T & IGeoValidatorProps) {
            super(props);
            this.errorMap = generateErrorMap(props.intl);
        }

        public render() {
            this.initError();

            if (this.isLocationMissing) {
                const ErrorComponent = this.props.ErrorComponent || DefaultErrorComponent;
                // in this case, we show "Sorry, we can't display this insight"
                const errorProps = this.errorMap[ErrorStates.UNKNOWN_ERROR];
                return <ErrorComponent code={ErrorStates.GEO_LOCATION_MISSING} {...errorProps} />;
            }

            return <InnerComponent key={"InnerComponent"} {...this.props} />;
        }

        public shouldComponentUpdate(nextProps: IGeoValidatorProps): boolean {
            const { config } = this.props;
            const { config: nextConfig } = nextProps;
            // check if buckets, filters and config are changed
            return !isEqual(config, nextConfig);
        }

        public componentDidUpdate(): void {
            this.handleError();
        }

        public componentDidMount(): void {
            this.handleError();
        }

        private initError() {
            const {
                config: { mdObject: { buckets = [] } = {} },
            } = this.props;
            this.isLocationMissing = isLocationMissing(buckets);
        }

        private handleError() {
            const { onError } = this.props;
            if (onError && this.isLocationMissing) {
                onError(new RuntimeError(ErrorStates.GEO_LOCATION_MISSING));
            }
        }
    }

    const IntlValidatorHOC = injectIntl<"intl", T & IGeoValidatorProps>(ValidatorHOCWrapped);

    return class ValidatorHOC extends React.Component<T & IGeoValidatorProps, null> {
        public render() {
            return (
                <IntlWrapper locale={this.props.locale}>
                    <IntlValidatorHOC {...this.props} />
                </IntlWrapper>
            );
        }
    };
}
