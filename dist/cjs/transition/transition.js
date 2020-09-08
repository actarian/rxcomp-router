"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionOnced = exports.transitionOnce = exports.transition$ = void 0;
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
// !!! change boolean to void
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
// !!! should make transition specific?
function transitionOnce() {
    sessionStorageSet_('rxcomp_transition_once_', true);
}
exports.transitionOnce = transitionOnce;
function transitionOnced() {
    return sessionStorageGet_('rxcomp_transition_once_');
}
exports.transitionOnced = transitionOnced;
var MEMORY = {};
function sessionStorageGet_(key) {
    var value;
    try {
        var storage = rxcomp_1.WINDOW.sessionStorage;
        value = storage.getItem(key) || null;
    }
    catch (error) {
        value = MEMORY[key];
    }
    return value;
}
function sessionStorageSet_(key, value) {
    try {
        var storage = rxcomp_1.WINDOW.sessionStorage;
        storage.setItem(key, value);
    }
    catch (error) {
        MEMORY[key] = value;
    }
}
