import { ReplaySubject } from 'rxjs';
export class RouteSnapshot {
    constructor(options) {
        this.pathMatch = 'prefix';
        this.relative = true;
        this.data$ = new ReplaySubject(1);
        this.params$ = new ReplaySubject(1);
        this.queryParams$ = new ReplaySubject(1);
        this.canDeactivate = [];
        this.canLoad = [];
        this.canActivate = [];
        this.canActivateChild = [];
        if (options) {
            Object.assign(this, options);
        }
        this.data$.next(this.data);
        this.params$.next(this.params);
        this.queryParams$.next(this.queryParams);
    }
    next(snapshot) {
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
