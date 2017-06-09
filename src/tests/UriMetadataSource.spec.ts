import { UriMetadataSource } from '../UriMetadataSource';

describe('UriMetadataSource', () => {
    const uri = '/gdc/md/FoodMartDemo/1';
    const visualization = { content: {} };
    const md = { visualization };

    let sdk;
    beforeEach(() => {
        sdk = {
            md: {
                getObjects: jest.fn().mockReturnValue(Promise.resolve([]))
            },
            xhr: {
                get: jest.fn().mockReturnValue(Promise.resolve(md))
            }
        };
    });

    it('should request metadataobject on getData if not cached', (done) => {
        const source = new UriMetadataSource(sdk, uri);
        source.getVisualizationMetadata().then((result) => {
            expect(result.metadata).toEqual(visualization);
            done();
        });
    });

    it('should take md object from cache if already fetched', (done) => {
        const source = new UriMetadataSource(sdk, uri);
        source.getVisualizationMetadata().then((first) => {
            source.getVisualizationMetadata().then((second) => {
                expect(first.metadata).toEqual(second.metadata);
                expect(sdk.xhr.get.mock.calls.length).toEqual(1);
                done();
            });
        });
    });
});
