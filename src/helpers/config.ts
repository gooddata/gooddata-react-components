import { ITransformation } from '../interfaces/Transformation';
import { IAfm } from '../interfaces/Afm';
import { toVisObj } from '../legacy/converters';
import * as VisObj from '../legacy/model/VisualizationObject';

export function generateConfig(type, afm: IAfm, transformation: ITransformation, config = {}) {
    const buckets: VisObj.IVisualizationObject = toVisObj(type, afm, transformation);

    return {
        ...buckets,
        ...config
    };
}
