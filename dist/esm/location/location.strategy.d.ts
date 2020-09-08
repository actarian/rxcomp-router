import { Routes } from '../route/route';
import { IRoutePath } from '../route/route-path';
import { RouteSegment } from '../route/route-segment';
import { RouteSnapshot } from '../route/route-snapshot';
import { RouterLink } from '../router.types';
export interface ILocationStrategy {
    serializeLink(routerLink: RouterLink): string;
    serializeUrl(url: string): string;
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target: IRoutePath): IRoutePath;
    resolveParams(path: string, routeSegments: RouteSegment[]): {
        [key: string]: any;
    };
    encodeParams(value: any): string;
    decodeParams(encoded: string): any;
    encodeSegment(s: string): string;
    decodeSegment(s: string): string;
    encodeString(s: string): string;
    decodeString(s: string): string;
    getPath(url: string): string;
    getUrl(url: string, params?: URLSearchParams): string;
    pushState(url: string, snapshot: RouteSnapshot, popped?: boolean): void;
    historyRequired(): boolean;
    snapshotToState(snapshot: RouteSnapshot, pool: RouteSnapshot[]): {
        [key: string]: any;
    } | string | undefined;
    stateToSnapshot(routes: Routes, state?: any): RouteSnapshot | undefined;
}
export declare class LocationStrategy implements ILocationStrategy {
    serializeLink(routerLink: RouterLink): string;
    serializeUrl(url: string): string;
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target?: IRoutePath): IRoutePath;
    resolveParams(path: string, routeSegments: RouteSegment[]): {
        [key: string]: any;
    };
    encodeParams(value: any): string;
    decodeParams(value: string): any;
    encodeSegment(value: string): string;
    decodeSegment(value: string): string;
    encodeString(value: string): string;
    decodeString(value: string): string;
    getPath(url: string): string;
    getUrl(url: string, params?: URLSearchParams): string;
    pushState(url: string, snapshot: RouteSnapshot, popped?: boolean): void;
    snapshotToState(snapshot?: RouteSnapshot, pool?: RouteSnapshot[]): {
        [key: string]: any;
    } | string | undefined;
    stateToSnapshot(routes: Routes, state?: any, pool?: RouteSnapshot[]): RouteSnapshot | undefined;
    historyRequired(): boolean;
    static historySupported(): boolean;
}
export declare class LocationStrategyPath extends LocationStrategy implements ILocationStrategy {
}
export declare class LocationStrategyHash extends LocationStrategy implements ILocationStrategy {
    serializeLink(routerLink: RouterLink): string;
    serializeUrl(url: string): string;
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target?: IRoutePath): IRoutePath;
    getPath(url: string): string;
    getUrl(url: string, params?: URLSearchParams): string;
    historyRequired(): boolean;
}
export declare function encodeParam(value: string): string;
export declare function decodeParam(value: string): string;
