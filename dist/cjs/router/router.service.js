"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var location_strategy_1 = require("../location/location.strategy");
var route_1 = require("../route/route");
var route_path_1 = require("../route/route-path");
var route_snapshot_1 = require("../route/route-snapshot");
var router_events_1 = require("./router-events");
var RouterService = /** @class */ (function () {
    function RouterService() {
    }
    Object.defineProperty(RouterService, "flatRoutes", {
        get: function () {
            return getFlatRoutes_(this.routes);
        },
        enumerable: false,
        configurable: true
    });
    RouterService.setRoutes = function (routes) {
        this.routes = routes.map(function (x) { return new route_1.Route(x); });
        // this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
        this.observe$ = this.makeObserve$();
        return this;
    };
    RouterService.makeObserve$ = function () {
        var routes = this.routes;
        var route$ = this.route$;
        var events$ = this.events$;
        var locationStrategy = this.locationStrategy;
        var currentRoute;
        var currentEvent;
        // console.log('RouterService.WINDOW', WINDOW!!);
        var stateEvents$ = rxcomp_1.isPlatformServer ? rxjs_1.EMPTY : rxjs_1.fromEvent(rxcomp_1.WINDOW, 'popstate').pipe(operators_1.map(function (event) {
            currentEvent = event;
            var routerLink = "" + document.location.pathname + document.location.search + document.location.hash;
            /*
            // !!! state to snapshot
            const flatRoutes = getFlatRoutes_(routes);
            flatRoutes.forEach(r => r.snapshot = undefined);
            const snapshot: RouteSnapshot = locationStrategy.stateToSnapshot(flatRoutes, event.state) as RouteSnapshot;
            // console.log('LocationStrategy.stateToSnapshot snapshot', snapshot);
            // console.log('RouterService PopStateEvent', 'snapshot', snapshot, 'routes', flatRoutes.map(route => route.snapshot));
            return new NavigationEnd({ route: snapshot, routerLink, url: routerLink, trigger: 'popstate' });
            */
            return new router_events_1.NavigationStart({ routerLink: routerLink, trigger: 'popstate' });
        }), operators_1.shareReplay(1));
        return rxjs_1.merge(stateEvents$, events$).pipe(operators_1.switchMap(function (event) {
            currentEvent = event;
            if (event instanceof router_events_1.GuardsCheckStart) {
                return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(operators_1.switchMap(function (nextEvent) {
                    if (nextEvent instanceof router_events_1.NavigationCancel) {
                        return rxjs_1.of(nextEvent);
                    }
                    else {
                        return makeCanLoadResponse$_(events$, event).pipe(operators_1.switchMap(function (nextEvent) {
                            if (nextEvent instanceof router_events_1.NavigationCancel) {
                                return rxjs_1.of(nextEvent);
                            }
                            else {
                                return makeCanActivateChildResponse$_(events$, event);
                            }
                        }));
                    }
                }));
            }
            else if (event instanceof router_events_1.ChildActivationStart) {
                return makeCanActivateResponse$_(events$, event);
            }
            else {
                return rxjs_1.of(event);
            }
        }), operators_1.tap(function (event) {
            var _a, _b, _c;
            currentEvent = event;
            // console.log('RouterEvent', event);
            if (event instanceof router_events_1.NavigationStart) {
                // console.log('NavigationStart', event.routerLink);
                var routerLink = event.routerLink;
                // console.log('routerLink', routerLink);
                var snapshot = void 0;
                var initialUrl = void 0;
                var routePath = RouterService.getPath(routerLink);
                // console.log(routePath, routePath.url);
                initialUrl = routePath.url;
                // console.log('initialUrl', initialUrl);
                var isRelative = initialUrl.indexOf('/') !== 0;
                if (isRelative && currentRoute && ((_a = currentRoute.children) === null || _a === void 0 ? void 0 : _a.length)) {
                    snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl, currentRoute);
                    if (snapshot) {
                        currentRoute.childRoute = snapshot;
                        snapshot.parent = currentRoute;
                        snapshot = currentRoute;
                    }
                    // console.log('relative', currentRoute, snapshot, initialUrl);
                }
                else {
                    snapshot = resolveRoutes_(routes, routes, initialUrl, currentRoute);
                    // console.log('absolute');
                }
                if (snapshot) {
                    // console.log('RouterService.makeObserve$_', 'NavigationStart', snapshot);
                    currentRoute = snapshot;
                    events$.next(new router_events_1.RoutesRecognized(tslib_1.__assign(tslib_1.__assign({}, event), { route: snapshot })));
                }
                else {
                    events$.next(new router_events_1.NavigationError(tslib_1.__assign(tslib_1.__assign({}, event), { error: new Error('unknown route') })));
                }
            }
            else if (event instanceof router_events_1.RoutesRecognized) {
                // console.log('RoutesRecognized', event.route.component, event.route.initialUrl, event.route.extractedUrl, event.route.urlAfterRedirects);
                events$.next(new router_events_1.GuardsCheckStart(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.GuardsCheckStart) {
                // console.log('GuardsCheckStart', event);
                events$.next(new router_events_1.ChildActivationStart(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ChildActivationStart) {
                // console.log('ChildActivationStart', event);
                events$.next(new router_events_1.ActivationStart(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ActivationStart) {
                // console.log('ActivationStart', event);
                events$.next(new router_events_1.GuardsCheckEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.GuardsCheckEnd) {
                // console.log('GuardsCheckEnd', event);
                events$.next(new router_events_1.ResolveStart(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ResolveStart) {
                // console.log('ResolveStart', event);
                events$.next(new router_events_1.ResolveEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ResolveEnd) {
                // console.log('ResolveEnd', event);
                events$.next(new router_events_1.ActivationEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ActivationEnd) {
                // console.log('ActivationEnd', event);
                events$.next(new router_events_1.ChildActivationEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.ChildActivationEnd) {
                // console.log('ChildActivationEnd', event);
                events$.next(new router_events_1.RouteConfigLoadStart(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.RouteConfigLoadStart) {
                // console.log('RouteConfigLoadStart', event);
                events$.next(new router_events_1.RouteConfigLoadEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.RouteConfigLoadEnd) {
                // console.log('RouteConfigLoadEnd', event);
                events$.next(new router_events_1.NavigationEnd(tslib_1.__assign({}, event)));
            }
            else if (event instanceof router_events_1.NavigationEnd) {
                // console.log('NavigationEnd', event);
                var segments = [];
                var source = event.route;
                while (source != null) {
                    // console.log(source.params, source.data);
                    if ((_b = source.extractedUrl) === null || _b === void 0 ? void 0 : _b.length) {
                        segments.push(source.extractedUrl);
                    }
                    if (source.childRoute) {
                        source = source.childRoute;
                    }
                    else {
                        if ((_c = source.remainUrl) === null || _c === void 0 ? void 0 : _c.length) {
                            segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
                        }
                        source = undefined;
                    }
                }
                var extractedUrl = segments.join('/').replace(/\/\//g, '/');
                // console.log('NavigationEnd', event.route.extractedUrl, event.route);
                clearRoutes_(routes, event.route);
                locationStrategy.pushState(extractedUrl, event.route, event.trigger === 'popstate');
                // pushState_(locationStrategy, extractedUrl, undefined, event.trigger === 'popstate');
                route$.next(event.route);
            }
            else if (event instanceof router_events_1.NavigationCancel) {
                // console.log('NavigationCancel', event.reason, event.redirectTo);
                if (event.redirectTo) {
                    // const routePath: RoutePath = RouterService.getPath(event.redirectTo);
                    events$.next(new router_events_1.NavigationStart({ routerLink: event.redirectTo, trigger: 'imperative' }));
                }
            }
            else if (event instanceof router_events_1.NavigationError) {
                console.warn('RouterService NavigationError', event.error);
            }
        }), operators_1.catchError(function (error) { return rxjs_1.of(new router_events_1.NavigationError(tslib_1.__assign(tslib_1.__assign({}, (currentEvent || {})), { error: error }))); }), operators_1.shareReplay(1));
    };
    RouterService.setRouterLink = function (routerLink, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        // ['/hero', hero.id];
        // console.log('RouterService.setRouterLink', routerLink);
        this.events$.next(new router_events_1.NavigationStart({ routerLink: routerLink, trigger: 'imperative' }));
    };
    RouterService.navigate = function (routerLink, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        // navigate(['items'], { relativeTo: this.route });
        // navigate(['/heroes', { id: heroId }]);
        // console.log('RouterService.navigate', routerLink);
        this.events$.next(new router_events_1.NavigationStart({ routerLink: routerLink, trigger: 'imperative' }));
    };
    RouterService.findRoute = function (routerLink) {
        var initialUrl = this.locationStrategy.serializeLink(routerLink);
        return this.findRouteByUrl(initialUrl);
    };
    RouterService.findRouteByUrl = function (initialUrl) {
        var e_1, _a;
        var routes = getFlatRoutes_(this.routes);
        var resolvedRoute = null;
        var lastMatcbesLength = Number.NEGATIVE_INFINITY;
        try {
            for (var routes_1 = tslib_1.__values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
                var route = routes_1_1.value;
                var matches = initialUrl.match(route.matcher);
                if (matches && (!resolvedRoute || matches[0].length > lastMatcbesLength)) {
                    lastMatcbesLength = matches[0].length;
                    resolvedRoute = route;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return)) _a.call(routes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var urlAfterRedirects = initialUrl;
        if (resolvedRoute && resolvedRoute.redirectTo) {
            // const routePath: RoutePath = RouterService.getPath(resolvedRoute.redirectTo);
            // urlAfterRedirects = routePath.url;
            urlAfterRedirects = resolvedRoute.redirectTo;
            resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
        }
        // console.log('RouterService.findRouteByUrl', resolvedRoute);
        return resolvedRoute;
    };
    RouterService.getPath = function (routerLink) {
        var _this = this;
        if (routerLink === void 0) { routerLink = []; }
        var lastPath = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
            return typeof x === 'string' ? x : _this.locationStrategy.encodeParams(x);
        }).join('/');
        var segments = [];
        var routes = [];
        var route = this.findRouteByUrl(lastPath);
        if (route) {
            var r = route === null || route === void 0 ? void 0 : route.parent;
            while (r) {
                segments.unshift.apply(segments, r.segments);
                routes.unshift(r instanceof route_snapshot_1.RouteSnapshot ? r : r.snapshot || r);
                r = r.parent;
            }
            segments.push.apply(segments, (route === null || route === void 0 ? void 0 : route.segments) || []);
            routes.push({ path: lastPath });
        }
        var initialUrl = routes.map(function (r) { return r instanceof route_snapshot_1.RouteSnapshot ? r.extractedUrl : r.path; }).join('/');
        initialUrl = this.locationStrategy.getPath(initialUrl);
        // console.log('RouterService.getPath', initialUrl);
        var routePath = new route_path_1.RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
        return routePath;
    };
    Object.defineProperty(RouterService, "locationStrategy", {
        get: function () {
            if (this.locationStrategy_) {
                return this.locationStrategy_;
            }
            else {
                return this.locationStrategy_ = new location_strategy_1.LocationStrategyPath();
            }
        },
        enumerable: false,
        configurable: true
    });
    RouterService.useLocationStrategy = function (locationStrategyFactory) {
        this.locationStrategy_ = new locationStrategyFactory();
    };
    RouterService.routes = [];
    RouterService.route$ = new rxjs_1.ReplaySubject(1);
    RouterService.events$ = new rxjs_1.ReplaySubject(1);
    return RouterService;
}());
exports.default = RouterService;
function getFlatRoutes_(routes) {
    var reduceRoutes = function (routes) {
        return routes.reduce(function (p, c) {
            p.push(c);
            p.push.apply(p, reduceRoutes(c.children || []));
            return p;
        }, []);
    };
    return reduceRoutes(routes);
}
function getFlatSnapshots_(currentSnapshot) {
    var snapshots = [currentSnapshot];
    var childRoute = currentSnapshot.childRoute;
    while (childRoute) {
        snapshots.push(childRoute);
        childRoute = childRoute.childRoute;
    }
    return snapshots;
}
function clearRoutes_(routes, currentSnapshot) {
    var snapshots = getFlatSnapshots_(currentSnapshot);
    var flatRoutes = getFlatRoutes_(routes);
    flatRoutes.forEach(function (route) {
        if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
            route.snapshot = undefined;
        } /* else {
            console.log(route);
        }*/
    });
}
function resolveRoutes_(routes, childRoutes, initialUrl, previousRoute) {
    var e_2, _a;
    var resolvedSnapshot;
    try {
        for (var childRoutes_1 = tslib_1.__values(childRoutes), childRoutes_1_1 = childRoutes_1.next(); !childRoutes_1_1.done; childRoutes_1_1 = childRoutes_1.next()) {
            var route = childRoutes_1_1.value;
            var snapshot = resolveRoute_(routes, route, initialUrl, previousRoute);
            if (snapshot) {
                if (resolvedSnapshot) {
                    /*
                    if (snapshot.remainUrl.length < resolvedSnapshot.remainUrl.length) {
                        // console.log('RouterService.resolveRoutes_', snapshot.remainUrl.length, '<', resolvedSnapshot.remainUrl.length, snapshot.path, snapshot.remainUrl);
                    }
                    */
                    resolvedSnapshot = snapshot.remainUrl.length < resolvedSnapshot.remainUrl.length ? snapshot : resolvedSnapshot;
                }
                else {
                    resolvedSnapshot = snapshot;
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (childRoutes_1_1 && !childRoutes_1_1.done && (_a = childRoutes_1.return)) _a.call(childRoutes_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return resolvedSnapshot;
    // return childRoutes.reduce<RouteSnapshot | undefined>((p, route) => p || resolveRoute_(routes, route, initialUrl), undefined);
}
function resolveRoute_(routes, route, initialUrl, previousRoute) {
    var _a;
    // console.log('resolveRoute_', initialUrl);
    var urlAfterRedirects;
    var extractedUrl = '';
    var remainUrl = initialUrl;
    var match = initialUrl.match(route.matcher);
    // console.log('RouterService.resolveRoute_', route.matcher, match?.length, initialUrl, '=>', route.path);
    if (!match) {
        // console.log('RouterService.resolveRoute_', initialUrl, '=>', route.path);
        return undefined;
    }
    if (route.redirectTo) {
        // console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.redirectTo, match);
        var routePath_1 = RouterService.getPath(route.redirectTo);
        return resolveRoutes_(routes, routes, routePath_1.url, previousRoute);
    } /* else {
        // console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.path, match);
    }*/
    extractedUrl = match[0];
    remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
    var routePath = new route_path_1.RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
    var params = routePath.params;
    var snapshot = new route_snapshot_1.RouteSnapshot(tslib_1.__assign(tslib_1.__assign({}, route), { initialUrl: initialUrl, urlAfterRedirects: urlAfterRedirects, extractedUrl: extractedUrl, remainUrl: remainUrl, params: params }));
    snapshot.previousRoute = previousRoute;
    route.snapshot = snapshot;
    if (snapshot && snapshot.remainUrl.length && ((_a = route.children) === null || _a === void 0 ? void 0 : _a.length)) {
        var childSnapshot = resolveRoutes_(routes, route.children, snapshot.remainUrl, previousRoute);
        snapshot.childRoute = childSnapshot;
        if (childSnapshot) {
            childSnapshot.parent = snapshot;
            snapshot.remainUrl = childSnapshot.remainUrl;
        }
    }
    // console.log('RouterService.resolveRoute_', snapshot.path, snapshot.extractedUrl, snapshot.remainUrl);
    return snapshot;
}
function makeActivatorResponse$_(event, activators) {
    // console.log('makeActivatorResponse$_', event);
    return rxjs_1.combineLatest.apply(void 0, tslib_1.__spread(activators)).pipe(operators_1.map(function (values) {
        var canActivate = values.reduce(function (p, c) {
            return p === true ? (c === true ? true : c) : p;
        }, true);
        if (canActivate === true) {
            return event;
        }
        else {
            var cancelEvent = tslib_1.__assign(tslib_1.__assign({}, event), { reason: 'An activation guard has dismissed navigation to the route.' });
            if (canActivate !== false) {
                var routePath = RouterService.getPath(canActivate);
                cancelEvent.redirectTo = [routePath.url];
            }
            return new router_events_1.NavigationCancel(cancelEvent);
        }
    }));
}
function makeCanDeactivateResponse$_(events$, event, currentRoute) {
    // console.log('makeCanDeactivateResponse$_', event);
    if (event.route.canDeactivate && event.route.canDeactivate.length) {
        var route = event.route;
        var instance_1 = rxcomp_1.getContextByNode(event.route.element).instance;
        return makeActivatorResponse$_(event, route.canDeactivate.map(function (x) { return x(instance_1, currentRoute); }));
    }
    else {
        return rxjs_1.of(event);
    }
}
function makeCanLoadResponse$_(events$, event) {
    // console.log('makeCanLoadResponse$_', event);
    if (event.route.canLoad && event.route.canLoad.length) {
        var route_2 = event.route;
        return makeActivatorResponse$_(event, route_2.canLoad.map(function (x) { return x(route_2, route_2.segments); }));
    }
    else {
        return rxjs_1.of(event);
    }
}
function makeCanActivateChildResponse$_(events$, event) {
    // console.log('makeCanActivateChildResponse$_', event, event.route.childRoute);
    var reduceChildRouteActivators_ = function (route, activators) {
        // console.log('reduceChildRouteActivators_', route.canActivateChild, route.childRoute);
        while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
            var routeActivators = route.canActivateChild.map(function (x) { return x(route.childRoute); });
            Array.prototype.push.apply(activators, routeActivators);
            route = route.childRoute;
        }
        return activators;
    };
    var activators = reduceChildRouteActivators_(event.route, []);
    // console.log('makeCanActivateChildResponse$_', activators);
    if (activators.length) {
        return makeActivatorResponse$_(event, activators);
    }
    else {
        return rxjs_1.of(event);
    }
}
function makeCanActivateResponse$_(events$, event) {
    // console.log('makeCanActivateResponse$_', event);
    if (event.route.canActivate && event.route.canActivate.length) {
        var route_3 = event.route;
        return makeActivatorResponse$_(event, route_3.canActivate.map(function (x) { return x(route_3); }));
    }
    else {
        return rxjs_1.of(event);
    }
}
