import { getProjectId, isUri } from '../../src/helpers/uri';

describe('getProjectId', () => {
    it('should extract project id from relative uri', () => {
        expect(getProjectId('/gdc/md/aadsf234234234324/obj/123')).toBe('aadsf234234234324');
    });

    it('should throw if project id is not found', () => {
        expect(() => getProjectId('/uri/without/projectid')).toThrow();
    });
});

describe('isUri', () => {
    it('should return true', () => {
        expect(isUri('/gdc/md/a/obj/1')).toEqual(true);
    });

    it('should return false', () => {
        expect(isUri('a')).toEqual(false);
        expect(isUri('/gdc')).toEqual(false);
        expect(isUri('/gdc/md')).toEqual(false);
        expect(isUri('/gdc/md/a')).toEqual(false);
        expect(isUri('/gdc/md/a/obj')).toEqual(false);
        expect(isUri('/gdc/md/a/obj/a')).toEqual(false);
    });
});
