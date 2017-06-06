import { IAfm } from './interfaces/Afm';
import { DataTable } from './DataTable';
import { DummyAdapter } from './utils/DummyAdapter';

describe('DataTable', () => {
    const dataResponse = { rawData: [1, 2, 3] };
    const afm: IAfm = {
        measures: [
            {
                id: 'a',
                definition: {
                    baseObject: {
                        id: 'b'
                    }
                }
            }
        ]
    };
    const nonExecutableAfm: IAfm = {};
    const transformation = {};

    describe('Events', () => {
        const setupDataTable = (success = true) => {
            const dt = new DataTable(new DummyAdapter(dataResponse, success));
            const dataCb = jest.fn();
            const errCb = jest.fn();

            dt.onData(dataCb);
            dt.onError(errCb);

            return {
                dt,
                dataCb,
                errCb
            };
        };

        it('should return data via onData callback', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.getData(afm, transformation);

            setTimeout(() => {
                expect(errCb).not.toBeCalled();
                expect(dataCb).toHaveBeenCalledWith(dataResponse);

                done();
            }, 0);
        });

        it('should dispatch onError callback when error occurs', (done) => {
            const { dt, errCb, dataCb } = setupDataTable(false);

            dt.getData(afm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).toHaveBeenCalled();

                done();
            }, 0);
        });

        it('should not get new data for invalid AFM', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.getData(nonExecutableAfm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).not.toBeCalled();

                done();
            }, 0);
        });

        it('should be able to reset subscribers', (done) => {
            const { dt, errCb, dataCb } = setupDataTable();

            dt.onData(dataCb);
            dt.onError(errCb);

            dt
                .resetDataSubscribers()
                .resetErrorSubscribers();

            dt.getData(nonExecutableAfm, transformation);

            setTimeout(() => {
                expect(dataCb).not.toBeCalled();
                expect(errCb).not.toBeCalled();

                done();
            }, 0);
        });
    });

    describe('Promise', () => {
        it('should return data', () => {
            const dt = new DataTable(new DummyAdapter(dataResponse));

            return dt.execute(afm, transformation).then((data) => {
                expect(data).toEqual(dataResponse);
            });
        });

        it('should return null for invalid AFM', () => {
            const dt = new DataTable(new DummyAdapter(dataResponse));

            return dt.execute(nonExecutableAfm, transformation).then((data) => {
                expect(data).toEqual(null);
            });
        });

        it('should reject promise for error', (done) => {
            const dt = new DataTable(new DummyAdapter(dataResponse, false));
            dt.execute(afm, transformation).catch(() => {
                expect(true).toEqual(true);
                done();
            });
        });

        it('should be canceled when repeating request', () => {
            const asyncDataSource = {
                getData() {
                    return new Promise((resolve) => {
                        setTimeout(resolve, 0, dataResponse);
                    });
                }
            };
            const dt = new DataTable(new DummyAdapter(dataResponse, true, asyncDataSource));

            const promiseToBeCancelled = dt.execute(afm, transformation);
            const promise = dt.execute(afm, transformation); // call next execution to cancel "promiseToBeCancelled"

            return promiseToBeCancelled.then(
                () => expect(true).toBeFalsy(), // fail
                (reason) => {
                    expect(reason).toEqual({
                        isCancelled: true
                    });

                    return promise.then(
                        (value) => expect(value).toEqual(dataResponse),
                        () => expect(true).toBeFalsy() // fail
                    );
                }
            );
        });
    });
});
