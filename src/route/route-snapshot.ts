import { Component, Factory } from 'rxcomp';
import { Observable, ReplaySubject } from 'rxjs';
import { RouteComponent, RouterKeyValue } from '../router.types';
import { IBaseRoute, Route } from './route';
import { RouteSegment } from './route-segment';

export class RouteSnapshot implements IBaseRoute {
    path!: string;
    pathMatch: 'prefix' | 'full' = 'prefix';
    component!: typeof Component; // import !!!
    redirectTo?: string;
    segments!: RouteSegment[];
    relative: boolean = true;
    children?: Route[];
    childRoute?: RouteSnapshot;
    parent?: RouteSnapshot | undefined;
    initialUrl?: string;
    urlAfterRedirects?: string;
    extractedUrl?: string;
    remainUrl?: string;
    data!: RouterKeyValue;
    params!: RouterKeyValue;
    queryParams!: RouterKeyValue;
    data$: ReplaySubject<RouterKeyValue> = new ReplaySubject<RouterKeyValue>(1);
    params$: ReplaySubject<RouterKeyValue> = new ReplaySubject<RouterKeyValue>(1);
    queryParams$: ReplaySubject<RouterKeyValue> = new ReplaySubject<RouterKeyValue>(1);
    canDeactivate: ((component: Factory, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canLoad: ((route: Route, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivate: ((route: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivateChild: ((childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    constructor(options?: IBaseRoute) {
        if (options) {
            Object.assign(this, options);
        }
        this.data$.next(this.data);
        this.params$.next(this.params);
        this.queryParams$.next(this.queryParams);
        /*
        if (this.children) {
            this.children = this.children.map((route: IRoute) => {
                return new RouteSnapshot(route);
            });
        }
        */
    }
    next(routeSnapshot: RouteSnapshot): void {
        const data = this.data = Object.assign({}, routeSnapshot.data);
        this.data$.next(data);
        const params = this.params = Object.assign({}, routeSnapshot.params);
        this.params$.next(params);
        const queryParams = this.queryParams = Object.assign({}, routeSnapshot.queryParams);
        this.queryParams$.next(queryParams);
    }
}