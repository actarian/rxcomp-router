"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationError = exports.NavigationCancel = exports.NavigationEnd = exports.RouteConfigLoadEnd = exports.RouteConfigLoadStart = exports.ChildActivationEnd = exports.ActivationEnd = exports.ResolveEnd = exports.ResolveStart = exports.GuardsCheckEnd = exports.ActivationStart = exports.ChildActivationStart = exports.GuardsCheckStart = exports.RoutesRecognized = exports.NavigationStart = exports.RouterEvent = void 0;
var tslib_1 = require("tslib");
var RouterEvent = /** @class */ (function () {
    function RouterEvent(options) {
        if (options) {
            Object.assign(this, options);
        }
        if (this.routerLink) {
            this.url = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;
        }
    }
    return RouterEvent;
}());
exports.RouterEvent = RouterEvent;
// An event triggered when navigation starts.
var NavigationStart = /** @class */ (function (_super) {
    tslib_1.__extends(NavigationStart, _super);
    function NavigationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationStart;
}(RouterEvent));
exports.NavigationStart = NavigationStart;
// An event triggered when the Router parses the URL and the routes are recognized.
var RoutesRecognized = /** @class */ (function (_super) {
    tslib_1.__extends(RoutesRecognized, _super);
    function RoutesRecognized() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RoutesRecognized;
}(RouterEvent));
exports.RoutesRecognized = RoutesRecognized;
// An event triggered at the start of the Guard phase of routing.
var GuardsCheckStart = /** @class */ (function (_super) {
    tslib_1.__extends(GuardsCheckStart, _super);
    function GuardsCheckStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GuardsCheckStart;
}(RouterEvent));
exports.GuardsCheckStart = GuardsCheckStart;
// An event triggered at the start of the child-activation part of the Resolve phase of routing.
var ChildActivationStart = /** @class */ (function (_super) {
    tslib_1.__extends(ChildActivationStart, _super);
    function ChildActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChildActivationStart;
}(RouterEvent));
exports.ChildActivationStart = ChildActivationStart;
// An event triggered at the start of the activation part of the Resolve phase of routing.
var ActivationStart = /** @class */ (function (_super) {
    tslib_1.__extends(ActivationStart, _super);
    function ActivationStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActivationStart;
}(RouterEvent));
exports.ActivationStart = ActivationStart;
// An event triggered at the end of the Guard phase of routing.
var GuardsCheckEnd = /** @class */ (function (_super) {
    tslib_1.__extends(GuardsCheckEnd, _super);
    function GuardsCheckEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GuardsCheckEnd;
}(RouterEvent));
exports.GuardsCheckEnd = GuardsCheckEnd;
// An event triggered at the the start of the Resolve phase of routing.
var ResolveStart = /** @class */ (function (_super) {
    tslib_1.__extends(ResolveStart, _super);
    function ResolveStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResolveStart;
}(RouterEvent));
exports.ResolveStart = ResolveStart;
// An event triggered at the end of the Resolve phase of routing.
var ResolveEnd = /** @class */ (function (_super) {
    tslib_1.__extends(ResolveEnd, _super);
    function ResolveEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResolveEnd;
}(RouterEvent));
exports.ResolveEnd = ResolveEnd;
// An event triggered at the end of the activation part of the Resolve phase of routing.
var ActivationEnd = /** @class */ (function (_super) {
    tslib_1.__extends(ActivationEnd, _super);
    function ActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActivationEnd;
}(RouterEvent));
exports.ActivationEnd = ActivationEnd;
// An event triggered at the end of the child-activation part of the Resolve phase of routing.
var ChildActivationEnd = /** @class */ (function (_super) {
    tslib_1.__extends(ChildActivationEnd, _super);
    function ChildActivationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ChildActivationEnd;
}(RouterEvent));
exports.ChildActivationEnd = ChildActivationEnd;
// An event triggered before the Router lazy loads a route configuration.
var RouteConfigLoadStart = /** @class */ (function (_super) {
    tslib_1.__extends(RouteConfigLoadStart, _super);
    function RouteConfigLoadStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RouteConfigLoadStart;
}(RouterEvent));
exports.RouteConfigLoadStart = RouteConfigLoadStart;
// An event triggered after a route has been lazy loaded.
var RouteConfigLoadEnd = /** @class */ (function (_super) {
    tslib_1.__extends(RouteConfigLoadEnd, _super);
    function RouteConfigLoadEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RouteConfigLoadEnd;
}(RouterEvent));
exports.RouteConfigLoadEnd = RouteConfigLoadEnd;
// An event triggered when navigation ends successfully.
var NavigationEnd = /** @class */ (function (_super) {
    tslib_1.__extends(NavigationEnd, _super);
    function NavigationEnd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationEnd;
}(RouterEvent));
exports.NavigationEnd = NavigationEnd;
// An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.
var NavigationCancel = /** @class */ (function (_super) {
    tslib_1.__extends(NavigationCancel, _super);
    function NavigationCancel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationCancel;
}(RouterEvent));
exports.NavigationCancel = NavigationCancel;
// An event triggered when navigation fails due to an unexpected error.
var NavigationError = /** @class */ (function (_super) {
    tslib_1.__extends(NavigationError, _super);
    function NavigationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationError;
}(RouterEvent));
exports.NavigationError = NavigationError;
/*
NavigationStart {id: 1, url: '/test-a', navigationTrigger: 'imperative', restoredState: null, constructor: Object}
RoutesRecognized {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
GuardsCheckStart {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ChildActivationStart {snapshot: ActivatedRouteSnapshot, constructor: Object}
ActivationStart {snapshot: ActivatedRouteSnapshot, constructor: Object}
GuardsCheckEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, shouldActivate: true…}
ResolveStart {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ResolveEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', state: RouterStateSnapshot, constructor: Object}
ActivationEnd {snapshot: ActivatedRouteSnapshot, constructor: Object}
ChildActivationEnd {snapshot: ActivatedRouteSnapshot, constructor: Object}
NavigationEnd {id: 1, url: '/test-a', urlAfterRedirects: '/test-a', constructor: Object}
Scroll {routerEvent: NavigationEnd, position: null, anchor: null, constructor: Object}
*/
