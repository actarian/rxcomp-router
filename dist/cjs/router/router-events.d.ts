import { Route } from '../route/route';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouteComponent, RouterLink } from '../router.types';
export interface IRouterEvent {
    id?: number;
    routerLink?: RouterLink;
    url?: string;
    initialUrl?: any;
    urlAfterRedirects?: string;
    extractedUrl?: any;
    remainUrl?: string;
    finalUrl?: any;
    trigger?: 'imperative' | 'popstate' | 'hashchange';
    extras?: any;
    previousNavigation?: IRouterEvent | null;
    route?: Route | RouteSnapshot;
    reason?: string;
    redirectTo?: RouteComponent[];
    error?: any;
}
export declare class RouterEvent implements IRouterEvent {
    url: string;
    routerLink: RouterLink;
    trigger: 'imperative' | 'popstate' | 'hashchange';
    constructor(options?: IRouterEvent);
}
export declare class NavigationStart extends RouterEvent {
    navigationTrigger: 'imperative' | 'popstate' | 'hashchange';
    restoredState?: {
        [key: string]: any;
    };
}
export declare class RoutesRecognized extends RouterEvent {
    route: RouteSnapshot;
}
export declare class GuardsCheckStart extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ChildActivationStart extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ActivationStart extends RouterEvent {
    route: RouteSnapshot;
}
export declare class GuardsCheckEnd extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ResolveStart extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ResolveEnd extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ActivationEnd extends RouterEvent {
    route: RouteSnapshot;
}
export declare class ChildActivationEnd extends RouterEvent {
    route: RouteSnapshot;
}
export declare class RouteConfigLoadStart extends RouterEvent {
    route: RouteSnapshot;
    urlAfterRedirects: string;
}
export declare class RouteConfigLoadEnd extends RouterEvent {
    route: RouteSnapshot;
}
export declare class NavigationEnd extends RouterEvent {
    urlAfterRedirects: string;
    route: RouteSnapshot;
}
export declare class NavigationCancel extends RouterEvent {
    reason: string;
    redirectTo?: RouteComponent[];
}
export declare class NavigationError extends RouterEvent {
    error: any;
}
