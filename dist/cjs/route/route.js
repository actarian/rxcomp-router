"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
var tslib_1 = require("tslib");
var route_activators_1 = require("./route-activators");
var route_segment_1 = require("./route-segment");
var Route = /** @class */ (function () {
    function Route(options) {
        var e_1, _a;
        var _this = this;
        this.pathMatch = 'prefix';
        this.relative = true;
        this.canDeactivate = [];
        this.canLoad = [];
        this.canActivate = [];
        this.canActivateChild = [];
        if (options) {
            Object.assign(this, options);
            this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(function (x) { return route_activators_1.mapCanDeactivate$_(x); }) : [];
            this.canLoad = options.canLoad ? options.canLoad.map(function (x) { return route_activators_1.mapCanLoad$_(x); }) : [];
            this.canActivate = options.canActivate ? options.canActivate.map(function (x) { return route_activators_1.mapCanActivate$_(x); }) : [];
            this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(function (x) { return route_activators_1.mapCanActivateChild$_(x); }) : [];
        }
        if (this.children) {
            this.children = this.children.map(function (iRoute) {
                var route = new Route(iRoute);
                route.parent = _this;
                return route;
            });
        }
        var segments = [];
        if (this.path === '**') {
            segments.push(new route_segment_1.RouteSegment(this.path));
            this.matcher = new RegExp('^.*$');
        }
        else {
            var matchers = ["^(../|./|//|/)?"];
            var regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
            var matches = this.path.matchAll(regExp);
            try {
                for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                    var match = matches_1_1.value;
                    var g1 = match[1];
                    var g2 = match[2];
                    var g3 = match[3];
                    if (g1) {
                        this.relative = !(g1 === '//' || g1 === '/');
                    }
                    else if (g2) {
                        matchers.push(g2);
                        segments.push(new route_segment_1.RouteSegment(g2));
                    }
                    else if (g3) {
                        matchers.push('(\/[^\/]+)');
                        var param = {};
                        param[g3] = null;
                        segments.push(new route_segment_1.RouteSegment('', param));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.pathMatch === 'full') {
                matchers.push('$');
            }
            var regexp = matchers.join('');
            this.matcher = new RegExp(regexp);
        }
        this.segments = segments;
    }
    return Route;
}());
exports.Route = Route;
