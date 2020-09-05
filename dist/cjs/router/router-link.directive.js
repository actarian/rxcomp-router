"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var route_segment_1 = require("../route/route-segment");
var router_service_1 = tslib_1.__importDefault(require("./router.service"));
var RouterLinkDirective = /** @class */ (function (_super) {
    tslib_1.__extends(RouterLinkDirective, _super);
    function RouterLinkDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(RouterLinkDirective.prototype, "routerLink", {
        get: function () {
            return this.routerLink_;
        },
        set: function (routerLink) {
            this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
            this.segments = this.getSegments(this.routerLink_);
        },
        enumerable: false,
        configurable: true
    });
    RouterLinkDirective.prototype.getSegments = function (routerLink) {
        // console.log('RouterLinkDirective.getSegments', routerLink);
        var segments = [];
        routerLink.forEach(function (item) {
            var e_1, _a;
            if (typeof item === 'string') {
                var regExp = /([^:]+)|\:([^\/]+)/g;
                var matches = item.matchAll(regExp);
                var components = [];
                try {
                    for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                        var match = matches_1_1.value;
                        var g1 = match[1];
                        var g2 = match[2];
                        if (g1) {
                            components.push(g1);
                        }
                        else if (g2) {
                            var param = {};
                            param[g2] = null;
                            components.push(param);
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
            }
            else {
                segments.push(new route_segment_1.RouteSegment('', {}));
            }
        });
        return segments;
    };
    RouterLinkDirective.prototype.onInit = function () {
        var _this = this;
        var node = rxcomp_1.getContext(this).node;
        var event$ = rxjs_1.fromEvent(node, 'click').pipe(operators_1.shareReplay(1));
        event$.pipe(operators_1.takeUntil(this.unsubscribe$)).subscribe(function (event) {
            // console.log('RouterLinkDirective', event, this.routerLink);
            // !!! skipLocationChange
            var navigationExtras = {
                skipLocationChange: _this.skipLocationChange,
                replaceUrl: _this.replaceUrl,
                state: _this.state,
            };
            router_service_1.default.setRouterLink(_this.routerLink, navigationExtras);
            event.preventDefault();
            return false;
        });
    };
    RouterLinkDirective.prototype.onChanges = function () {
        var node = rxcomp_1.getContext(this).node;
        var routePath = router_service_1.default.getPath(this.routerLink_);
        // console.log('RouterLinkDirective.routePath', routePath);
        node.setAttribute('href', routePath.url);
    };
    RouterLinkDirective.meta = {
        selector: '[routerLink],[[routerLink]]',
        inputs: ['routerLink'],
    };
    return RouterLinkDirective;
}(rxcomp_1.Directive));
exports.default = RouterLinkDirective;
/*
get urlTree(): UrlTree {
    return RouterService.createUrlTree(this.routerLink, {
        relativeTo: this.route,
        queryParams: this.queryParams,
        fragment: this.fragment,
        preserveQueryParams: this.preserve,
        queryParamsHandling: this.queryParamsHandling,
        preserveFragment: this.preserveFragment,
    });
}
*/
