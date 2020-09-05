export class RouterEvent {
    constructor(options) {
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
}
// An event triggered when the Router parses the URL and the routes are recognized.
export class RoutesRecognized extends RouterEvent {
}
// An event triggered at the start of the Guard phase of routing.
export class GuardsCheckStart extends RouterEvent {
}
// An event triggered at the start of the child-activation part of the Resolve phase of routing.
export class ChildActivationStart extends RouterEvent {
}
// An event triggered at the start of the activation part of the Resolve phase of routing.
export class ActivationStart extends RouterEvent {
}
// An event triggered at the end of the Guard phase of routing.
export class GuardsCheckEnd extends RouterEvent {
}
// An event triggered at the the start of the Resolve phase of routing.
export class ResolveStart extends RouterEvent {
}
// An event triggered at the end of the Resolve phase of routing.
export class ResolveEnd extends RouterEvent {
}
// An event triggered at the end of the activation part of the Resolve phase of routing.
export class ActivationEnd extends RouterEvent {
}
// An event triggered at the end of the child-activation part of the Resolve phase of routing.
export class ChildActivationEnd extends RouterEvent {
}
// An event triggered before the Router lazy loads a route configuration.
export class RouteConfigLoadStart extends RouterEvent {
}
// An event triggered after a route has been lazy loaded.
export class RouteConfigLoadEnd extends RouterEvent {
}
// An event triggered when navigation ends successfully.
export class NavigationEnd extends RouterEvent {
}
// An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.
export class NavigationCancel extends RouterEvent {
}
// An event triggered when navigation fails due to an unexpected error.
export class NavigationError extends RouterEvent {
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
