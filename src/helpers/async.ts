// (C) 2007-2020 GoodData Corporation
import identity = require("lodash/identity");
import { Subject, Subscription } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

export { Subscription };

export type StreamSuccessHandler<T> = (result: T) => void;
export type StreamErrorHandler = (error: any) => void;

export interface ISubject<T> {
    next: (promise: T) => void;
    unsubscribe: () => void;
}

/**
 * Creates infinite stream
 * Usage:
 * const subject = createSubject(
 *      (result) => console.log('Success:', result),
 *      (error) => console.error('Error:', error)
 * );
 * subject.next(promise1);
 * subject.next(promise2);
 *
 * subject.unsubscribe();
 *
 * @param successHandler
 * @param errorHandler
 */
export function createSubject<T>(
    successHandler: StreamSuccessHandler<T>,
    errorHandler: StreamErrorHandler,
): ISubject<Promise<T>> {
    const subject = new Subject<Promise<T>>();
    const subscription = subject
        .pipe(
            // This ensures we get last added promise
            switchMap(identity),
            // Streams are closed on error by default so we need this workaround
            catchError((error, caught) => {
                errorHandler(error); // handle error
                return caught; // stream continue
            }),
        )
        .subscribe(successHandler);

    const wrapper: ISubject<Promise<T>> = {
        next: (promise: Promise<T>) => {
            subject.next(promise);
        },
        unsubscribe: () => {
            subscription.unsubscribe();
            subject.unsubscribe();
        },
    };
    return wrapper;
}
