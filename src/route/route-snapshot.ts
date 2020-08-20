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
    canLoad: ((route: RouteSnapshot, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivate: ((route: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    canActivateChild: ((childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>)[] = [];
    instance?: Component;
    constructor(options?: IBaseRoute) {
        if (options) {
            Object.assign(this, options);
        }
        this.data$.next(this.data);
        this.params$.next(this.params);
        this.queryParams$.next(this.queryParams);
    }
    next(snapshot: RouteSnapshot): void {
        this.childRoute = snapshot.childRoute;
        if (snapshot.childRoute) {
            snapshot.childRoute.parent = this;
        }
        const data = this.data = Object.assign({}, snapshot.data);
        this.data$.next(data);
        const params = this.params = Object.assign({}, snapshot.params);
        this.params$.next(params);
        const queryParams = this.queryParams = Object.assign({}, snapshot.queryParams);
        this.queryParams$.next(queryParams);
    }
}