import { isObservable, Observable } from 'rxjs';
export function mapCanDeactivate$_(activator) {
    return function canDeactivate$(component, currentRoute) {
        return makeObserver$_(() => activator.canDeactivate(component, currentRoute));
    };
}
export function mapCanLoad$_(activator) {
    return function canLoad$$(route, segments) {
        return makeObserver$_(() => activator.canLoad(route, segments));
    };
}
export function mapCanActivate$_(activator) {
    return function canActivate$(route) {
        return makeObserver$_(() => activator.canActivate(route));
    };
}
export function mapCanActivateChild$_(activator) {
    return function canActivateChild$(childRoute) {
        return makeObserver$_(() => activator.canActivateChild(childRoute));
    };
}
export function isPromise(object) {
    return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}
function makeObserver$_(callback) {
    return Observable.create(function (observer) {
        let subscription;
        try {
            let result = callback();
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
            else if (typeof result === 'boolean' || Array.isArray(result)) {
                observer.next(result);
                observer.complete();
            }
            else {
                observer.error(new Error('invalid value'));
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
