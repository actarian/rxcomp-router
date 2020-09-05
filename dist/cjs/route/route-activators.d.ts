import { Observable } from 'rxjs';
import { RouteComponent, RouterActivatorResult } from '../router.types';
import { RouteSegment } from './route-segment';
import { RouteSnapshot } from './route-snapshot';
export interface ICanDeactivate<T> {
    canDeactivate(component: T, currentRoute: RouteSnapshot): RouterActivatorResult;
}
export interface ICanLoad {
    canLoad(route: RouteSnapshot, segments: RouteSegment[]): RouterActivatorResult;
}
export interface ICanActivate {
    canActivate(route: RouteSnapshot): RouterActivatorResult;
}
export interface ICanActivateChild {
    canActivateChild(childRoute: RouteSnapshot): RouterActivatorResult;
}
export declare function mapCanDeactivate$_<T>(activator: ICanDeactivate<T>): (component: T, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>;
export declare function mapCanLoad$_(activator: ICanLoad): (route: RouteSnapshot, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]>;
export declare function mapCanActivate$_(activator: ICanActivate): (route: RouteSnapshot) => Observable<boolean | RouteComponent[]>;
export declare function mapCanActivateChild$_(activator: ICanActivateChild): (childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]>;
export declare function isPromise<T>(object: any): object is Promise<T>;
