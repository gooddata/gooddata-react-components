import * as VisObj from './legacy/model/VisualizationObject';
import { IMetadataSource } from './interfaces/MetadataSource';

export class SimpleMetadataSource implements IMetadataSource {
    constructor(
        private visualizationObjectContent: VisObj.IVisualizationObject,
        private measuresMap: VisObj.IMeasuresMap
    ) {}

    public getVisualizationMetadata(): Promise<VisObj.IVisualizationMetadataResult> {
        return Promise.resolve({
            metadata: {
                content: this.visualizationObjectContent,
                meta: {}
            },
            measuresMap: this.measuresMap
        });
    }
}
