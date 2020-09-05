"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transition$ = void 0;
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
function transition$(callback) {
    return rxjs_1.Observable.create(function (observer) {
        // let subscription: Subscription;
        try {
            if (rxcomp_1.isPlatformBrowser) {
                callback(function (result) {
                    observer.next(result);
                    observer.complete();
                });
            }
            else {
                observer.next(true);
                observer.complete();
            }
        }
        catch (error) {
            observer.error(error);
        }
        /*
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        }
        */
    });
}
exports.transition$ = transition$;
