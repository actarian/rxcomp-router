"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = exports.asObservable = void 0;
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
function asObservable(args, callback) {
    return rxjs_1.Observable.create(function (observer) {
        var subscription;
        try {
            var result = callback.apply(void 0, tslib_1.__spread(args));
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
        return function () {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    });
}
exports.asObservable = asObservable;
function isPromise(object) {
    return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}
exports.isPromise = isPromise;
