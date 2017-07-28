import { DataSource } from '../DataSource';
import { dataSourcesMatch } from '../utils';

describe('dataSource utils', () => {
    describe('dataSourcesMatch', () => {
        const noop = () => Promise.resolve({});
        const firstFingerprint = 'first';
        const secondFingerprint = 'second';

        it('dataSources should match if they have identical fingerprint', () => {
            const first = new DataSource(noop, firstFingerprint);
            const second = new DataSource(noop, firstFingerprint);

            expect(dataSourcesMatch(first, second)).toBe(true);
        });

        it('dataSources should not match if their fingerprints differ', () => {
            const first = new DataSource(noop, firstFingerprint);
            const second = new DataSource(noop, secondFingerprint);

            expect(dataSourcesMatch(first, second)).toBe(false);
        });

        it('dataSources should not match if one of them is missing', () => {
            const first = new DataSource(noop, firstFingerprint);

            expect(dataSourcesMatch(first, null)).toBe(false);
        });
    });
});
