import { SimpleMetadataSource } from '../SimpleMetadataSource';
import { charts } from '../legacy/tests/fixtures/VisObj.fixtures';

describe('SimpleMetadataSource', () => {
    it('should return metadata object wrapped', (done) => {
        const visualizationObjectContent = charts.bar.simpleMeasure;
        const measuresMap = {};
        const source = new SimpleMetadataSource(visualizationObjectContent, measuresMap);
        source.getVisualizationMetadata().then((result) => {
            expect(result).toEqual({
                measuresMap,
                metadata: {
                    content: visualizationObjectContent,
                    meta: {}
                }
            });
            done();
        });
    });
});
