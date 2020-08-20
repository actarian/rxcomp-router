import { isPlatformBrowser } from 'rxcomp';
import { combineLatest, fromEvent, merge, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { INavigationExtras, IRoute, IRoutes, Route, Routes, serializeUrl_ } from '../route/route';
import { encodeParams_, RoutePath } from '../route/route-path';
import { RouteSegment } from '../route/route-segment';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouteComponent, RouterKeyValue, RouterLink } from '../router.types';
import { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, IRouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RouterEvent, RoutesRecognized } from './router-events';

export default class RouterService {
    // static locationStrategy: any;
    static get flatRoutes(): Routes {
        return getFlatRoutes_(this.routes);
    }
    static routes: Routes = [];
    static route$: ReplaySubject<RouteSnapshot> = new ReplaySubject<RouteSnapshot>(1);
    static events$: ReplaySubject<RouterEvent> = new ReplaySubject<RouterEvent>(1);
    static observe$: Observable<RouterEvent>;
    static setRoutes(routes: IRoutes): RouterService {
        this.routes = routes.map((x: IRoute) => new Route(x));
        this.observe$ = makeObserve$_(this.routes, this.route$, this.events$);
        return this;
    }
    static setRouterLink(routerLink: RouterLink, extras: INavigationExtras = { skipLocationChange: false }): void {
        // ['/hero', hero.id];
        this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
    }
    static navigate(routerLink: RouterLink, extras: INavigationExtras = { skipLocationChange: false }): void {
        // navigate(['items'], { relativeTo: this.route });
        // navigate(['/heroes', { id: heroId }]);
        this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
    }
    static findRoute(routerLink: RouterLink): Route | null {
        const initialUrl: string = serializeUrl_(routerLink);
        return this.findRouteByUrl(initialUrl);
    }
    static findRouteByUrl(initialUrl: string): Route | null {
        const routes: Routes = getFlatRoutes_(this.routes);
        let resolvedRoute: Route | null = routes.find(route => initialUrl.match(route.matcher)) || null;
        let urlAfterRedirects: string = initialUrl;
        if (resolvedRoute && resolvedRoute.redirectTo) {
            urlAfterRedirects = resolvedRoute.redirectTo;
            resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
        }
        return resolvedRoute;
    }
    static getPath(routerLink: RouterLink = []): RoutePath {
        const lastPath: string = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(x => {
            return typeof x === 'string' ? x : encodeParams_(x);
        }).join('/');
        const segments: RouteSegment[] = [];
        const routes: (Route | RouteSnapshot)[] = [];
        const route: Route | null = RouterService.findRouteByUrl(lastPath);
        if (route) {
            let r: Route | RouteSnapshot | undefined | null = route?.parent;
            while (r) {
                segments.unshift.apply(segments, r.segments);
                routes.unshift(r instanceof RouteSnapshot ? r : r.snapshot || r);
                r = r.parent;
            }
            segments.push.apply(segments, route?.segments || []);
            routes.push({ path: lastPath } as any);
        }
        const initialUrl: string = routes.map(r => r instanceof RouteSnapshot ? r.extractedUrl : r.path).join('/');
        // console.log('RouterService.getPath', initialUrl, routes);
        const routePath: RoutePath = new RoutePath(initialUrl, segments, route || undefined);
        return routePath;
    }
}
function setHistory_(url: string, params?: URLSearchParams, popped?: boolean): void {
    if (isPlatformBrowser && window.history && window.history.pushState) {
        const title = document.title;
        url = `${url}${params ? '?' + params.toString() : ''}`;
        // !!!
        // const state = params ? params.toString() : '';
        // console.log(state);
        if (popped) {
            window.history.replaceState(undefined, title, url);
        } else {
            window.history.pushState(undefined, title, url);
        }
    }
}
function getFlatRoutes_(routes: Routes): Routes {
    const reduceRoutes: (routes: Route[]) => Route[] = (routes: Route[]): Route[] => {
        return routes.reduce<Routes>((p: Route[], c: Route) => {
            p.push(c);
            p.push.apply(p, reduceRoutes(c.children || []));
            return p;
        }, []);
    }
    return reduceRoutes(routes);
}
function getFlatSnapshots_(currentSnapshot: RouteSnapshot): RouteSnapshot[] {
    let snapshots: RouteSnapshot[] = [currentSnapshot];
    let childRoute: RouteSnapshot | undefined = currentSnapshot.childRoute;
    while (childRoute) {
        snapshots.push(childRoute)
        childRoute = childRoute.childRoute;
    }
    return snapshots;
}
function clearRoutes_(routes: Routes, currentSnapshot: RouteSnapshot): void {
    let snapshots: RouteSnapshot[] = getFlatSnapshots_(currentSnapshot);
    const flatRoutes: Routes = getFlatRoutes_(routes);
    flatRoutes.forEach((route: Route) => {
        if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
            route.snapshot = undefined;
        }
    });
}
function resolveRoutes_(routes: Routes, childRoutes: Routes, initialUrl: string): RouteSnapshot | undefined {
    return childRoutes.reduce<RouteSnapshot | undefined>((p, route) => p || resolveRoute_(routes, route, initialUrl), undefined);
}
function resolveRoute_(routes: Routes, route: Route, initialUrl: string): RouteSnapshot | undefined {
    let urlAfterRedirects!: string;
    let extractedUrl: string = '';
    let remainUrl: string = initialUrl;
    const match: RegExpMatchArray | null = initialUrl.match(route.matcher);
    if (match === null) {
        return undefined;
    }
    if (route.redirectTo) {
        return resolveRoute_(routes, route, route.redirectTo);
    }
    extractedUrl = match[0];
    remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
    /*
    while (route && route.redirectTo) {
        urlAfterRedirects = route.redirectTo;
        const routePath: RoutePath = RouterService.getPath(route?.redirectTo);
        // const routePath: RoutePath = RoutePath.fromRouterLink(route?.redirectTo);
        initialUrl = routePath.url;
        remainUrl = initialUrl;
        route = routes.find(r => {
            const match: RegExpMatchArray | null = initialUrl.match(r.matcher);
            // console.log('match', match);
            if (match !== null) {
                extractedUrl = match[0];
                remainUrl = initialUrl.substr(match[0].length, initialUrl.length);
                return true;
            } else {
                return false;
            }
        });
    }
    */
    // console.log('initialUrl', initialUrl);
    // console.log('remainUrl', remainUrl);
    const routePath: RoutePath = new RoutePath(extractedUrl, route.segments);
    let params: RouterKeyValue = routePath.params;
    /*
    console.log('route.segments', route.segments);
    const values: string[] = extractedUrl.split('/').filter(x => x !== '');
    const params: RouterKeyValue = {};
    route.segments.forEach((segment: RouteSegment, index: number) => {
        console.log('segment.params', segment.params);
        const keys: string[] = Object.keys(segment.params);
        if (keys.length) {
            params[keys[0]] = decodeParams__(values[index]);
        }
    });
    */
    // console.log('Route.resolve', params);
    // console.log('Route.resolve', extractedUrl.split('/').filter(x => x !== ''), route.segments.map(x => x.toString()).join('/'));
    const snapshot: RouteSnapshot = new RouteSnapshot({ ...route, initialUrl, urlAfterRedirects, extractedUrl, remainUrl, params });
    route.snapshot = snapshot;
    // console.log('route.snapshot', route.path, snapshot.extractedUrl);
    if (route.children?.length && remainUrl.length) {
        const childRoute: RouteSnapshot | undefined = resolveRoutes_(routes, route.children, remainUrl);
        snapshot.childRoute = childRoute;
        if (childRoute) {
            childRoute.parent = snapshot;
        }
        // console.log('childRoute', childRoute);
    }
    // console.log('RouteSnapshot', snapshot.path, snapshot.extractedUrl, snapshot.remainUrl);
    return snapshot;
}
function makeActivatorResponse$_(event: RouterEvent, activators: Observable<boolean | RouteComponent[]>[]): Observable<RouterEvent> {
    // console.log('makeActivatorResponse$_', event);
    return combineLatest(...activators).pipe(
        map((values: (boolean | RouteComponent[])[]) => {
            const canActivate: boolean | RouteComponent[] = values.reduce<boolean | RouteComponent[]>((p: boolean | RouteComponent[], c: boolean | RouteComponent[]) => {
                return p === true ? (c === true ? true : c) : p;
            }, true);
            if (canActivate === true) {
                return event;
            } else {
                const cancelEvent: IRouterEvent = { ...event, reason: 'An activation guard has dismissed navigation to the route.' };
                if (canActivate !== false) {
                    cancelEvent.redirectTo = canActivate;
                }
                return new NavigationCancel(cancelEvent);
            }
        })
    );
}
function makeCanDeactivateResponse$_(events$: ReplaySubject<RouterEvent>, event: GuardsCheckStart, currentRoute?: RouteSnapshot): Observable<RouterEvent> {
    // console.log('makeCanDeactivateResponse$_', event);
    if (event.route.canDeactivate && event.route.canDeactivate.length && currentRoute?.instance) {
        const route: RouteSnapshot = event.route;
        return makeActivatorResponse$_(event, route.canDeactivate.map(x => x(currentRoute.instance!, currentRoute)));
    } else {
        return of(event);
    }
}
function makeCanLoadResponse$_(events$: ReplaySubject<RouterEvent>, event: GuardsCheckStart): Observable<RouterEvent> {
    // console.log('makeCanLoadResponse$_', event);
    if (event.route.canLoad && event.route.canLoad.length) {
        const route: RouteSnapshot = event.route;
        return makeActivatorResponse$_(event, route.canLoad.map(x => x(route, route.segments)));
    } else {
        return of(event);
    }
}
function makeCanActivateChildResponse$_(events$: ReplaySubject<RouterEvent>, event: GuardsCheckStart): Observable<RouterEvent> {
    // console.log('makeCanActivateChildResponse$_', event, event.route.childRoute);
    const reduceChildRouteActivators_ = (route: RouteSnapshot, activators: Observable<boolean | RouteComponent[]>[]): Observable<boolean | RouteComponent[]>[] => {
        // console.log('reduceChildRouteActivators_', route.canActivateChild, route.childRoute);
        while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
            const routeActivators: Observable<boolean | RouteComponent[]>[] = route.canActivateChild.map(x => x(route.childRoute!));
            Array.prototype.push.apply(activators, routeActivators);
            route = route.childRoute;
        }
        return activators;
    }
    const activators: Observable<boolean | RouteComponent[]>[] = reduceChildRouteActivators_(event.route, []);
    // console.log('makeCanActivateChildResponse$_', activators);
    if (activators.length) {
        return makeActivatorResponse$_(event, activators);
    } else {
        return of(event);
    }
}
function makeCanActivateResponse$_(events$: ReplaySubject<RouterEvent>, event: ChildActivationStart): Observable<RouterEvent> {
    // console.log('makeCanActivateResponse$_', event);
    if (event.route.canActivate && event.route.canActivate.length) {
        const route: RouteSnapshot = event.route;
        return makeActivatorResponse$_(event, route.canActivate.map(x => x(route)));
    } else {
        return of(event);
    }
}
function makeObserve$_(routes: Routes, route$: ReplaySubject<RouteSnapshot>, events$: ReplaySubject<RouterEvent>): Observable<RouterEvent> {
    let currentRoute: RouteSnapshot | undefined;
    const stateEvents$ = merge(fromEvent<PopStateEvent>(window, 'popstate')).pipe(
        tap((event: PopStateEvent) => {
            console.log('location', document.location.pathname, 'state', event.state);
        }),
        map(event => new NavigationStart({ routerLink: document.location.pathname, trigger: 'popstate' })),
        shareReplay(1),
    );
    return merge(stateEvents$, events$).pipe(
        switchMap((event: RouterEvent) => {
            if (event instanceof GuardsCheckStart) {
                return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(
                    switchMap((nextEvent: RouterEvent) => {
                        if (nextEvent instanceof NavigationCancel) {
                            return of(nextEvent);
                        } else {
                            return makeCanLoadResponse$_(events$, event).pipe(
                                switchMap((nextEvent: RouterEvent) => {
                                    if (nextEvent instanceof NavigationCancel) {
                                        return of(nextEvent);
                                    } else {
                                        return makeCanActivateChildResponse$_(events$, event);
                                    }
                                }),
                            );
                        }
                    }),
                );
            } else if (event instanceof ChildActivationStart) {
                return makeCanActivateResponse$_(events$, event);
            } else {
                return of(event);
            }
        }),
        tap((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                // console.log('NavigationStart', event.routerLink);
                const routerLink = event.routerLink;
                // console.log('routerLink', routerLink);
                let snapshot: RouteSnapshot | undefined;
                let initialUrl: string;
                const routePath: RoutePath = RouterService.getPath(routerLink);
                // const routePath: RoutePath = RoutePath.fromRouterLink(routerLink);
                // console.log(routePath, routePath.url);
                initialUrl = routePath.url;
                // console.log('initialUrl', initialUrl);
                const isRelative: boolean = initialUrl.indexOf('/') !== 0;
                if (isRelative && currentRoute && currentRoute.children?.length) {
                    snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl);
                    if (snapshot) {
                        currentRoute.childRoute = snapshot;
                        snapshot.parent = currentRoute;
                        snapshot = currentRoute;
                    }
                    // console.log('relative', currentRoute, snapshot, initialUrl);
                } else {
                    snapshot = resolveRoutes_(routes, routes, initialUrl);
                    // console.log('absolute');
                }
                if (snapshot) {
                    // console.log(routes);
                    currentRoute = snapshot;
                    events$.next(new RoutesRecognized({ ...event, route: snapshot }));
                } else {
                    events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
                }
            } else if (event instanceof RoutesRecognized) {
                // console.log('RoutesRecognized', event);
                events$.next(new GuardsCheckStart({ ...event }));
            } else if (event instanceof GuardsCheckStart) {
                // console.log('GuardsCheckStart', event);
                events$.next(new ChildActivationStart({ ...event }));
            } else if (event instanceof ChildActivationStart) {
                // console.log('ChildActivationStart', event);
                events$.next(new ActivationStart({ ...event }));
            } else if (event instanceof ActivationStart) {
                // console.log('ActivationStart', event);
                events$.next(new GuardsCheckEnd({ ...event }));
            } else if (event instanceof GuardsCheckEnd) {
                // console.log('GuardsCheckEnd', event);
                events$.next(new ResolveStart({ ...event }));
            } else if (event instanceof ResolveStart) {
                // console.log('ResolveStart', event);
                events$.next(new ResolveEnd({ ...event }));
            } else if (event instanceof ResolveEnd) {
                // console.log('ResolveEnd', event);
                events$.next(new ActivationEnd({ ...event }));
            } else if (event instanceof ActivationEnd) {
                // console.log('ActivationEnd', event);
                events$.next(new ChildActivationEnd({ ...event }));
            } else if (event instanceof ChildActivationEnd) {
                // console.log('ChildActivationEnd', event);
                events$.next(new RouteConfigLoadStart({ ...event }));

            } else if (event instanceof RouteConfigLoadStart) {
                // console.log('RouteConfigLoadStart', event);
                events$.next(new RouteConfigLoadEnd({ ...event }));
            } else if (event instanceof RouteConfigLoadEnd) {
                // console.log('RouteConfigLoadEnd', event);
                events$.next(new NavigationEnd({ ...event }));
            } else if (event instanceof NavigationEnd) {
                const segments: string[] = [];
                let source: RouteSnapshot | undefined = event.route;
                while (source != null) {
                    // console.log(source.params, source.data);
                    if (source.extractedUrl?.length) {
                        segments.push(source.extractedUrl);
                    }
                    if (source.childRoute) {
                        source = source.childRoute;
                    } else {
                        if (source.remainUrl?.length) {
                            segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
                        }
                        source = undefined;
                    }
                }
                const extractedUrl: string = segments.join('/').replace(/\/\//g, '/');
                console.log('NavigationEnd', event);
                clearRoutes_(routes, event.route);
                setHistory_(extractedUrl, undefined, event.trigger === 'popstate');
                route$.next(event.route);
            } else if (event instanceof NavigationCancel) {
                console.log('NavigationCancel', event);
                if (event.redirectTo) {
                    events$.next(new NavigationStart({ routerLink: event.redirectTo, trigger: 'imperative' }));
                }
            } else if (event instanceof NavigationError) {
                console.log('NavigationError', event);
            }
        }),
        catchError((error: Error) => of(new NavigationError({ ...event, error }))),
        shareReplay(1),
    );
}

/*
private static makeObserve$_____remove_(): Observable<RouterEvent> {
    let currentRoute: RouteSnapshot | undefined;
    const stateEvents$ = merge(fromEvent<PopStateEvent>(window, 'popstate')).pipe(
        tap((event: PopStateEvent) => {
            console.log('location', document.location.pathname, 'state', event.state);
        }),
        map(event => new NavigationStart({ routerLink: document.location.pathname, trigger: 'popstate' })),
        shareReplay(1),
    );
    return merge(stateEvents$, RouterService.events$).pipe(
        switchMap((event: RouterEvent) => {
            if (event instanceof GuardsCheckStart && event.route.canActivate && event.route.canActivate.length) {
                return combineLatest(...event.route.canActivate).pipe(
                    map((values: boolean[]) => {
                        const canActivate: boolean = values.reduce<boolean>((p: boolean, c: boolean) => {
                            return p && c;
                        }, true);
                        if (canActivate) {
                            return event;
                        } else {
                            return new NavigationCancel({ ...event, reason: 'Activation guard has dismissed navigation to route.' })
                        }
                    })
                );
            } else {
                return of(event);
            }
        }),
        tap((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                console.log('NavigationStart', event.routerLink);
                const routerLink = event.routerLink;
                // console.log('routerLink', routerLink);
                let snapshot: RouteSnapshot | undefined;
                const initialUrl: string = serializeUrl_(routerLink);
                const isRelative: boolean = initialUrl.indexOf('/') !== 0;
                if (isRelative && currentRoute && currentRoute.children?.length) {
                    snapshot = currentRoute.children.reduce<RouteSnapshot | undefined>((p, r) => p || r.resolve(initialUrl), undefined);
                    if (snapshot) {
                        currentRoute.childRoute = snapshot;
                        snapshot.parent = currentRoute;
                        snapshot = currentRoute;
                    }
                    // console.log('relative', currentRoute, snapshot, initialUrl);
                } else {
                    snapshot = RouterService.routes.reduce<RouteSnapshot | undefined>((p, r) => p || r.resolve(initialUrl), undefined);
                    // console.log('absolute');
                }
                if (snapshot != null) {
                    currentRoute = snapshot;
                    RouterService.events$.next(new RoutesRecognized({ ...event, route: snapshot }));
                } else {
                    RouterService.events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
                }
            } else if (event instanceof RoutesRecognized) {
                // console.log('RoutesRecognized', event);
                RouterService.events$.next(new GuardsCheckStart({ ...event }));
            } else if (event instanceof GuardsCheckStart) {
                RouterService.events$.next(new ChildActivationStart({ ...event }));
            } else if (event instanceof ChildActivationStart) {
                RouterService.events$.next(new ActivationStart({ ...event }));
            } else if (event instanceof ActivationStart) {
                RouterService.events$.next(new GuardsCheckEnd({ ...event }));
            } else if (event instanceof GuardsCheckEnd) {
                RouterService.events$.next(new ResolveStart({ ...event }));
            } else if (event instanceof ResolveStart) {
                RouterService.events$.next(new ResolveEnd({ ...event }));
            } else if (event instanceof ResolveEnd) {
                RouterService.events$.next(new ActivationEnd({ ...event }));
            } else if (event instanceof ActivationEnd) {
                RouterService.events$.next(new ChildActivationEnd({ ...event }));
            } else if (event instanceof ChildActivationEnd) {
                RouterService.events$.next(new RouteConfigLoadStart({ ...event }));

            } else if (event instanceof RouteConfigLoadStart) {
                // console.log('RouteConfigLoadStart', event);
                RouterService.events$.next(new RouteConfigLoadEnd({ ...event }));
            } else if (event instanceof RouteConfigLoadEnd) {
                // console.log('RouteConfigLoadEnd', event);
                RouterService.events$.next(new NavigationEnd({ ...event }));
            } else if (event instanceof NavigationEnd) {
                const segments: string[] = [];
                let source: RouteSnapshot | undefined = event.route;
                while (source != null) {
                    console.log(source.params, source.data);
                    if (source.extractedUrl?.length) {
                        segments.push(source.extractedUrl);
                    }
                    if (source.childRoute) {
                        source = source.childRoute;
                    } else {
                        if (source.remainUrl?.length) {
                            segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
                        }
                        source = undefined;
                    }
                }
                const extractedUrl: string = segments.join('/').replace(/\/\//g, '/');
                console.log('NavigationEnd', extractedUrl);
                setHistory_(extractedUrl, undefined, event.trigger === 'popstate');
                RouterService.route$.next(event.route);
            } else if (event instanceof NavigationCancel) {
                console.log('NavigationCancel', event);
            } else if (event instanceof NavigationError) {
                console.log('NavigationError', event);
            }
        }),
        shareReplay(1),
    );
}
*/
/*
return Observable.create(function (observer: Observer<RouterEvent>) {
    // observer.next(new RouterEvent());
    // observer.complete();
    // observer.error(new RouterErrorEvent());
});
*/