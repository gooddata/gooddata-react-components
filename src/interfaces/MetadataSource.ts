import * as VisObj from '../legacy/model/VisualizationObject';

export interface IMetadataSource {
    getVisualizationMetadata(): Promise<VisObj.IVisualizationMetadataResult>;
}
