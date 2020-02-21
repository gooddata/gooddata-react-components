// (C) 2007-2020 GoodData Corporation
import { IConvertedAFM } from "@gooddata/gooddata-js/lib/DataLayer/converters/toAfmResultSpec";
import * as React from "react";
import {
    SDK,
    factory as createSdk,
    DataLayer,
    ApiResponse,
    IProperties,
    IPropertiesControls,
    IFeatureFlags,
} from "@gooddata/gooddata-js";
import get = require("lodash/get");
import noop = require("lodash/noop");
import isEqual = require("lodash/isEqual");
import { AFM, VisualizationObject, VisualizationClass, Localization } from "@gooddata/typings";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { IHeaderPredicate } from "../../interfaces/HeaderPredicate";
import { IntlWrapper } from "../core/base/IntlWrapper";
import { BaseChart } from "../core/base/BaseChart";
import { IAxisConfig, IChartConfig, IColorPaletteItem } from "../../interfaces/Config";
import { IGeoConfig } from "../../interfaces/GeoChart";
import { PivotTable } from "../PivotTable";
import { GeoPushpinChart } from "../GeoPushpinChart";
import { Headline } from "../core/Headline";
import { Xirr } from "../core/Xirr";
import { IEvents, OnLegendReady } from "../../interfaces/Events";
import { VisualizationPropType, Requireable } from "../../proptypes/Visualization";
import { VisualizationTypes, VisType } from "../../constants/visualizationTypes";
import { IDataSource } from "../../interfaces/DataSource";
import { ISubject } from "../../helpers/async";
import { isChartConfig, isGeoConfig } from "../../helpers/geoChart";
import { getVisualizationTypeFromVisualizationClass } from "../../helpers/visualizationType";
import MdObjectHelper, {
    areAllMeasuresOnSingleAxis,
    mdObjectToGeoPushpinBucketProps,
    mdObjectToPivotBucketProps,
} from "../../helpers/MdObjectHelper";
import { fillMissingTitles } from "../../helpers/measureTitleHelper";
import { LoadingComponent, ILoadingProps } from "../simple/LoadingComponent";
import { ErrorComponent, IErrorProps } from "../simple/ErrorComponent";
import { IDrillableItem, generateDimensions, RuntimeError } from "../../";
import { setTelemetryHeaders } from "../../helpers/utils";
import { getDefaultBarChartSort, getDefaultTreemapSort } from "../../helpers/sorts";
import { convertErrors, generateErrorMap, IErrorMap } from "../../helpers/errorHandlers";
import { isBarChart, isTreemap } from "../visualizations/utils/common";
import { getColorMappingPredicate, getColorPaletteFromColors } from "../visualizations/utils/color";
import { getCachedOrLoad } from "../../helpers/sdkCache";
import { getFeatureFlags, setConfigFromFeatureFlags } from "../../helpers/featureFlags";
import { mergeFiltersToAfm } from "../../helpers/afmHelper";
import { _experimentalDataSourceFactory } from "./experimentalDataSource";
import IVisualizationObjectContent = VisualizationObject.IVisualizationObjectContent;
import { getHighchartsAxisNameConfiguration } from "../../internal/utils/propertiesHelper";

export { Requireable };

const { ExecuteAfmAdapter, toAfmResultSpec, createSubject } = DataLayer;

interface ISortingConfigs {
    canSortStackTotalValue: boolean;
    enableSortingByTotalGroup: boolean;
}

export type VisualizationEnvironment = "none" | "dashboards";

export interface IVisualizationProps extends IEvents {
    projectId: string;
    sdk?: SDK;
    uri?: string;
    identifier?: string;
    locale?: Localization.ILocale;
    config?: IChartConfig | IGeoConfig;
    filters?: AFM.ExtendedFilter[];
    drillableItems?: Array<IDrillableItem | IHeaderPredicate>;
    uriResolver?: (sdk: SDK, projectId: string, uri?: string, identifier?: string) => Promise<string>;
    fetchVisObject?: (
        sdk: SDK,
        visualizationUri: string,
    ) => Promise<VisualizationObject.IVisualizationObject>;
    fetchVisualizationClass?: (
        sdk: SDK,
        visualizationUri: string,
    ) => Promise<VisualizationClass.IVisualizationClass>;
    getFeatureFlags?: (sdk: SDK, projectId: string) => Promise<IFeatureFlags>;
    BaseChartComponent?: any;
    PivotTableComponent?: any;
    GeoPushpinChartComponent?: any;
    HeadlineComponent?: any;
    XirrComponent?: any;
    ErrorComponent?: React.ComponentType<IErrorProps>;
    LoadingComponent?: React.ComponentType<ILoadingProps>;
    onLegendReady?: OnLegendReady;
    /**
     * If specified and true, the Visualization component will use new executeVisualization API to obtain
     * data to visualize; this functionality is experimental at the moment and is intended for GoodData internal
     * testing and validation.
     */
    experimentalVisExecution?: boolean;
    // this is used internaly for Geo chart's storybook
    afterRender?: () => void;
}

export interface IVisualizationState {
    isLoading: boolean;
    resultSpec: AFM.IResultSpec;
    type: VisType;
    totals: VisualizationObject.IVisualizationTotal[];
    error?: RuntimeError;
    mdObject?: VisualizationObject.IVisualizationObject;
    colorPalette: IColorPaletteItem[];
    colorPaletteEnabled: boolean;
    featureFlags: IFeatureFlags;
}

export interface IVisualizationExecInfo {
    dataSource: IDataSource;
    resultSpec: AFM.IResultSpec;
    featureFlags: IFeatureFlags;
    type: VisType;
    totals: VisualizationObject.IVisualizationTotal[];
    mdObject: VisualizationObject.IVisualizationObject;
}

function uriResolver(sdk: SDK, projectId: string, uri?: string, identifier?: string): Promise<string> {
    if (uri) {
        return Promise.resolve(uri);
    }

    if (!identifier) {
        return Promise.reject("Neither uri or identifier specified");
    }

    return sdk.md.getObjectUri(projectId, identifier);
}

function fetchVisObject(
    sdk: SDK,
    visualizationUri: string,
): Promise<VisualizationObject.IVisualizationObject> {
    return sdk.md.getVisualization(visualizationUri).then(res => res.visualizationObject);
}

function fetchVisualizationClass(
    sdk: SDK,
    visualizationClassUri: string,
): Promise<VisualizationClass.IVisualizationClass> {
    const apiCallIdentifier = `get.${visualizationClassUri}`;
    const loader = () => sdk.xhr.get(visualizationClassUri);
    return getCachedOrLoad(apiCallIdentifier, loader).then(
        (response: ApiResponse) => response.data.visualizationClass,
    );
}

export class VisualizationWrapped extends React.Component<
    IVisualizationProps & WrappedComponentProps,
    IVisualizationState
> {
    public static propTypes = VisualizationPropType;

    public static defaultProps: Partial<IVisualizationProps & WrappedComponentProps> = {
        onError: noop,
        onLegendReady: noop,
        filters: [],
        uriResolver,
        fetchVisObject,
        fetchVisualizationClass,
        getFeatureFlags,
        BaseChartComponent: BaseChart,
        PivotTableComponent: PivotTable,
        GeoPushpinChartComponent: GeoPushpinChart,
        HeadlineComponent: Headline,
        XirrComponent: Xirr,
        ErrorComponent,
        LoadingComponent,
        onExportReady: noop,
        experimentalVisExecution: false,
    };

    private visualizationUri: string;
    private adapter: DataLayer.ExecuteAfmAdapter;
    private dataSource: IDataSource;

    private subject: ISubject<Promise<IVisualizationExecInfo>>;

    private errorMap: IErrorMap;

    private exportTitle: string;

    private sdk: SDK;

    private isUnmounted: boolean;

    constructor(props: IVisualizationProps & WrappedComponentProps) {
        super(props);

        this.state = {
            isLoading: true,
            type: null,
            resultSpec: null,
            totals: [],
            error: null,
            mdObject: null,
            colorPalette: null,
            colorPaletteEnabled: false,
            featureFlags: {},
        };

        this.sdk = props.sdk ? props.sdk.clone() : createSdk();
        setTelemetryHeaders(this.sdk, "Visualization", props);

        this.isUnmounted = false;
        this.visualizationUri = props.uri;

        this.errorMap = generateErrorMap(props.intl);

        this.subject = createSubject<IVisualizationExecInfo>(
            ({ type, resultSpec, dataSource, totals, mdObject, featureFlags }) => {
                this.dataSource = dataSource;
                this.setStateWithCheck({
                    type,
                    resultSpec,
                    isLoading: false,
                    totals,
                    mdObject,
                    featureFlags,
                });
            },
            error => {
                const runtimeError = convertErrors(error);
                this.setStateWithCheck({
                    isLoading: false,
                    error: runtimeError,
                });
                return props.onError(runtimeError);
            },
        );
    }

    public componentDidMount() {
        const { projectId, uri, identifier, filters } = this.props;

        this.adapter = new ExecuteAfmAdapter(this.sdk, projectId);
        this.visualizationUri = uri;

        this.subject.next(this.prepareDataSources(projectId, identifier, filters));

        this.getColorPalette();
    }

    public componentWillUnmount() {
        this.subject.unsubscribe();
        this.isUnmounted = true;
    }

    public shouldComponentUpdate(nextProps: IVisualizationProps, nextState: IVisualizationState) {
        return (
            this.hasChangedProps(nextProps) ||
            this.state.isLoading !== nextState.isLoading ||
            (!this.state.colorPalette && nextState.colorPalette !== null)
        );
    }

    public hasChangedProps(
        nextProps: IVisualizationProps,
        propKeys = Object.keys(VisualizationPropType),
    ): boolean {
        return propKeys.some(propKey => !isEqual(this.props[propKey], nextProps[propKey]));
    }

    public componentWillReceiveProps(nextProps: IVisualizationProps & WrappedComponentProps) {
        if (nextProps.sdk && this.props.sdk !== nextProps.sdk) {
            this.sdk = nextProps.sdk.clone();
            setTelemetryHeaders(this.sdk, "Visualization", nextProps);
            this.getColorPalette();
        }
        const hasInvalidResolvedUri = this.hasChangedProps(nextProps, ["uri", "projectId", "identifier"]);
        const hasInvalidDatasource = hasInvalidResolvedUri || this.hasChangedProps(nextProps, ["filters"]);
        if (hasInvalidDatasource) {
            this.setStateWithCheck({
                isLoading: true,
            });
            if (hasInvalidResolvedUri) {
                this.visualizationUri = nextProps.uri;
            }

            this.subject.next(
                this.prepareDataSources(nextProps.projectId, nextProps.identifier, nextProps.filters),
            );
        }
    }

    public render() {
        const { dataSource, sdk } = this;
        const {
            afterRender,
            projectId,
            drillableItems,
            onFiredDrillEvent,
            onDrill,
            onLegendReady,
            onError,
            onLoadingChanged,
            locale,
            BaseChartComponent,
            PivotTableComponent,
            GeoPushpinChartComponent,
            HeadlineComponent,
            XirrComponent,
            LoadingComponent,
            ErrorComponent,
            onExportReady,
            filters: filtersFromProps,
        } = this.props;
        const { resultSpec, type, error, isLoading, mdObject } = this.state;

        if (error) {
            return this.renderError(error);
        } else if (isLoading || !dataSource) {
            return LoadingComponent ? <LoadingComponent /> : null;
        }

        const config = this.createVisualizationConfig();
        const commonProps = {
            sdk,
            projectId,
            drillableItems,
            onFiredDrillEvent,
            onDrill,
            onError,
            onLoadingChanged,
            LoadingComponent,
            ErrorComponent,
            locale,
            config,
            exportTitle: this.exportTitle,
            onExportReady,
        };

        const sourceProps = {
            resultSpec,
            dataSource,
        };

        switch (type) {
            case VisualizationTypes.TABLE: {
                const processedVisualizationObject = {
                    ...mdObject,
                    content: fillMissingTitles(mdObject.content, locale),
                };
                this.exportTitle = get(processedVisualizationObject, "meta.title", "");
                const pivotBucketProps = mdObjectToPivotBucketProps(
                    processedVisualizationObject,
                    filtersFromProps,
                );
                // we do not need to pass totals={totals} because BucketPivotTable deals with changes in totals itself
                return <PivotTableComponent {...commonProps} {...pivotBucketProps} />;
            }
            case VisualizationTypes.PUSHPIN:
                const geoBucketProps = mdObjectToGeoPushpinBucketProps(
                    isGeoConfig(config) && config,
                    mdObject,
                    filtersFromProps,
                );
                return (
                    <GeoPushpinChartComponent
                        {...commonProps}
                        {...geoBucketProps}
                        afterRender={afterRender}
                    />
                );
            case VisualizationTypes.HEADLINE:
                return <HeadlineComponent {...commonProps} {...sourceProps} />;
            case VisualizationTypes.XIRR:
                return <XirrComponent {...commonProps} {...sourceProps} />;
            default:
                return (
                    <BaseChartComponent
                        {...commonProps}
                        {...sourceProps}
                        onLegendReady={onLegendReady}
                        type={type}
                    />
                );
        }
    }

    private renderError(error: RuntimeError) {
        const { intl, ErrorComponent } = this.props;
        const errorProps = this.errorMap[error.getMessage()];

        return ErrorComponent ? (
            <ErrorComponent
                code={error.getMessage()}
                message={intl.formatMessage({ id: "visualization.ErrorMessageGeneric" })}
                description={intl.formatMessage({ id: "visualization.ErrorDescriptionGeneric" })}
                {...errorProps}
            />
        ) : null;
    }

    private createVisualizationConfig(): IChartConfig {
        const { config } = this.props;
        const { featureFlags, mdObject, colorPalette } = this.state;
        const mdObjectContent = mdObject && mdObject.content;

        return setConfigFromFeatureFlags(
            mergeChartConfigWithProperties(config, mdObjectContent, colorPalette, featureFlags),
            featureFlags,
        );
    }

    private async prepareDataSources(
        projectId: string,
        identifier: string,
        filters: AFM.ExtendedFilter[] = [],
    ): Promise<IVisualizationExecInfo> {
        const { uriResolver, fetchVisObject, fetchVisualizationClass, locale, getFeatureFlags } = this.props;

        // gather all essential information from backend

        const visualizationUri = await uriResolver(this.sdk, projectId, this.visualizationUri, identifier);
        const mdObject = await fetchVisObject(this.sdk, visualizationUri);
        const visualizationClassUri: string = MdObjectHelper.getVisualizationClassUri(mdObject);
        const visualizationClass = await fetchVisualizationClass(this.sdk, visualizationClassUri);
        const featureFlags = await getFeatureFlags(this.sdk, projectId);
        const visualizationType: VisType = await getVisualizationTypeFromVisualizationClass(
            visualizationClass,
        );

        this.visualizationUri = visualizationUri;
        this.exportTitle = get(mdObject, "meta.title", "");

        const mdObjectContent: IVisualizationObjectContent = mdObject.content;
        const mdObjectContentProperties: IProperties | undefined =
            mdObjectContent && mdObjectContent.properties && JSON.parse(mdObject.content.properties);
        const secondaryYAxis: IAxisConfig =
            get(this.props.config, ["secondary_yaxis"], undefined) ||
            get(mdObjectContentProperties, ["controls", "secondary_yaxis"], undefined);
        // don't support sort by total value for dual axis
        const canSortStackTotalValue: boolean =
            get(mdObjectContentProperties, ["controls", "stackMeasures"], false) &&
            areAllMeasuresOnSingleAxis(mdObject.content, secondaryYAxis);

        const sortingConfigs: ISortingConfigs = {
            canSortStackTotalValue,
            enableSortingByTotalGroup: featureFlags.enableSortingByTotalGroup as boolean,
        };
        const { afm, resultSpec } = buildAfmResultSpec(
            mdObject.content,
            visualizationType,
            locale,
            sortingConfigs,
        );
        const mdObjectTotals = MdObjectHelper.getTotals(mdObject);

        const dataSource = await this.createDataSource(afm, filters);

        return {
            type: visualizationType,
            dataSource,
            resultSpec,
            totals: mdObjectTotals,
            mdObject,
            featureFlags,
        };
    }

    private createDataSource(afm: AFM.IAfm, filters: AFM.ExtendedFilter[]): Promise<IDataSource> {
        const { projectId, experimentalVisExecution } = this.props;

        if (experimentalVisExecution) {
            /*
             * using experimental executeVisualization endpoint allows server to apply additional security
             * measures on what is the client allowed to see/calculate.
             *
             * ideally, this factory would only take project+uri+filters => that is enough for the backend.
             *
             * however in practice, the returned data source MUST return valid AFM as this is later retrieved from the
             * dataSource and is used for various purposes (such as coloring the charts)
             *
             * We have ONE-3961 as followup to take this out of experimental mode.
             */
            return _experimentalDataSourceFactory(this.sdk, projectId, this.visualizationUri, afm, filters);
        }

        /*
         * the use of data source adapter leads to calls to execute AFM; custom filters for
         * the Visualization must be merged with AFM on the client-side
         *
         * we also need to sync the projectId to properly handle cases when projectId changes
         */
        this.adapter.projectId = projectId;
        return this.adapter.createDataSource(mergeFiltersToAfm(afm, filters));
    }

    private hasExternalColorPalette() {
        return this.props.config && isChartConfig(this.props.config) && this.props.config.colorPalette;
    }

    private hasColorsProp() {
        return this.props.config && isChartConfig(this.props.config) && this.props.config.colors;
    }

    private getColorPaletteFromProject() {
        const apiCallIdentifier = `getColorPaletteWithGuids.${this.props.projectId}`;
        const loader = () => this.sdk.project.getColorPaletteWithGuids(this.props.projectId);
        return getCachedOrLoad(apiCallIdentifier, loader);
    }

    private async getColorPalette() {
        if (!this.isUnmounted) {
            if (this.hasExternalColorPalette()) {
                return;
            } else if (this.hasColorsProp()) {
                this.setStateWithCheck({
                    colorPalette: getColorPaletteFromColors(
                        isChartConfig(this.props.config) && this.props.config.colors,
                    ),
                });
            } else {
                const colorPalette = await this.getColorPaletteFromProject();

                if (colorPalette) {
                    this.setStateWithCheck({ colorPalette });
                }
            }
        }
    }

    private setStateWithCheck(newState: any, callBack?: () => void) {
        if (!this.isUnmounted) {
            this.setState(newState, callBack);
        }
    }
}

/**
 * Given visualization object and type of visualization, this function builds AFM + ResultSpec combination
 * to be used for AFM Execution of the given vis object.
 *
 * The function ensures that any missing measure titles are filled in and that the ResultSpec matches the type of visualization.
 *
 * @param visObj content of visualization object
 * @param visType type of visualization - as recognized by SDK
 * @param locale locale to use when filling missing measure titles
 */
function buildAfmResultSpec(
    visObj: IVisualizationObjectContent,
    visType: VisType,
    locale: Localization.ILocale,
    sortingConfigs: ISortingConfigs,
): IConvertedAFM {
    const updatedVisObj = fillMissingTitles(visObj, locale);
    const genericAfmResultSpec = toAfmResultSpec(updatedVisObj);

    return buildAfmResultSpecForVis(updatedVisObj, visType, genericAfmResultSpec, sortingConfigs);
}

function buildAfmResultSpecForVis(
    visObj: IVisualizationObjectContent,
    visType: VisType,
    afmResultSpec: IConvertedAFM,
    sortingConfigs: ISortingConfigs,
) {
    const resultSpecWithDimensions = {
        ...afmResultSpec.resultSpec,
        dimensions: generateDimensions(visObj, visType),
    };

    const { canSortStackTotalValue = false, enableSortingByTotalGroup = false } = sortingConfigs;
    const barChartDefaultSorting =
        enableSortingByTotalGroup && isBarChart(visType)
            ? {
                  sorts: getDefaultBarChartSort(
                      afmResultSpec.afm,
                      resultSpecWithDimensions,
                      canSortStackTotalValue,
                      enableSortingByTotalGroup,
                  ),
              }
            : {};

    const treemapDefaultSorting = isTreemap(visType)
        ? {
              sorts: getDefaultTreemapSort(afmResultSpec.afm, resultSpecWithDimensions),
          }
        : {};

    const resultSpec = {
        ...resultSpecWithDimensions,
        ...barChartDefaultSorting,
        ...treemapDefaultSorting,
    };

    return {
        afm: afmResultSpec.afm,
        resultSpec,
    };
}

/**
 * Given chart config and visualization object, this function will:
 * - merge chart customization contained within vis obj properties with the provided chart config
 * - apply chart coloring according to information in vis object properties
 *
 * Chart coloring will use palette included in the config; if there is no palette it will fall back to the
 * provided palette
 *
 * @param config base configuration of the chart
 * @param visObj content of visualization obtain that MAY contain properties to merge with the base configuration
 * @param fallbackPalette color palette to fall back to in case there is no palette stored in `config`
 * @returns new instance of IChartConfig
 */
function mergeChartConfigWithProperties(
    config: IChartConfig,
    visObj: IVisualizationObjectContent,
    fallbackPalette: IColorPaletteItem[],
    featureFlags: IFeatureFlags,
): IChartConfig {
    const properties: IPropertiesControls | undefined =
        visObj && visObj.properties && JSON.parse(visObj.properties).controls;

    const colorPalette = config && config.colorPalette ? config.colorPalette : fallbackPalette;

    const colorMapping =
        properties && properties.colorMapping
            ? properties.colorMapping.map(mapping => {
                  const predicate = getColorMappingPredicate(mapping.id);
                  return {
                      predicate,
                      color: mapping.color,
                  };
              })
            : undefined;

    const propsWithHCAxisNameConfig = getHighchartsAxisNameConfiguration(
        properties,
        featureFlags.enableAxisNameConfiguration as boolean,
    );

    return {
        ...propsWithHCAxisNameConfig,
        colorMapping,
        ...config,
        colorPalette,
        mdObject: visObj,
    };
}

export const IntlVisualization = injectIntl(VisualizationWrapped);

/**
 * [Visualization](http://sdk.gooddata.com/gooddata-ui/docs/react_components.html#visualization)
 * is a component that renders saved visualization based on projectId and either identifier or uri
 */
export class Visualization extends React.PureComponent<IVisualizationProps> {
    public render() {
        return (
            <IntlWrapper locale={this.props.locale}>
                <IntlVisualization {...this.props} />
            </IntlWrapper>
        );
    }
}
