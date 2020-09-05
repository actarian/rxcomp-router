"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteSnapshot = void 0;
var rxjs_1 = require("rxjs");
var RouteSnapshot = /** @class */ (function () {
    function RouteSnapshot(options) {
        this.pathMatch = 'prefix';
        this.relative = true;
        this.data$ = new rxjs_1.ReplaySubject(1);
        this.params$ = new rxjs_1.ReplaySubject(1);
        this.queryParams$ = new rxjs_1.ReplaySubject(1);
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
    RouteSnapshot.prototype.next = function (snapshot) {
        this.childRoute = snapshot.childRoute;
        if (snapshot.childRoute) {
            snapshot.childRoute.parent = this;
        }
        var data = this.data = Object.assign({}, snapshot.data);
        this.data$.next(data);
        var params = this.params = Object.assign({}, snapshot.params);
        this.params$.next(params);
        var queryParams = this.queryParams = Object.assign({}, snapshot.queryParams);
        this.queryParams$.next(queryParams);
    };
    return RouteSnapshot;
}());
exports.RouteSnapshot = RouteSnapshot;
