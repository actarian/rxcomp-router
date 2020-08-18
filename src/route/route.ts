import { Component, Factory } from 'rxcomp';
import { Observable } from 'rxjs';
import { Data, RouteComponent, RouterKeyValue, RouterLink } from '../router.types';
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
    canDeactivate: ((component: Factory, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canLoad: ((route: Route, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>)[] = [];
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
            this.children = this.children.map((route: IBaseRoute) => {
                return new Route(route);
            });
        }
        const segments: RouteSegment[] = [];
        if (this.path === '**') {
            segments.push(new RouteSegment(this.path));
            this.matcher = new RegExp('^.*$');
        } else {
            const matchers: string[] = ['^(^\.\.\/|\.\/|\/\/|\/)?'];
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

export function serializeUrl_(routerLink: RouterLink): string {
    const segments: any[] = Array.isArray(routerLink) ? routerLink : [routerLink];
    return segments.join('/');
}

/*
function isCanActivate(object: any): object is ICanActivate {
    return 'canActivate' in object;
}
function isCanActivateChild(object: any): object is ICanActivate {
    return 'canActivateChild' in object;
}
function isCanDeactivate(object: any): object is ICanActivate {
    return 'canDeactivate' in object;
}
function isCanLoad(object: any): object is ICanActivate {
    return 'canLoad' in object;
}

function mapActivators__(options: IRoute, key: 'canActivate' | 'canActivateChild' | 'canDeactivate' | 'canLoad'): Observable<boolean | RouteComponent[]>[] {
    const activators: ICanActivate[] | ICanActivateChild[] | ICanDeactivate<Component>[] | ICanLoad[] | undefined = options[key];
    if (activators) {
        return activators.map<Observable<boolean | RouteComponent[]>>((activator: ICanActivate | ICanActivateChild | ICanDeactivate<Component> | ICanLoad) => {
            return Observable.create(function (observer: Observer<boolean | RouteComponent[]>) {
                try {
                    let result: boolean | RouteComponent[] = false;
                    if (isCanActivate(activator)) {
                        result = activator.canActivate(route);
                    }
                    observer.next(result);
                    observer.complete();
                } catch (error) {
                    observer.error(error);
                }
            });
            if (isObservable(x)) {
                return x;
            } else if (typeof x === 'function') {
                return Observable.create((function (observer: Observer<boolean>) {
                    try {
                        const result: boolean = x();
                        observer.next(result);
                        observer.complete();
                    } catch (error) {
                        observer.error(error);
                    }
                }))
            } else if (typeof x === 'boolean') {
                return of(x);
            }
        });
    } else {
        return [];
    }
}

function mapActivators_(activators?: RouterActivator[]): Observable<boolean | RouteComponent[]>[] {
    if (activators) {
        return activators.map<Observable<boolean>>((x: RouterActivator) => {
            if (isObservable(x)) {
                return x;
            } else if (typeof x === 'function') {
                return Observable.create((function (observer: Observer<boolean>) {
                    try {
                        const result: boolean = x();
                        observer.next(result);
                        observer.complete();
                    } catch (error) {
                        observer.error(error);
                    }
                }))
            } else if (typeof x === 'boolean') {
                return of(x);
            }
        });
    } else {
        return [];
    }
}
*/

/*
resolve(initialUrl: string): RouteSnapshot | undefined {
    let urlAfterRedirects!: string;
    let extractedUrl: string = '';
    let remainUrl: string = initialUrl;
    let route: Route | undefined;
    const match: RegExpMatchArray | null = initialUrl.match(this.matcher);
    // console.log('match', initialUrl, match, this.matcher);
    if (match !== null) {
        extractedUrl = match[0];
        remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
        route = this;
    }
    while (route && route.redirectTo) {
        urlAfterRedirects = route.redirectTo;
        initialUrl = serializeUrl_(route.redirectTo);
        remainUrl = initialUrl;
        route = RouterService.routes.find(route => {
            const match: RegExpMatchArray | null = initialUrl.match(route.matcher);
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
    if (route) {
        // console.log('initialUrl', initialUrl);
        // console.log('remainUrl', remainUrl);
        const values: string[] = extractedUrl.split('/').filter(x => x !== '');
        const params: RouterKeyValue = {};
        route.segments.forEach((segment: RouteSegment, index: number) => {
            const keys: string[] = Object.keys(segment.params);
            if (keys.length) {
                params[keys[0]] = values[index];
            }
        });
        // console.log('Route.resolve', params);
        // console.log('Route.resolve', extractedUrl.split('/').filter(x => x !== ''), route.segments.map(x => x.toString()).join('/'));
        const routeSnapshot: RouteSnapshot = new RouteSnapshot({ ...route, initialUrl, urlAfterRedirects, extractedUrl, remainUrl, params });
        if (remainUrl.length && this.children) {
            routeSnapshot.childRoute = this.children.map(x => x.resolve(remainUrl)).find(x => x != null);
        }
        // console.log('RouteSnapshot', routeSnapshot.path, routeSnapshot.extractedUrl, routeSnapshot.remainUrl);
        return routeSnapshot;
    } else {
        return undefined;
    }
}
*/

/*
function serializeUrl_(routerLink: IRouterLink, currentRoute?: RouteSnapshot): string {
    const segments: any[] = Array.isArray(routerLink) ? routerLink : [routerLink];
    const isAbsolute: boolean = segments[0].indexOf('/') === 0;
    if (!isAbsolute && currentRoute) {
        segments.unshift(currentRoute.extractedUrl);
        // console.log('currentRoute', currentRoute);
    }
    const url = segments.join('/');
    // console.log(url, segments);
    return url;
}
*/