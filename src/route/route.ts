import { Component, Factory } from 'rxcomp';
import { Observable } from 'rxjs';
import { Data, RouteComponent, RouterKeyValue } from '../router.types';
import { ICanActivate, ICanActivateChild, ICanDeactivate, ICanLoad, mapCanActivate$_, mapCanActivateChild$_, mapCanDeactivate$_, mapCanLoad$_ } from './route-activators';
import { RouteSegment } from './route-segment';
import { RouteSnapshot } from './route-snapshot';

export type IRoutes = IRoute[];
export type Routes = Route[];

export interface INavigationExtras {
    relativeTo?: RouteSnapshot | null;
    queryParams?: RouterKeyValue; // Params | null;
    fragment?: string;
    preserveQueryParams?: boolean;
    queryParamsHandling?: any; // QueryParamsHandling | null;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: { [key: string]: any };
}

export interface IBaseRoute {
    path?: string;
    pathMatch?: 'prefix' | 'full';
    component?: typeof Component;
    // matcher?: UrlMatcher;
    matcher?: RegExp;
    redirectTo?: string;
    outlet?: string;
    children?: IRoutes | Routes;
    // children?: IRoute[];
    initialUrl?: string;
    urlAfterRedirects?: string;
    extractedUrl?: string;
    remainUrl?: string;
    // resolve?: ResolveData;
    // loadChildren?: LoadChildren;
    // runGuardsAndResolvers?: RunGuardsAndResolvers;
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

export class Route implements IBaseRoute {
    path!: string;
    pathMatch: 'prefix' | 'full' = 'prefix';
    component!: typeof Component; // import !!!
    matcher: RegExp;
    redirectTo?: string;
    segments: RouteSegment[];
    relative: boolean = true;
    children?: Routes;
    parent?: Route;
    snapshot?: RouteSnapshot;
    canDeactivate: ((component: Factory, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canLoad: ((route: RouteSnapshot, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivate: ((route: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivateChild: ((childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    constructor(options?: IRoute) {
        if (options) {
            Object.assign(this, options);
            this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(x => mapCanDeactivate$_<Component>(x)) : [];
            this.canLoad = options.canLoad ? options.canLoad.map(x => mapCanLoad$_(x)) : [];
            this.canActivate = options.canActivate ? options.canActivate.map(x => mapCanActivate$_(x)) : [];
            this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(x => mapCanActivateChild$_(x)) : [];
        }
        if (this.children) {
            this.children = this.children.map((iRoute: IBaseRoute) => {
                const route = new Route(iRoute);
                route.parent = this;
                return route;
            });
        }
        const segments: RouteSegment[] = [];
        if (this.path === '**') {
            segments.push(new RouteSegment(this.path));
            this.matcher = new RegExp('^.*$');
        } else {
            const matchers: string[] = [`^(\.\.\/|\.\/|\/\/|\/)?`];
            const regExp: RegExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
            const matches = this.path.matchAll(regExp);
            for (let match of matches) {
                const g1 = match[1];
                const g2 = match[2];
                const g3 = match[3];
                if (g1) {
                    this.relative = !(g1 === '//' || g1 === '/');
                } else if (g2) {
                    matchers.push(g2);
                    segments.push(new RouteSegment(g2));
                } else if (g3) {
                    matchers.push('(\/[^\/]+)');
                    const param: { [key: string]: any } = {};
                    param[g3] = null;
                    segments.push(new RouteSegment('', param));
                }
            }
            if (this.pathMatch === 'full') {
                matchers.push('$');
            }
            const regexp: string = matchers.join('');
            this.matcher = new RegExp(regexp);
        }
        this.segments = segments;
    }
}
