import { getProjectId } from '../../src/helpers/uri';

describe('getProjectId', () => {
    it('should extract project id from relative uri', () => {
        expect(getProjectId('/gdc/md/aadsf234234234324/obj/123')).toBe('aadsf234234234324');
    });

    it('should throw if project id is not found', () => {
        expect(() => getProjectId('/uri/without/projectid')).toThrow();
    });
});
