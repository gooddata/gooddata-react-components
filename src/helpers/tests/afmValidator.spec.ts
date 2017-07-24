import { Afm } from '@gooddata/data-layer';
import validator from '../afmValidator';

describe.only('afmValidator', () => {
    it('should throw error on wrong afm input', () => {
        const afm = {
            measures: [
                {
                    id: '1',
                    deinition: {
                        baseObject: {
                            id: '/gd/md/m1'
                        }
                    }
                },
                {
                    id: 23,
                    definition: {
                        baseObject: {
                            lookupId: 12
                        }
                    }
                },
                {
                    id: 23,
                    definition: {
                        baseObject: {
                            lokupid: 123
                        }
                    }
                }
            ],
            attributes: [
                {
                    id: '123',
                    type: 'date'
                }
            ]
        };

        const measura = {
            idcko: '1',
            definition: {
                baseObject: {
                    id: []
                }
            }
        };

        console.log(validator(afm));


    });
});