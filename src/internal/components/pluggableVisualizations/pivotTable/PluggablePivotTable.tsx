// (C) 2019-2020 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import get = require("lodash/get");
import merge = require("lodash/merge");
import flatMap = require("lodash/flatMap");
import isNil = require("lodash/isNil");
import isEqual = require("lodash/isEqual");
import * as React from "react";
import ReactMeasure from "react-measure";
import { render } from "react-dom";
import { IntlShape } from "react-intl";
import { AFM, VisualizationObject } from "@gooddata/typings";
import produce from "immer";
import { configureOverTimeComparison, configurePercent } from "../../../utils/bucketConfig";
import UnsupportedConfigurationPanel from "../../configurationPanels/UnsupportedConfigurationPanel";
import { unmountComponentsAtNodes } from "../../../utils/domHelper";

import * as VisEvents from "../../../../interfaces/Events";
import * as BucketNames from "../../../../constants/bucketNames";
import {
    IBucket,
    IBucketFilter,
    IBucketItem,
    IExtendedReferencePoint,
    IFeatureFlags,
    ILocale,
    IReferencePoint,
    IVisCallbacks,
    IVisConstruct,
    IVisProps,
    IVisualizationPropertiesWrapper,
    IReferences,
    IVisualizationProperties,
} from "../../../interfaces/Visualization";

import { ATTRIBUTE, DATE, METRIC } from "../../../constants/bucket";

import {
    getAllItemsByType,
    getItemsFromBuckets,
    getTotalsFromBucket,
    removeDuplicateBucketItems,
    sanitizeFilters,
} from "../../../utils/bucketHelper";

import { setPivotTableUiConfig } from "../../../utils/uiConfigHelpers/pivotTableUiConfigHelper";
import { createInternalIntl } from "../../../utils/internalIntlProvider";
import { DEFAULT_PIVOT_TABLE_UICONFIG } from "../../../constants/uiConfig";
import { AbstractPluggableVisualization } from "../AbstractPluggableVisualization";
import {
    getColumnWidthsFromProperties,
    getReferencePointWithSupportedProperties,
    getSupportedProperties,
} from "../../../utils/propertiesHelper";
import { VisualizationEnvironment } from "../../../../components/uri/Visualization";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { IPivotTableProps, PivotTable } from "../../../../components/core/PivotTable";
import { generateDimensions } from "../../../../helpers/dimensions";
import { DEFAULT_LOCALE } from "../../../../constants/localization";
import { DASHBOARDS_ENVIRONMENT } from "../../../constants/properties";
import { ColumnWidthItem, IMenu, IPivotTableConfig } from "../../../../interfaces/PivotTable";
import {
    adaptReferencePointWidthItemsToPivotTable,
    adaptMdObjectWidthItemsToPivotTable,
} from "./widthItemsHelpers";
import { PIVOT_TABLE_SUPPORTED_PROPERTIES } from "../../../constants/supportedProperties";

import { getTableConfigFromFeatureFlags } from "../../../../helpers/featureFlags";
import {
    adaptMdObjectSortItemsToPivotTable,
    adaptReferencePointSortItemsToPivotTable,
    addDefaultSort,
} from "./sortItemsHelpers";

export const getColumnAttributes = (buckets: IBucket[]): IBucketItem[] => {
    return getItemsFromBuckets(
        buckets,
        [BucketNames.COLUMNS, BucketNames.STACK, BucketNames.SEGMENT],
        [ATTRIBUTE, DATE],
    );
};

export const getRowAttributes = (buckets: IBucket[]): IBucketItem[] => {
    return getItemsFromBuckets(
        buckets,
        [
            BucketNames.ATTRIBUTE,
            BucketNames.ATTRIBUTES,
            BucketNames.VIEW,
            BucketNames.TREND,
            BucketNames.LOCATION,
        ],
        [ATTRIBUTE, DATE],
    );
};

export class PluggablePivotTable extends AbstractPluggableVisualization {
    private projectId: string;
    private element: string;
    private configPanelElement: string;
    private callbacks: IVisCallbacks;
    private intl: IntlShape;
    private visualizationProperties: IVisualizationPropertiesWrapper;
    private references: IReferences;
    private locale: ILocale;
    private environment: VisualizationEnvironment;
    private featureFlags: IFeatureFlags;

    constructor(props: IVisConstruct) {
        super();
        this.projectId = props.projectId;
        this.element = props.element;
        this.configPanelElement = props.configPanelElement;
        this.callbacks = props.callbacks;
        this.references = props.references;
        this.locale = props.locale || DEFAULT_LOCALE;
        this.intl = createInternalIntl(this.locale);
        this.onExportReady = props.callbacks.onExportReady && this.onExportReady.bind(this);
        this.environment = props.environment;
        this.featureFlags = props.featureFlags || {};
        this.onColumnResized = this.onColumnResized.bind(this);
        this.handlePushData = this.handlePushData.bind(this);
        this.supportedPropertiesList = PIVOT_TABLE_SUPPORTED_PROPERTIES;
    }

    public unmount() {
        unmountComponentsAtNodes([this.element, this.configPanelElement]);
    }

    public update(
        options: IVisProps,
        visualizationProperties: IVisualizationPropertiesWrapper,
        mdObject: VisualizationObject.IVisualizationObjectContent,
        references: IReferences,
    ) {
        const propertiesWithOnlySupportedControls = getSupportedProperties(
            visualizationProperties,
            this.supportedPropertiesList,
        );

        const properties = visualizationProperties ? visualizationProperties.properties : {};

        const onlySupportedProperties: IVisualizationPropertiesWrapper = {
            properties: {
                ...properties, // we are ignoring propertiesMeta
                ...propertiesWithOnlySupportedControls,
            },
        };
        this.visualizationProperties = onlySupportedProperties;
        this.references = references;
        this.adaptPropertiesToMdObject(onlySupportedProperties, mdObject);
        this.renderVisualization(options, this.visualizationProperties, mdObject);
        this.renderConfigurationPanel(mdObject);
    }

    public getExtendedReferencePoint(
        referencePoint: IReferencePoint,
        previousReferencePoint?: IReferencePoint,
    ): Promise<IExtendedReferencePoint> {
        return Promise.resolve(
            produce<IExtendedReferencePoint>(
                referencePoint as IExtendedReferencePoint,
                referencePointDraft => {
                    referencePointDraft.uiConfig = cloneDeep(DEFAULT_PIVOT_TABLE_UICONFIG);

                    const buckets = referencePointDraft.buckets;
                    const measures = getAllItemsByType(buckets, [METRIC]);
                    const rowAttributes = getRowAttributes(buckets);
                    const previousRowAttributes =
                        previousReferencePoint && getRowAttributes(previousReferencePoint.buckets);

                    const columnAttributes = getColumnAttributes(buckets);
                    const previousColumnAttributes =
                        previousReferencePoint && getColumnAttributes(previousReferencePoint.buckets);

                    const totals = getTotalsFromBucket(buckets, BucketNames.ATTRIBUTE);

                    referencePointDraft.buckets = removeDuplicateBucketItems([
                        {
                            localIdentifier: BucketNames.MEASURES,
                            items: measures,
                        },
                        {
                            localIdentifier: BucketNames.ATTRIBUTE,
                            items: rowAttributes,
                            // This is needed because at the beginning totals property is
                            // missing from buckets. If we would pass empty array or
                            // totals: undefined, reference points would differ.
                            ...(totals.length > 0 ? { totals } : null),
                        },
                        {
                            localIdentifier: BucketNames.COLUMNS,
                            items: columnAttributes,
                        },
                    ]);

                    const filters: IBucketFilter[] = referencePointDraft.filters
                        ? flatMap(referencePointDraft.filters.items, item => item.filters)
                        : [];

                    const originalSortItems: AFM.SortItem[] = get(
                        referencePointDraft.properties,
                        "sortItems",
                        [],
                    );
                    const originalColumnWidths: ColumnWidthItem[] = get(
                        referencePointDraft.properties,
                        "controls.columnWidths",
                        [],
                    );
                    const columnWidths = adaptReferencePointWidthItemsToPivotTable(
                        originalColumnWidths,
                        measures,
                        rowAttributes,
                        columnAttributes,
                        previousRowAttributes ? previousRowAttributes : [],
                        previousColumnAttributes ? previousColumnAttributes : [],
                        filters,
                    );
                    const controlsObj =
                        this.featureFlags.enableTableColumnsManualResizing || columnWidths.length > 0
                            ? {
                                  controls: {
                                      columnWidths,
                                  },
                              }
                            : {};

                    referencePointDraft.properties = {
                        sortItems: addDefaultSort(
                            adaptReferencePointSortItemsToPivotTable(
                                originalSortItems,
                                measures,
                                rowAttributes,
                                columnAttributes,
                            ),
                            filters,
                            rowAttributes,
                            previousRowAttributes,
                        ),
                        ...controlsObj,
                    };

                    setPivotTableUiConfig(referencePointDraft, this.intl, VisualizationTypes.TABLE);
                    configurePercent(referencePointDraft, false);
                    configureOverTimeComparison(referencePointDraft, !!this.featureFlags.enableWeekFilters);
                    Object.assign(
                        referencePointDraft,
                        getReferencePointWithSupportedProperties(
                            referencePointDraft,
                            this.supportedPropertiesList,
                        ),
                    );
                    referencePointDraft.filters = sanitizeFilters(referencePointDraft).filters;
                },
            ),
        );
    }

    public getExtendedPivotTableProps(
        pivotTableProps: IPivotTableProps,
        config: IPivotTableConfig,
    ): IPivotTableProps {
        return {
            ...pivotTableProps,
            config,
        };
    }

    protected renderVisualization(
        options: IVisProps,
        visualizationProperties: IVisualizationPropertiesWrapper,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        const { dataSource } = options;

        if (dataSource) {
            const { resultSpec, locale, custom, dimensions, config } = options;
            const { height } = dimensions;
            const { drillableItems } = custom;
            const { afterRender, onError, onLoadingChanged, onDrill, onFiredDrillEvent } = this.callbacks;

            const resultSpecWithDimensions: AFM.IResultSpec = {
                ...resultSpec,
                dimensions: this.getDimensions(mdObject),
            };

            const sorts: AFM.SortItem[] = get(visualizationProperties, "sortItems", []) as AFM.SortItem[];

            const resultSpecWithSorts = resultSpecWithDimensions.sorts
                ? resultSpecWithDimensions
                : {
                      ...resultSpecWithDimensions,
                      sorts,
                  };

            const columnWidths: ColumnWidthItem[] = getColumnWidthsFromProperties(visualizationProperties);

            const rowsBucket = mdObject.buckets.find(
                bucket => bucket.localIdentifier === BucketNames.ATTRIBUTE,
            );
            const totals: VisualizationObject.IVisualizationTotal[] = (rowsBucket && rowsBucket.totals) || [];

            const updatedConfig = getTableConfigFromFeatureFlags(
                this.enrichConfigWithMenu(config),
                this.featureFlags,
                this.environment === DASHBOARDS_ENVIRONMENT,
                columnWidths,
            );
            const pivotTableProps = {
                projectId: this.projectId,
                drillableItems,
                onDrill,
                onFiredDrillEvent,
                totals,
                config: updatedConfig,
                height,
                locale,
                dataSource,
                resultSpec: resultSpecWithSorts,
                afterRender,
                onLoadingChanged,
                pushData: this.handlePushData,
                onError,
                onExportReady: this.onExportReady,
                LoadingComponent: null as any,
                ErrorComponent: null as any,
                intl: this.intl,
            };
            const pivotTablePropsFromFeatureFlags = {
                ...pivotTableProps,
                ...this.getPivotTablePropsFromFeatureFlags(),
            };

            if (this.environment === DASHBOARDS_ENVIRONMENT) {
                if (isNil(height)) {
                    render(
                        <ReactMeasure client={true}>
                            {({ measureRef, contentRect }: any) => {
                                const clientHeight = contentRect.client.height;
                                const usedHeight = Math.floor(clientHeight || 0);
                                const pivotWrapperStyle: React.CSSProperties = {
                                    height: "100%",
                                    textAlign: "left",
                                };
                                const extendedPivotTableProps = this.getExtendedPivotTableProps(
                                    pivotTablePropsFromFeatureFlags,
                                    {
                                        ...updatedConfig,
                                        maxHeight: clientHeight,
                                    },
                                );

                                return (
                                    <div
                                        ref={measureRef}
                                        style={pivotWrapperStyle}
                                        className="gd-table-dashboard-wrapper"
                                    >
                                        {this.createTable({ ...extendedPivotTableProps, height: usedHeight })}
                                    </div>
                                );
                            }}
                        </ReactMeasure>,
                        document.querySelector(this.element),
                    );

                    return;
                }
                render(
                    <ReactMeasure client={true}>
                        {({ measureRef, contentRect }: any) => {
                            const extendedPivotTableProps = this.getExtendedPivotTableProps(
                                pivotTablePropsFromFeatureFlags,
                                {
                                    ...updatedConfig,
                                    maxHeight: contentRect.client.height,
                                },
                            );

                            return (
                                <div
                                    ref={measureRef}
                                    style={{ height: 328, textAlign: "left" }}
                                    className="gd-table-dashboard-wrapper"
                                >
                                    {this.createTable(extendedPivotTableProps)}
                                </div>
                            );
                        }}
                    </ReactMeasure>,
                    document.querySelector(this.element),
                );
            } else {
                render(
                    this.createTable(pivotTablePropsFromFeatureFlags),
                    document.querySelector(this.element),
                );
            }
        }
    }

    protected createTable(props: IPivotTableProps) {
        return <PivotTable {...props} />;
    }

    protected onExportReady(exportResult: VisEvents.IExportFunction) {
        const { onExportReady } = this.callbacks;
        if (onExportReady) {
            onExportReady(exportResult);
        }
    }

    protected renderConfigurationPanel(mdObject: VisualizationObject.IVisualizationObjectContent) {
        if (document.querySelector(this.configPanelElement)) {
            const properties: IVisualizationProperties = get(this.visualizationProperties, "properties", {});
            // we need to handle cases when attribute previously bearing the default sort is no longer available
            const sanitizedProperties = properties.sortItems
                ? {
                      ...properties,
                      sortItems: adaptMdObjectSortItemsToPivotTable(properties.sortItems, mdObject.buckets),
                  }
                : properties;

            render(
                <UnsupportedConfigurationPanel
                    locale={this.locale}
                    pushData={this.callbacks.pushData}
                    properties={sanitizedProperties}
                />,
                document.querySelector(this.configPanelElement),
            );
        }
    }

    protected getDimensions(mdObject: VisualizationObject.IVisualizationObjectContent): AFM.IDimension[] {
        return generateDimensions(mdObject, VisualizationTypes.TABLE);
    }

    private adaptPropertiesToMdObject(
        visualizationProperties: IVisualizationPropertiesWrapper,
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        // This is sanitization of properties from KD vs current mdObject from AD
        const columnWidths = getColumnWidthsFromProperties(visualizationProperties);
        if (columnWidths) {
            this.sanitizeColumnWidths(columnWidths, mdObject);
        }
    }

    private sanitizeColumnWidths(
        columnWidths: ColumnWidthItem[],
        mdObject: VisualizationObject.IVisualizationObjectContent,
    ) {
        const adaptedColumnWidths = adaptMdObjectWidthItemsToPivotTable(columnWidths, mdObject.buckets);
        if (!isEqual(columnWidths, adaptedColumnWidths)) {
            this.visualizationProperties.properties.controls.columnWidths = adaptedColumnWidths;
            const { pushData } = this.callbacks;
            pushData({
                properties: {
                    controls: {
                        columnWidths: adaptedColumnWidths,
                    },
                },
            });
        }
    }

    private enrichConfigWithMenu(config: IPivotTableConfig): IPivotTableConfig {
        if (this.environment === DASHBOARDS_ENVIRONMENT) {
            // Menu aggregations turned off in KD
            return config;
        }

        const menu: IMenu = {
            aggregations: true,
            aggregationsSubMenu: true,
        };
        return merge({ menu }, config);
    }

    private onColumnResized(columnWidths: ColumnWidthItem[]) {
        const { pushData } = this.callbacks;

        pushData({
            properties: {
                controls: {
                    columnWidths,
                },
            },
        });
    }

    private handlePushData(data: any) {
        const {
            callbacks: { pushData },
            visualizationProperties,
            references,
        } = this;
        const properties = visualizationProperties ? visualizationProperties.properties : null;
        if (data && data.properties && data.properties.sortItems) {
            pushData({
                properties: {
                    sortItems: data.properties.sortItems,
                },
            });
        } else if (data && data.result && properties && references) {
            // pushData from VisualizationLoadingHOC
            pushData({
                ...data,
                references,
                properties,
            });
        } else {
            pushData(data);
        }
    }

    private getPivotTablePropsFromFeatureFlags() {
        if (this.featureFlags.enableTableColumnsManualResizing) {
            return {
                onColumnResized: this.onColumnResized,
            };
        }

        return {};
    }
}
