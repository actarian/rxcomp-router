"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asObservable = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var view_1 = tslib_1.__importDefault(require("../core/view"));
var route_activators_1 = require("../route/route-activators");
var router_service_1 = tslib_1.__importDefault(require("./router.service"));
var RouterOutletStructure = /** @class */ (function (_super) {
    tslib_1.__extends(RouterOutletStructure, _super);
    function RouterOutletStructure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.route$_ = new rxjs_1.ReplaySubject(1);
        return _this;
    }
    Object.defineProperty(RouterOutletStructure.prototype, "route", {
        get: function () {
            return this.route_;
        },
        enumerable: false,
        configurable: true
    });
    RouterOutletStructure.prototype.onInit = function () {
        var _this = this;
        var _a;
        this.route$().pipe(operators_1.switchMap(function (snapshot) { return _this.factory$(snapshot); }), operators_1.takeUntil(this.unsubscribe$)).subscribe(function () {
            // console.log(`RouterOutletStructure ActivatedRoutes: ["${RouterService.flatRoutes.filter(x => x.snapshot).map(x => x.snapshot?.extractedUrl).join('", "')}"]`);
        });
        if (this.host) {
            this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
    };
    RouterOutletStructure.prototype.onChanges = function () {
        var _a;
        if (this.host) {
            this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
    };
    RouterOutletStructure.prototype.route$ = function () {
        var _this = this;
        var source = this.host ? this.route$_ : router_service_1.default.route$;
        return source.pipe(operators_1.filter(function (snapshot) {
            _this.route_ = snapshot; // !!!
            if (_this.snapshot_ && snapshot && _this.snapshot_.component === snapshot.component) {
                _this.snapshot_.next(snapshot);
                return false;
            }
            else {
                _this.snapshot_ = snapshot;
                return true;
            }
        }));
    };
    RouterOutletStructure.prototype.factory$ = function (snapshot) {
        var _this = this;
        var _a = rxcomp_1.getContext(this), module = _a.module, node = _a.node;
        var factory = snapshot === null || snapshot === void 0 ? void 0 : snapshot.component;
        if (this.factory_ !== factory) {
            this.factory_ = factory;
            return this.onExit$_(this.element, this.instance).pipe(operators_1.tap(function () {
                if (_this.element) {
                    _this.element.parentNode.removeChild(_this.element);
                    module.remove(_this.element, _this);
                    _this.element = undefined;
                    _this.instance = undefined;
                }
            }), operators_1.switchMap(function () {
                if (snapshot && factory && factory.meta.template) {
                    var element = document.createElement('div');
                    element.innerHTML = factory.meta.template;
                    if (element.children.length === 1) {
                        element = element.firstElementChild;
                    }
                    node.appendChild(element);
                    var instance = module.makeInstance(element, factory, factory.meta.selector, _this, undefined, { route: snapshot });
                    module.compile(element, instance);
                    _this.instance = instance;
                    _this.element = element;
                    snapshot.element = element;
                    return _this.onEnter$_(element, instance);
                }
                else {
                    return rxjs_1.of(false);
                }
            }));
        }
        else {
            return rxjs_1.of(false);
        }
    };
    RouterOutletStructure.prototype.onEnter$_ = function (element, instance) {
        if (element && instance && instance instanceof view_1.default) {
            return asObservable([element], instance.onEnter);
        }
        else {
            return rxjs_1.of(true);
        }
    };
    RouterOutletStructure.prototype.onExit$_ = function (element, instance) {
        if (element && instance && instance instanceof view_1.default) {
            return asObservable([element], instance.onExit);
        }
        else {
            return rxjs_1.of(true);
        }
    };
    RouterOutletStructure.meta = {
        selector: 'router-outlet,[router-outlet]',
        hosts: { host: RouterOutletStructure },
    };
    return RouterOutletStructure;
}(rxcomp_1.Structure));
exports.default = RouterOutletStructure;
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
            else if (route_activators_1.isPromise(result)) {
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
