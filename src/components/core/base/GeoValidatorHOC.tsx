// (C) 2020 GoodData Corporation
import * as React from "react";
import isEqual = require("lodash/isEqual");
import { injectIntl } from "react-intl";
import { IColorItem } from "@gooddata/gooddata-js";

import { IGeoChartInnerProps } from "../geoChart/GeoChartInner";
import { IntlWrapper } from "./IntlWrapper";
import { ErrorComponent as DefaultErrorComponent } from "../../simple/ErrorComponent";
import { ErrorStates } from "../../../constants/errorStates";
import { RuntimeError } from "../../../errors/RuntimeError";
import { generateErrorMap, IErrorMap } from "../../../helpers/errorHandlers";
import { isLocationMissing } from "../../../helpers/geoChart/common";
import { IGeoConfig } from "../../../interfaces/GeoChart";
import { IColorMapping } from "../../../interfaces/Config";

type IGeoValidatorProps = IGeoChartInnerProps;

export function geoValidatorHOC<T>(InnerComponent: React.ComponentClass<T>): React.ComponentClass<T> {
    class ValidatorHOCWrapped extends React.Component<T & IGeoValidatorProps> {
        private readonly errorMap: IErrorMap;

        private isLocationMissing: boolean;
        private isMapboxTokenMissing: boolean;

        constructor(props: T & IGeoValidatorProps) {
            super(props);
            this.errorMap = generateErrorMap(props.intl);
        }

        public render() {
            this.initError();

            if (this.isMapboxTokenMissing) {
                return this.renderErrorComponent(ErrorStates.GEO_MAPBOX_TOKEN_MISSING);
            }

            if (this.isLocationMissing) {
                return this.renderErrorComponent(ErrorStates.GEO_LOCATION_MISSING);
            }

            return <InnerComponent key={"InnerComponent"} {...this.props} />;
        }

        public shouldComponentUpdate(nextProps: IGeoValidatorProps): boolean {
            const { config, dataSource, drillableItems } = this.props;
            const {
                config: nextConfig,
                dataSource: nextDataSource,
                drillableItems: nextDrillableItems,
            } = nextProps;

            // check if buckets, filters and config are changed
            const isSameConfig = this.isSameConfig(config, nextConfig);
            const isSameDataSource = isEqual(dataSource.getAfm(), nextDataSource.getAfm());
            const isSameDrillableItems = isEqual(drillableItems, nextDrillableItems);

            return !isSameConfig || !isSameDataSource || !isSameDrillableItems;
        }

        public componentDidUpdate(): void {
            this.handleError();
        }

        public componentDidMount(): void {
            this.handleError();
        }

        private initError() {
            const {
                config: { mdObject: { buckets = [] } = {}, mapboxToken },
            } = this.props;
            this.isLocationMissing = isLocationMissing(buckets);
            this.isMapboxTokenMissing = !Boolean(mapboxToken);
        }

        private handleError() {
            const { onError } = this.props;
            if (onError && this.isLocationMissing) {
                onError(new RuntimeError(ErrorStates.GEO_LOCATION_MISSING));
            }
        }

        private renderErrorComponent(errorState: string): React.ReactElement {
            const ErrorComponent = this.props.ErrorComponent || DefaultErrorComponent;
            // in this case, we show "Sorry, we can't display this insight"
            const errorProps = this.errorMap[errorState] || this.errorMap[ErrorStates.UNKNOWN_ERROR];

            return <ErrorComponent code={errorState} {...errorProps} />;
        }

        private isSameConfig(config: IGeoConfig, nextConfig: IGeoConfig): boolean {
            const colorMapping = (config.colorMapping || []).map(
                (currentColor: IColorMapping): IColorItem => currentColor.color,
            );
            const nextColorMapping = (nextConfig.colorMapping || []).map(
                (newColor: IColorMapping): IColorItem => newColor.color,
            );
            const configProps = {
                ...config,
                colorMapping,
            };
            const nextConfigProps = {
                ...nextConfig,
                colorMapping: nextColorMapping,
            };

            return isEqual(configProps, nextConfigProps);
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
