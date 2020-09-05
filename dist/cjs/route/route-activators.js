"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = exports.mapCanActivateChild$_ = exports.mapCanActivate$_ = exports.mapCanLoad$_ = exports.mapCanDeactivate$_ = void 0;
var rxjs_1 = require("rxjs");
function mapCanDeactivate$_(activator) {
    return function canDeactivate$(component, currentRoute) {
        return makeObserver$_(function () { return activator.canDeactivate(component, currentRoute); });
    };
}
exports.mapCanDeactivate$_ = mapCanDeactivate$_;
function mapCanLoad$_(activator) {
    return function canLoad$$(route, segments) {
        return makeObserver$_(function () { return activator.canLoad(route, segments); });
    };
}
exports.mapCanLoad$_ = mapCanLoad$_;
function mapCanActivate$_(activator) {
    return function canActivate$(route) {
        return makeObserver$_(function () { return activator.canActivate(route); });
    };
}
exports.mapCanActivate$_ = mapCanActivate$_;
function mapCanActivateChild$_(activator) {
    return function canActivateChild$(childRoute) {
        return makeObserver$_(function () { return activator.canActivateChild(childRoute); });
    };
}
exports.mapCanActivateChild$_ = mapCanActivateChild$_;
function isPromise(object) {
    return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}
exports.isPromise = isPromise;
function makeObserver$_(callback) {
    return rxjs_1.Observable.create(function (observer) {
        var subscription;
        try {
            var result = callback();
            if (rxjs_1.isObservable(result)) {
                subscription = result.subscribe(function (result) {
                    observer.next(result);
                    observer.complete();
                });
            }
            else if (isPromise(result)) {
                result.then(function (result) {
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
        return function () {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    });
}
