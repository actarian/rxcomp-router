import { Component, getContextByNode, isPlatformServer, WINDOW } from 'rxcomp';
import { combineLatest, EMPTY, fromEvent, merge, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ILocationStrategy, LocationStrategy, LocationStrategyPath } from '../location/location.strategy';
import { INavigationExtras, IRoute, IRoutes, Route, Routes } from '../route/route';
import { RoutePath } from '../route/route-path';
import { RouteSegment } from '../route/route-segment';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouteComponent, RouterKeyValue, RouterLink } from '../router.types';
import { ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, IRouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RouterEvent, RoutesRecognized } from './router-events';

export default class RouterService {
	static routes: Routes = [];
	static route$: ReplaySubject<RouteSnapshot> = new ReplaySubject<RouteSnapshot>(1);
	static events$: ReplaySubject<RouterEvent> = new ReplaySubject<RouterEvent>(1);
	static observe$: Observable<RouterEvent>;
	static get flatRoutes(): Routes {
		return getFlatRoutes_(this.routes);
	}
	static setRoutes(routes: IRoutes): RouterService {
		this.routes = routes.map((x: IRoute) => new Route(x));
		// this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
		this.observe$ = this.makeObserve$();
		return this;
	}
	static makeObserve$(): Observable<RouterEvent> {
		const routes: Routes = this.routes;
		const route$: ReplaySubject<RouteSnapshot> = this.route$;
		const events$: ReplaySubject<RouterEvent> = this.events$;
		const locationStrategy: ILocationStrategy = this.locationStrategy;
		let currentRoute: RouteSnapshot | undefined;
		let currentEvent: PopStateEvent | RouterEvent | undefined;
		// console.log('RouterService.WINDOW', WINDOW!!);
		const stateEvents$ = isPlatformServer ? EMPTY : fromEvent<PopStateEvent>(WINDOW, 'popstate').pipe(
			map((event: PopStateEvent) => {
				currentEvent = event;
				const routerLink: string = `${document.location.pathname}${document.location.search}${document.location.hash}`;
				/*
				// !!! state to snapshot
				const flatRoutes = getFlatRoutes_(routes);
				flatRoutes.forEach(r => r.snapshot = undefined);
				const snapshot: RouteSnapshot = locationStrategy.stateToSnapshot(flatRoutes, event.state) as RouteSnapshot;
				// console.log('LocationStrategy.stateToSnapshot snapshot', snapshot);
				// console.log('RouterService PopStateEvent', 'snapshot', snapshot, 'routes', flatRoutes.map(route => route.snapshot));
				return new NavigationEnd({ route: snapshot, routerLink, url: routerLink, trigger: 'popstate' });
				*/
				return new NavigationStart({ routerLink, trigger: 'popstate' });
			}),
			shareReplay(1),
		);
		return merge(stateEvents$, events$).pipe(
			switchMap((event: RouterEvent) => {
				currentEvent = event;
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
				currentEvent = event;
				// console.log('RouterEvent', event);
				if (event instanceof NavigationStart) {
					// console.log('NavigationStart', event.routerLink);
					const routerLink = event.routerLink;
					// console.log('routerLink', routerLink);
					let snapshot: RouteSnapshot | undefined;
					let initialUrl: string;
					const routePath: RoutePath = RouterService.getPath(routerLink);
					// console.log(routePath, routePath.url);
					initialUrl = routePath.url;
					// console.log('initialUrl', initialUrl);
					const isRelative: boolean = initialUrl.indexOf('/') !== 0;
					if (isRelative && currentRoute && currentRoute.children?.length) {
						snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl, currentRoute);
						if (snapshot) {
							currentRoute.childRoute = snapshot;
							snapshot.parent = currentRoute;
							snapshot = currentRoute;
						}
						// console.log('relative', currentRoute, snapshot, initialUrl);
					} else {
						snapshot = resolveRoutes_(routes, routes, initialUrl, currentRoute);
						// console.log('absolute');
					}
					if (snapshot) {
						// console.log('RouterService.makeObserve$_', 'NavigationStart', snapshot);
						currentRoute = snapshot;
						events$.next(new RoutesRecognized({ ...event, route: snapshot }));
					} else {
						events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
					}
				} else if (event instanceof RoutesRecognized) {
					// console.log('RoutesRecognized', event.route.component, event.route.initialUrl, event.route.extractedUrl, event.route.urlAfterRedirects);
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
					// console.log('NavigationEnd', event);
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
					// console.log('NavigationEnd', event.route.extractedUrl, event.route);
					clearRoutes_(routes, event.route);
					locationStrategy.pushState(extractedUrl, event.route, event.trigger === 'popstate');
					// pushState_(locationStrategy, extractedUrl, undefined, event.trigger === 'popstate');
					route$.next(event.route);
				} else if (event instanceof NavigationCancel) {
					// console.log('NavigationCancel', event.reason, event.redirectTo);
					if (event.redirectTo) {
						// const routePath: RoutePath = RouterService.getPath(event.redirectTo);
						events$.next(new NavigationStart({ routerLink: event.redirectTo, trigger: 'imperative' }));
					}
				} else if (event instanceof NavigationError) {
					console.warn('RouterService NavigationError', event.error);
				}
			}),
			catchError((error: Error) => of(new NavigationError({ ...(currentEvent || {}), error }))),
			shareReplay(1),
		);
	}
	static setRouterLink(routerLink: RouterLink, extras: INavigationExtras = { skipLocationChange: false }): void {
		// ['/hero', hero.id];
		// console.log('RouterService.setRouterLink', routerLink);
		this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
	}
	static navigate(routerLink: RouterLink, extras: INavigationExtras = { skipLocationChange: false }): void {
		// navigate(['items'], { relativeTo: this.route });
		// navigate(['/heroes', { id: heroId }]);
		// console.log('RouterService.navigate', routerLink);
		this.events$.next(new NavigationStart({ routerLink, trigger: 'imperative' }));
	}
	static findRoute(routerLink: RouterLink): Route | null {
		const initialUrl: string = this.locationStrategy.serializeLink(routerLink);
		return this.findRouteByUrl(initialUrl);
	}
	static findRouteByUrl(initialUrl: string): Route | null {
		const routes: Routes = getFlatRoutes_(this.routes);
		let resolvedRoute: Route | null = null;
		let lastMatcbesLength = Number.NEGATIVE_INFINITY;
		for (let route of routes) {
			const matches: RegExpMatchArray | null = initialUrl.match(route.matcher);
			if (matches && (!resolvedRoute || matches[0].length > lastMatcbesLength)) {
				lastMatcbesLength = matches[0].length;
				resolvedRoute = route;
			}
		}
		let urlAfterRedirects: string = initialUrl;
		if (resolvedRoute && resolvedRoute.redirectTo) {
			// const routePath: RoutePath = RouterService.getPath(resolvedRoute.redirectTo);
			// urlAfterRedirects = routePath.url;
			urlAfterRedirects = resolvedRoute.redirectTo;
			resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
		}
		// console.log('RouterService.findRouteByUrl', resolvedRoute);
		return resolvedRoute;
	}
	static getPath(routerLink: RouterLink = []): RoutePath {
		const lastPath: string = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(x => {
			return typeof x === 'string' ? x : this.locationStrategy.encodeParams(x);
		}).join('/');
		const segments: RouteSegment[] = [];
		const routes: (Route | RouteSnapshot)[] = [];
		const route: Route | null = this.findRouteByUrl(lastPath);
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
		let initialUrl: string = routes.map(r => r instanceof RouteSnapshot ? r.extractedUrl : r.path).join('/');
		initialUrl = this.locationStrategy.getPath(initialUrl);
		// console.log('RouterService.getPath', initialUrl);
		const routePath: RoutePath = new RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
		return routePath;
	}
	private static locationStrategy_: ILocationStrategy;
	static get locationStrategy(): ILocationStrategy {
		if (this.locationStrategy_) {
			return this.locationStrategy_;
		} else {
			return this.locationStrategy_ = new LocationStrategyPath();
		}
	}
	static useLocationStrategy(locationStrategyFactory: typeof LocationStrategy): void {
		this.locationStrategy_ = new locationStrategyFactory();
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
		}/* else {
			console.log(route);
		}*/
	});
}
function resolveRoutes_(routes: Routes, childRoutes: Routes, initialUrl: string, previousRoute?: RouteSnapshot): RouteSnapshot | undefined {
	let resolvedSnapshot: RouteSnapshot | undefined;
	for (let route of childRoutes) {
		const snapshot: RouteSnapshot | undefined = resolveRoute_(routes, route, initialUrl, previousRoute);
		if (snapshot) {
			if (resolvedSnapshot) {
				/*
				if (snapshot.remainUrl.length < resolvedSnapshot.remainUrl.length) {
					// console.log('RouterService.resolveRoutes_', snapshot.remainUrl.length, '<', resolvedSnapshot.remainUrl.length, snapshot.path, snapshot.remainUrl);
				}
				*/
				resolvedSnapshot = snapshot.remainUrl.length < resolvedSnapshot.remainUrl.length ? snapshot : resolvedSnapshot;
			} else {
				resolvedSnapshot = snapshot;
			}
		}
	}
	return resolvedSnapshot;
	// return childRoutes.reduce<RouteSnapshot | undefined>((p, route) => p || resolveRoute_(routes, route, initialUrl), undefined);
}
function resolveRoute_(routes: Routes, route: Route, initialUrl: string, previousRoute?: RouteSnapshot): RouteSnapshot | undefined {
	// console.log('resolveRoute_', initialUrl);
	let urlAfterRedirects!: string;
	let extractedUrl: string = '';
	let remainUrl: string = initialUrl;
	const match: RegExpMatchArray | null = initialUrl.match(route.matcher);
	// console.log('RouterService.resolveRoute_', route.matcher, match?.length, initialUrl, '=>', route.path);
	if (!match) {
		// console.log('RouterService.resolveRoute_', initialUrl, '=>', route.path);
		return undefined;
	}
	if (route.redirectTo) {
		// console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.redirectTo, match);
		const routePath: RoutePath = RouterService.getPath(route.redirectTo);
		return resolveRoutes_(routes, routes, routePath.url, previousRoute);
	}/* else {
		// console.log('RouterService.resolveRoute_', 'match', initialUrl, '=>', route.path, match);
	}*/
	extractedUrl = match[0];
	remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
	const routePath: RoutePath = new RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
	let params: RouterKeyValue = routePath.params;
	const snapshot: RouteSnapshot = new RouteSnapshot({ ...route, initialUrl, urlAfterRedirects, extractedUrl, remainUrl, params });
	snapshot.previousRoute = previousRoute;
	route.snapshot = snapshot;
	if (snapshot && snapshot.remainUrl.length && route.children?.length) {
		const childSnapshot: RouteSnapshot | undefined = resolveRoutes_(routes, route.children, snapshot.remainUrl, previousRoute);
		snapshot.childRoute = childSnapshot;
		if (childSnapshot) {
			childSnapshot.parent = snapshot;
			snapshot.remainUrl = childSnapshot.remainUrl;
		}
	}
	// console.log('RouterService.resolveRoute_', snapshot.path, snapshot.extractedUrl, snapshot.remainUrl);
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
					const routePath: RoutePath = RouterService.getPath(canActivate);
					cancelEvent.redirectTo = [routePath.url];
				}
				return new NavigationCancel(cancelEvent);
			}
		})
	);
}
function makeCanDeactivateResponse$_(events$: ReplaySubject<RouterEvent>, event: GuardsCheckStart, currentRoute?: RouteSnapshot): Observable<RouterEvent> {
	// console.log('makeCanDeactivateResponse$_', event);
	if (event.route.canDeactivate && event.route.canDeactivate.length) {
		const route: RouteSnapshot = event.route;
		const instance: Component = getContextByNode(event.route.element!)!.instance;
		return makeActivatorResponse$_(event, route.canDeactivate.map(x => x(instance, currentRoute!)));
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
