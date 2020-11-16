"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var view_1 = tslib_1.__importStar(require("../core/view"));
var observable_1 = require("../observable/observable");
var transition_1 = require("../transition/transition");
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
            return this.onLeave$_(snapshot, this.element, this.instance).pipe(operators_1.tap(function () {
                if (_this.element) {
                    _this.element.parentNode.removeChild(_this.element);
                    module.remove(_this.element, _this);
                    _this.element = undefined;
                    _this.instance = undefined;
                }
            }), operators_1.switchMap(function () {
                if (snapshot && factory && factory.meta.template) {
                    var element_1 = document.createElement('div');
                    element_1.innerHTML = factory.meta.template;
                    if (element_1.children.length === 1) {
                        element_1 = element_1.firstElementChild;
                    }
                    node.appendChild(element_1);
                    var instance_1 = module.makeInstance(element_1, factory, factory.meta.selector, _this, undefined, { route: snapshot });
                    module.compile(element_1, instance_1);
                    _this.instance = instance_1;
                    _this.element = element_1;
                    snapshot.element = element_1;
                    return _this.onOnce$_(snapshot, element_1, instance_1).pipe(operators_1.switchMap(function () {
                        return _this.onEnter$_(snapshot, element_1, instance_1);
                    }));
                }
                else {
                    return rxjs_1.of(void 0);
                }
            }));
        }
        else {
            return rxjs_1.of(void 0);
        }
    };
    /*
    private onEnter$__(element?: IElement, instance?: Component): Observable<boolean> {
        if (instance instanceof View && element) {
            return asObservable([element], instance.onEnter);
        } else {
            return of(true);
        }
    }
    private onLeave$__(element?: IElement, instance?: Component): Observable<boolean> {
        if (instance instanceof View && element) {
            return asObservable([element], instance.onLeave);
        } else {
            return of(true);
        }
    }
    */
    RouterOutletStructure.prototype.onOnce$_ = function (snapshot, element, instance) {
        if (!transition_1.transitionOnced() && instance instanceof view_1.default && element) {
            transition_1.transitionOnce();
            var factory = instance.constructor;
            var transition = factory.transitions.find(function (x) { var _a; return x instanceof view_1.OnceTransition && x.matcher((_a = snapshot.previousRoute) === null || _a === void 0 ? void 0 : _a.path); });
            return transition ? observable_1.asObservable([element, snapshot.previousRoute], transition.callback.bind(instance)) : rxjs_1.of(void 0);
        }
        else {
            return rxjs_1.of(void 0);
        }
    };
    RouterOutletStructure.prototype.onEnter$_ = function (snapshot, element, instance) {
        if (instance instanceof view_1.default && element) {
            var factory = instance.constructor;
            var transition = factory.transitions.find(function (x) { var _a; return x instanceof view_1.EnterTransition && x.matcher((_a = snapshot.previousRoute) === null || _a === void 0 ? void 0 : _a.path); });
            return transition ? observable_1.asObservable([element, snapshot.previousRoute], transition.callback.bind(instance)) : rxjs_1.of(void 0);
        }
        else {
            return rxjs_1.of(void 0);
        }
    };
    RouterOutletStructure.prototype.onLeave$_ = function (snapshot, element, instance) {
        if (instance instanceof view_1.default && element) {
            var factory = instance.constructor;
            var transition = factory.transitions.find(function (x) { return x instanceof view_1.LeaveTransition && x.matcher(snapshot === null || snapshot === void 0 ? void 0 : snapshot.path); });
            return transition ? observable_1.asObservable([element, snapshot], transition.callback.bind(instance)) : rxjs_1.of(void 0);
        }
        else {
            return rxjs_1.of(void 0);
        }
    };
    RouterOutletStructure.meta = {
        selector: 'router-outlet,[router-outlet]',
        hosts: { host: RouterOutletStructure },
    };
    return RouterOutletStructure;
}(rxcomp_1.Structure));
exports.default = RouterOutletStructure;
