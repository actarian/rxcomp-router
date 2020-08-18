import { isPlatformBrowser } from 'rxcomp';
import { combineLatest, fromEvent, merge, Observable, of, ReplaySubject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { INavigationExtras, IRoute, Route, Routes, serializeUrl_ } from '../route/route';
import { RouteSegment } from '../route/route-segment';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouterKeyValue, RouterLink } from '../router.types';
import { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RouterEvent, RoutesRecognized } from './router-events';

export default class RouterService {
    // static locationStrategy: any;
    static routes: Routes = [];
    static route$: ReplaySubject<RouteSnapshot> = new ReplaySubject<RouteSnapshot>(1);
    static events$: ReplaySubject<RouterEvent> = new ReplaySubject<RouterEvent>(1);
    static observe$: Observable<RouterEvent>;
    static setRoutes(routes: Routes): RouterService {
        this.routes = routes.map(x => new Route(x as unknown as IRoute));
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

function resolveRoute_(routes: Routes, route: Route, initialUrl: string): RouteSnapshot | undefined {
    let urlAfterRedirects!: string;
    let extractedUrl: string = '';
    let remainUrl: string = initialUrl;
    let resolvedRoute: Route | undefined;
    const match: RegExpMatchArray | null = initialUrl.match(route.matcher);
    // console.log('match', initialUrl, match, route.matcher);
    if (match !== null) {
        extractedUrl = match[0];
        remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
        resolvedRoute = route;
    }
    while (resolvedRoute && resolvedRoute.redirectTo) {
        urlAfterRedirects = resolvedRoute.redirectTo;
        initialUrl = serializeUrl_(resolvedRoute.redirectTo);
        remainUrl = initialUrl;
        resolvedRoute = routes.find(r => {
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
    if (resolvedRoute) {
        // console.log('initialUrl', initialUrl);
        // console.log('remainUrl', remainUrl);
        const values: string[] = extractedUrl.split('/').filter(x => x !== '');
        const params: RouterKeyValue = {};
        resolvedRoute.segments.forEach((segment: RouteSegment, index: number) => {
            const keys: string[] = Object.keys(segment.params);
            if (keys.length) {
                params[keys[0]] = values[index];
            }
        });
        // console.log('Route.resolve', params);
        // console.log('Route.resolve', extractedUrl.split('/').filter(x => x !== ''), resolvedRoute.segments.map(x => x.toString()).join('/'));
        const routeSnapshot: RouteSnapshot = new RouteSnapshot({ ...resolvedRoute, initialUrl, urlAfterRedirects, extractedUrl, remainUrl, params });
        if (remainUrl.length && route.children) {
            routeSnapshot.childRoute = route.children.map(x => resolveRoute_(routes, x, remainUrl)).find(x => x != null);
        }
        // console.log('RouteSnapshot', routeSnapshot.path, routeSnapshot.extractedUrl, routeSnapshot.remainUrl);
        return routeSnapshot;
    } else {
        return undefined;
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
            if (event instanceof GuardsCheckStart && event.route.canActivate && event.route.canActivate.length) {
                return combineLatest(...event.route.canActivate.map(x => x(event.route))).pipe(
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
                let routeSnapshot: RouteSnapshot | undefined;
                const initialUrl: string = serializeUrl_(routerLink);
                const isRelative: boolean = initialUrl.indexOf('/') !== 0;
                if (isRelative && currentRoute && currentRoute.children?.length) {
                    routeSnapshot = currentRoute.children.reduce<RouteSnapshot | undefined>((p, r) => p || resolveRoute_(routes, r, initialUrl), undefined);
                    if (routeSnapshot) {
                        currentRoute.childRoute = routeSnapshot;
                        routeSnapshot = currentRoute;
                    }
                    // console.log('relative', currentRoute, routeSnapshot, initialUrl);
                } else {
                    routeSnapshot = routes.reduce<RouteSnapshot | undefined>((p, r) => p || resolveRoute_(routes, r, initialUrl), undefined);
                    // console.log('absolute');
                }
                if (routeSnapshot != null) {
                    currentRoute = routeSnapshot;
                    events$.next(new RoutesRecognized({ ...event, route: routeSnapshot }));
                } else {
                    events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
                }
            } else if (event instanceof RoutesRecognized) {
                // console.log('RoutesRecognized', event);
                events$.next(new GuardsCheckStart({ ...event }));
            } else if (event instanceof GuardsCheckStart) {
                events$.next(new ChildActivationStart({ ...event }));
            } else if (event instanceof ChildActivationStart) {
                events$.next(new ActivationStart({ ...event }));
            } else if (event instanceof ActivationStart) {
                events$.next(new GuardsCheckEnd({ ...event }));
            } else if (event instanceof GuardsCheckEnd) {
                events$.next(new ResolveStart({ ...event }));
            } else if (event instanceof ResolveStart) {
                events$.next(new ResolveEnd({ ...event }));
            } else if (event instanceof ResolveEnd) {
                events$.next(new ActivationEnd({ ...event }));
            } else if (event instanceof ActivationEnd) {
                events$.next(new ChildActivationEnd({ ...event }));
            } else if (event instanceof ChildActivationEnd) {
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
                route$.next(event.route);
            } else if (event instanceof NavigationCancel) {
                console.log('NavigationCancel', event);
            } else if (event instanceof NavigationError) {
                console.log('NavigationError', event);
            }
        }),
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
                let routeSnapshot: RouteSnapshot | undefined;
                const initialUrl: string = serializeUrl_(routerLink);
                const isRelative: boolean = initialUrl.indexOf('/') !== 0;
                if (isRelative && currentRoute && currentRoute.children?.length) {
                    routeSnapshot = currentRoute.children.reduce<RouteSnapshot | undefined>((p, r) => p || r.resolve(initialUrl), undefined);
                    if (routeSnapshot) {
                        currentRoute.childRoute = routeSnapshot;
                        routeSnapshot = currentRoute;
                    }
                    // console.log('relative', currentRoute, routeSnapshot, initialUrl);
                } else {
                    routeSnapshot = RouterService.routes.reduce<RouteSnapshot | undefined>((p, r) => p || r.resolve(initialUrl), undefined);
                    // console.log('absolute');
                }
                if (routeSnapshot != null) {
                    currentRoute = routeSnapshot;
                    RouterService.events$.next(new RoutesRecognized({ ...event, route: routeSnapshot }));
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