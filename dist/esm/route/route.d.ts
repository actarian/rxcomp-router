import { Component, Factory } from 'rxcomp';
import { Observable } from 'rxjs';
import { Data, RouteComponent, RouterKeyValue } from '../router.types';
import { ICanActivate, ICanActivateChild, ICanDeactivate, ICanLoad } from './route-activators';
import { RouteSegment } from './route-segment';
import { RouteSnapshot } from './route-snapshot';
export declare type IRoutes = IRoute[];
export declare type Routes = Route[];
export interface INavigationExtras {
    relativeTo?: RouteSnapshot | null;
    queryParams?: RouterKeyValue;
    fragment?: string;
    preserveQueryParams?: boolean;
    queryParamsHandling?: any;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: {
        [key: string]: any;
    };
}
export interface IBaseRoute {
    path?: string;
    pathMatch?: 'prefix' | 'full';
    component?: typeof Component;
    matcher?: RegExp;
    outlet?: string;
    children?: IRoutes | Routes;
    initialUrl?: string;
    urlAfterRedirects?: string;
    extractedUrl?: string;
    remainUrl?: string;
    redirectTo?: string;
    data?: Data;
    params?: RouterKeyValue;
    queryParams?: RouterKeyValue;
}
export interface IRoute extends IBaseRoute {
    canActivate?: ICanActivate[];
    canActivateChild?: ICanActivateChild[];
    canDeactivate?: ICanDeactivate<Component>[];
    canLoad?: ICanLoad[];
}
export declare class Route implements IBaseRoute {
    path: string;
    pathMatch: 'prefix' | 'full';
    component: typeof Component;
    matcher: RegExp;
    redirectTo?: string;
    segments: RouteSegment[];
    relative: boolean;
    children?: Routes;
    parent?: Route;
    snapshot?: RouteSnapshot;
    canDeactivate: ((component: Factory, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[];
    canLoad: ((route: RouteSnapshot, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>)[];
    canActivate: ((route: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[];
    canActivateChild: ((childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[];
    constructor(options?: IRoute);
}
