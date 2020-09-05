import { getContextByNode, isPlatformServer, WINDOW } from 'rxcomp';
import { combineLatest, EMPTY, fromEvent, merge, of, ReplaySubject } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { LocationStrategyPath } from '../location/location.strategy';
import { Route } from '../route/route';
import { RoutePath } from '../route/route-path';
import { RouteSnapshot } from '../route/route-snapshot';
import { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized } from './router-events';
export default class RouterService {
    static get flatRoutes() {
        return getFlatRoutes_(this.routes);
    }
    static setRoutes(routes) {
        this.routes = routes.map((x) => new Route(x));
        this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
        return this;
    }
    static setRouterLink(routerLink, extras = { skipLocationChange: false }) {
        // ['/hero', hero.id];
        this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
    }
    static navigate(routerLink, extras = { skipLocationChange: false }) {
        // navigate(['items'], { relativeTo: this.route });
        // navigate(['/heroes', { id: heroId }]);
        this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
    }
    static findRoute(routerLink) {
        const initialUrl = this.locationStrategy.serializeLink(routerLink);
        return this.findRouteByUrl(initialUrl);
    }
    static findRouteByUrl(initialUrl) {
        const routes = getFlatRoutes_(this.routes);
        let resolvedRoute = null;
        let lastMatcbesLength = Number.NEGATIVE_INFINITY;
        for (let route of routes) {
            const matches = initialUrl.match(route.matcher);
            if (matches && (!resolvedRoute || matches[0].length > lastMatcbesLength)) {
                lastMatcbesLength = matches[0].length;
                resolvedRoute = route;
            }
        }
        let urlAfterRedirects = initialUrl;
        if (resolvedRoute && resolvedRoute.redirectTo) {
            // const routePath: RoutePath = RouterService.getPath(resolvedRoute.redirectTo);
            // urlAfterRedirects = routePath.url;
            urlAfterRedirects = resolvedRoute.redirectTo;
            resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
        }
        // console.log('RouterService.findRouteByUrl', resolvedRoute);
        return resolvedRoute;
    }
    static getPath(routerLink = []) {
        const lastPath = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(x => {
            return typeof x === 'string' ? x : this.locationStrategy.encodeParams(x);
        }).join('/');
        const segments = [];
        const routes = [];
        const route = this.findRouteByUrl(lastPath);
        if (route) {
            let r = route === null || route === void 0 ? void 0 : route.parent;
            while (r) {
                segments.unshift.apply(segments, r.segments);
                routes.unshift(r instanceof RouteSnapshot ? r : r.snapshot || r);
                r = r.parent;
            }
            segments.push.apply(segments, (route === null || route === void 0 ? void 0 : route.segments) || []);
            routes.push({ path: lastPath });
        }
        let initialUrl = routes.map(r => r instanceof RouteSnapshot ? r.extractedUrl : r.path).join('/');
        initialUrl = this.locationStrategy.getPath(initialUrl);
        // console.log('RouterService.getPath', initialUrl);
        const routePath = new RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
        return routePath;
    }
    static get locationStrategy() {
        if (this.locationStrategy_) {
            return this.locationStrategy_;
        }
        else {
            return this.locationStrategy_ = new LocationStrategyPath();
        }
    }
    static useLocationStrategy(locationStrategyType) {
        this.locationStrategy_ = new locationStrategyType();
    }
}
RouterService.routes = [];
RouterService.route$ = new ReplaySubject(1);
RouterService.events$ = new ReplaySubject(1);
function getFlatRoutes_(routes) {
    const reduceRoutes = (routes) => {
        return routes.reduce((p, c) => {
            p.push(c);
            p.push.apply(p, reduceRoutes(c.children || []));
            return p;
        }, []);
    };
    return reduceRoutes(routes);
}
function getFlatSnapshots_(currentSnapshot) {
    let snapshots = [currentSnapshot];
    let childRoute = currentSnapshot.childRoute;
    while (childRoute) {
        snapshots.push(childRoute);
        childRoute = childRoute.childRoute;
    }
    return snapshots;
}
function clearRoutes_(routes, currentSnapshot) {
    let snapshots = getFlatSnapshots_(currentSnapshot);
    const flatRoutes = getFlatRoutes_(routes);
    flatRoutes.forEach((route) => {
        if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
            route.snapshot = undefined;
        }
    });
}
function resolveRoutes_(routes, childRoutes, initialUrl) {
    let resolvedSnapshot;
    for (let route of childRoutes) {
        const snapshot = resolveRoute_(routes, route, initialUrl);
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
    return resolvedSnapshot;
    // return childRoutes.reduce<RouteSnapshot | undefined>((p, route) => p || resolveRoute_(routes, route, initialUrl), undefined);
}
function resolveRoute_(routes, route, initialUrl) {
    var _a;
    // console.log('resolveRoute_', initialUrl);
    let urlAfterRedirects;
    let extractedUrl = '';
    let remainUrl = initialUrl;
    const match = initialUrl.match(route.matcher);
    // console.log('RouterService.resolveRoute_', route.matcher, match?.length, initialUrl, '=>', route.path);
    if (!match) {
        // console.log('RouterService.resolveRoute_', initialUrl, '=>', route.path);
        return undefined;
    }
    if (route.redirectTo) {
        // console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.redirectTo, match);
        const routePath = RouterService.getPath(route.redirectTo);
        return resolveRoutes_(routes, routes, routePath.url);
    } /* else {
        // console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.path, match);
    }*/
    extractedUrl = match[0];
    remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
    const routePath = new RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
    let params = routePath.params;
    const snapshot = new RouteSnapshot(Object.assign(Object.assign({}, route), { initialUrl, urlAfterRedirects, extractedUrl, remainUrl, params }));
    route.snapshot = snapshot;
    if (snapshot && snapshot.remainUrl.length && ((_a = route.children) === null || _a === void 0 ? void 0 : _a.length)) {
        const childSnapshot = resolveRoutes_(routes, route.children, snapshot.remainUrl);
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
    return combineLatest(...activators).pipe(map((values) => {
        const canActivate = values.reduce((p, c) => {
            return p === true ? (c === true ? true : c) : p;
        }, true);
        if (canActivate === true) {
            return event;
        }
        else {
            const cancelEvent = Object.assign(Object.assign({}, event), { reason: 'An activation guard has dismissed navigation to the route.' });
            if (canActivate !== false) {
                const routePath = RouterService.getPath(canActivate);
                cancelEvent.redirectTo = [routePath.url];
            }
            return new NavigationCancel(cancelEvent);
        }
    }));
}
function makeCanDeactivateResponse$_(events$, event, currentRoute) {
    // console.log('makeCanDeactivateResponse$_', event);
    if (event.route.canDeactivate && event.route.canDeactivate.length) {
        const route = event.route;
        const instance = getContextByNode(event.route.element).instance;
        return makeActivatorResponse$_(event, route.canDeactivate.map(x => x(instance, currentRoute)));
    }
    else {
        return of(event);
    }
}
function makeCanLoadResponse$_(events$, event) {
    // console.log('makeCanLoadResponse$_', event);
    if (event.route.canLoad && event.route.canLoad.length) {
        const route = event.route;
        return makeActivatorResponse$_(event, route.canLoad.map(x => x(route, route.segments)));
    }
    else {
        return of(event);
    }
}
function makeCanActivateChildResponse$_(events$, event) {
    // console.log('makeCanActivateChildResponse$_', event, event.route.childRoute);
    const reduceChildRouteActivators_ = (route, activators) => {
        // console.log('reduceChildRouteActivators_', route.canActivateChild, route.childRoute);
        while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
            const routeActivators = route.canActivateChild.map(x => x(route.childRoute));
            Array.prototype.push.apply(activators, routeActivators);
            route = route.childRoute;
        }
        return activators;
    };
    const activators = reduceChildRouteActivators_(event.route, []);
    // console.log('makeCanActivateChildResponse$_', activators);
    if (activators.length) {
        return makeActivatorResponse$_(event, activators);
    }
    else {
        return of(event);
    }
}
function makeCanActivateResponse$_(events$, event) {
    // console.log('makeCanActivateResponse$_', event);
    if (event.route.canActivate && event.route.canActivate.length) {
        const route = event.route;
        return makeActivatorResponse$_(event, route.canActivate.map(x => x(route)));
    }
    else {
        return of(event);
    }
}
function makeObserve$_(routes, route$, events$, locationStrategy) {
    let currentRoute;
    // console.log('RouterService.WINDOW', WINDOW!!);
    const stateEvents$ = isPlatformServer ? EMPTY : merge(fromEvent(WINDOW, 'popstate')).pipe(
    /*
    tap((event: PopStateEvent) => {
        // detect rxcomp !!!
        // event.preventDefault();
        // event.stopImmediatePropagation(); // !!!
        // history.go(1);
        // console.log('RouterService.onPopState', `location: "${document.location.pathname}"`, `state: "${event.state}"`);
    }),
    */
    map(event => new NavigationStart({ routerLink: document.location.pathname, trigger: 'popstate' })), shareReplay(1));
    return merge(stateEvents$, events$).pipe(switchMap((event) => {
        if (event instanceof GuardsCheckStart) {
            return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(switchMap((nextEvent) => {
                if (nextEvent instanceof NavigationCancel) {
                    return of(nextEvent);
                }
                else {
                    return makeCanLoadResponse$_(events$, event).pipe(switchMap((nextEvent) => {
                        if (nextEvent instanceof NavigationCancel) {
                            return of(nextEvent);
                        }
                        else {
                            return makeCanActivateChildResponse$_(events$, event);
                        }
                    }));
                }
            }));
        }
        else if (event instanceof ChildActivationStart) {
            return makeCanActivateResponse$_(events$, event);
        }
        else {
            return of(event);
        }
    }), tap((event) => {
        var _a, _b, _c;
        if (event instanceof NavigationStart) {
            // console.log('NavigationStart', event.routerLink);
            const routerLink = event.routerLink;
            // console.log('routerLink', routerLink);
            let snapshot;
            let initialUrl;
            const routePath = RouterService.getPath(routerLink);
            // console.log(routePath, routePath.url);
            initialUrl = routePath.url;
            // console.log('initialUrl', initialUrl);
            const isRelative = initialUrl.indexOf('/') !== 0;
            if (isRelative && currentRoute && ((_a = currentRoute.children) === null || _a === void 0 ? void 0 : _a.length)) {
                snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl);
                if (snapshot) {
                    currentRoute.childRoute = snapshot;
                    snapshot.parent = currentRoute;
                    snapshot = currentRoute;
                }
                // console.log('relative', currentRoute, snapshot, initialUrl);
            }
            else {
                snapshot = resolveRoutes_(routes, routes, initialUrl);
                // console.log('absolute');
            }
            if (snapshot) {
                // console.log('RouterService.makeObserve$_', 'NavigationStart', snapshot);
                currentRoute = snapshot;
                events$.next(new RoutesRecognized(Object.assign(Object.assign({}, event), { route: snapshot })));
            }
            else {
                events$.next(new NavigationError(Object.assign(Object.assign({}, event), { error: new Error('unknown route') })));
            }
        }
        else if (event instanceof RoutesRecognized) {
            // console.log('RoutesRecognized', event.route.component, event.route.initialUrl, event.route.extractedUrl, event.route.urlAfterRedirects);
            events$.next(new GuardsCheckStart(Object.assign({}, event)));
        }
        else if (event instanceof GuardsCheckStart) {
            // console.log('GuardsCheckStart', event);
            events$.next(new ChildActivationStart(Object.assign({}, event)));
        }
        else if (event instanceof ChildActivationStart) {
            // console.log('ChildActivationStart', event);
            events$.next(new ActivationStart(Object.assign({}, event)));
        }
        else if (event instanceof ActivationStart) {
            // console.log('ActivationStart', event);
            events$.next(new GuardsCheckEnd(Object.assign({}, event)));
        }
        else if (event instanceof GuardsCheckEnd) {
            // console.log('GuardsCheckEnd', event);
            events$.next(new ResolveStart(Object.assign({}, event)));
        }
        else if (event instanceof ResolveStart) {
            // console.log('ResolveStart', event);
            events$.next(new ResolveEnd(Object.assign({}, event)));
        }
        else if (event instanceof ResolveEnd) {
            // console.log('ResolveEnd', event);
            events$.next(new ActivationEnd(Object.assign({}, event)));
        }
        else if (event instanceof ActivationEnd) {
            // console.log('ActivationEnd', event);
            events$.next(new ChildActivationEnd(Object.assign({}, event)));
        }
        else if (event instanceof ChildActivationEnd) {
            // console.log('ChildActivationEnd', event);
            events$.next(new RouteConfigLoadStart(Object.assign({}, event)));
        }
        else if (event instanceof RouteConfigLoadStart) {
            // console.log('RouteConfigLoadStart', event);
            events$.next(new RouteConfigLoadEnd(Object.assign({}, event)));
        }
        else if (event instanceof RouteConfigLoadEnd) {
            // console.log('RouteConfigLoadEnd', event);
            events$.next(new NavigationEnd(Object.assign({}, event)));
        }
        else if (event instanceof NavigationEnd) {
            const segments = [];
            let source = event.route;
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
            const extractedUrl = segments.join('/').replace(/\/\//g, '/');
            // console.log('NavigationEnd', event.route.extractedUrl, event.route);
            clearRoutes_(routes, event.route);
            locationStrategy.setHistory(extractedUrl, undefined, event.trigger === 'popstate');
            // setHistory_(locationStrategy, extractedUrl, undefined, event.trigger === 'popstate');
            route$.next(event.route);
        }
        else if (event instanceof NavigationCancel) {
            // console.log('NavigationCancel', event.reason, event.redirectTo);
            if (event.redirectTo) {
                // const routePath: RoutePath = RouterService.getPath(event.redirectTo);
                events$.next(new NavigationStart({ routerLink: event.redirectTo, trigger: 'imperative' }));
            }
        }
        else if (event instanceof NavigationError) {
            console.log('NavigationError', event.error);
        }
    }), catchError((error) => of(new NavigationError(Object.assign(Object.assign({}, event), { error })))), shareReplay(1));
}
