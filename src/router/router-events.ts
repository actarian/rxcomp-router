import { Route } from '../route/route';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouteComponent, RouterLink } from '../router.types';

export interface IRouterEvent {
    id?: number;
    routerLink?: RouterLink;
    url?: string; // The target URL passed into the `Router#navigateByUrl()` call before navigation. This is the value before the router has parsed or applied redirects to it.
    initialUrl?: any; // string | UrlTree; // The initial target URL after being parsed with `UrlSerializer.extract()`.
    urlAfterRedirects?: string;
    extractedUrl?: any; // UrlTree; // The extracted URL after redirects have been applied.
    remainUrl?: string;
    finalUrl?: any; // UrlTree;
    trigger?: 'imperative' | 'popstate' | 'hashchange';
    extras?: any; // NavigationExtras;
    previousNavigation?: IRouterEvent | null;
    route?: Route | RouteSnapshot;
    reason?: string;
    redirectTo?: RouteComponent[];
    error?: any;
}

export class RouterEvent implements IRouterEvent {
    url!: string;
    routerLink!: RouterLink;
    trigger!: 'imperative' | 'popstate' | 'hashchange';
    constructor(options?: IRouterEvent) {
        if (options) {
            Object.assign(this, options);
        }
        if (this.routerLink) {
            this.url = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;
        }
    }
}

// An event triggered when navigation starts.
export class NavigationStart extends RouterEvent {
    navigationTrigger!: 'imperative' | 'popstate' | 'hashchange';
    restoredState?: { [key: string]: any };
}
// An event triggered when the Router parses the URL and the routes are recognized.
export class RoutesRecognized extends RouterEvent {
    route!: RouteSnapshot; // ???
    // state!: RouterStateSnapshot;
}

// An event triggered at the start of the Guard phase of routing.
export class GuardsCheckStart extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the start of the child-activation part of the Resolve phase of routing.
export class ChildActivationStart extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the start of the activation part of the Resolve phase of routing.
export class ActivationStart extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the end of the Guard phase of routing.
export class GuardsCheckEnd extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the the start of the Resolve phase of routing.
export class ResolveStart extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the end of the Resolve phase of routing.
export class ResolveEnd extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the end of the activation part of the Resolve phase of routing.
export class ActivationEnd extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered at the end of the child-activation part of the Resolve phase of routing.
export class ChildActivationEnd extends RouterEvent {
    route!: RouteSnapshot;
}

// An event triggered before the Router lazy loads a route configuration.
export class RouteConfigLoadStart extends RouterEvent {
    route!: RouteSnapshot;
    urlAfterRedirects!: string;
}
// An event triggered after a route has been lazy loaded.
export class RouteConfigLoadEnd extends RouterEvent {
    route!: RouteSnapshot;
}
// An event triggered when navigation ends successfully.
export class NavigationEnd extends RouterEvent {
    urlAfterRedirects!: string;
    route!: RouteSnapshot;
}
// An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.
export class NavigationCancel extends RouterEvent {
    reason!: string;
    redirectTo?: RouteComponent[];
}
// An event triggered when navigation fails due to an unexpected error.
export class NavigationError extends RouterEvent {
    error!: any;
}

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