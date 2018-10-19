// (C) 2007-2018 GoodData Corporation
import { VisualizationObject } from '@gooddata/typings';
import { MEASURES, SECONDARY_MEASURES } from '../constants/bucketNames';
import { IColumnChartProps } from '../components/ColumnChart';
import { convertBucketsToMdObject } from './conversion';

export function getDualAxesBuckets(props: IColumnChartProps): VisualizationObject.IBucket[] {
    return [
        {
            localIdentifier: MEASURES,
            items: props.measures || []
        },
        {
            localIdentifier: SECONDARY_MEASURES,
            items: props.secondaryMeasures || []
        }
    ];
}

export function getDualAxesConfigProps(dualAxesBuckets: VisualizationObject.IBucket[]) {
    return  {
        mdObject: convertBucketsToMdObject(dualAxesBuckets)
    };
}
