import { Observable, ReplaySubject } from 'rxjs';
import { ILocationStrategy, LocationStrategy } from '../location/location.strategy';
import { INavigationExtras, IRoutes, Route, Routes } from '../route/route';
import { RoutePath } from '../route/route-path';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouterLink } from '../router.types';
import { RouterEvent } from './router-events';
export default class RouterService {
    static routes: Routes;
    static route$: ReplaySubject<RouteSnapshot>;
    static events$: ReplaySubject<RouterEvent>;
    static observe$: Observable<RouterEvent>;
    static get flatRoutes(): Routes;
    static setRoutes(routes: IRoutes): RouterService;
    static makeObserve$(): Observable<RouterEvent>;
    static setRouterLink(routerLink: RouterLink, extras?: INavigationExtras): void;
    static navigate(routerLink: RouterLink, extras?: INavigationExtras): void;
    static findRoute(routerLink: RouterLink): Route | null;
    static findRouteByUrl(initialUrl: string): Route | null;
    static getPath(routerLink?: RouterLink): RoutePath;
    private static locationStrategy_;
    static get locationStrategy(): ILocationStrategy;
    static useLocationStrategy(locationStrategyFactory: typeof LocationStrategy): void;
}
