import { DataSource } from '../DataSource';
import { dataSourcesMatch } from '../utils';

describe('dataSource utils', () => {
    describe('dataSourcesMatch', () => {
        const noop = () => Promise.resolve({});
        const firstAfm = {
            measures: [{
                id: 'm0',
                definition: {
                    baseObject: {
                        id: 'metric000'
                    }
                }
            }]
        };
        const secondAfm = {
            measures: [{
                id: 'm1',
                definition: {
                    baseObject: {
                        id: 'metric001'
                    }
                }
            }]
        };

        it('dataSources should match if they have identical fingerprint', () => {
            const first = new DataSource(noop, firstAfm);
            const second = new DataSource(noop, firstAfm);

            expect(dataSourcesMatch(first, second)).toBe(true);
        });

        it('dataSources should not match if their fingerprints differ', () => {
            const first = new DataSource(noop, firstAfm);
            const second = new DataSource(noop, secondAfm);

            expect(dataSourcesMatch(first, second)).toBe(false);
        });

        it('dataSources should not match if one of them is missing', () => {
            const first = new DataSource(noop, firstAfm);

            expect(dataSourcesMatch(first, null)).toBe(false);
        });
    });
});
