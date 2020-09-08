import { isObservable, Observable } from "rxjs";
export function asObservable(args, callback) {
    return Observable.create(function (observer) {
        let subscription;
        try {
            let result = callback(...args);
            if (isObservable(result)) {
                subscription = result.subscribe(result => {
                    observer.next(result);
                    observer.complete();
                });
            }
            else if (isPromise(result)) {
                result.then(result => {
                    observer.next(result);
                    observer.complete();
                });
            }
            else if (typeof result === 'function') {
                observer.next(result());
                observer.complete();
            }
            else {
                observer.next(result);
                observer.complete();
            }
        }
        catch (error) {
            observer.error(error);
        }
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    });
}
export function isPromise(object) {
    return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}
