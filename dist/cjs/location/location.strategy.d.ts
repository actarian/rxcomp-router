import { IRoutePath } from '../route/route-path';
import { RouterLink } from '../router.types';
import { RouteSegment } from '../rxcomp-router';
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
    setHistory(url: string, params?: URLSearchParams, popped?: boolean): void;
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
    setHistory(url: string, params?: URLSearchParams, popped?: boolean): void;
}
export declare function encodeParam(value: string): string;
export declare function decodeParam(value: string): string;
export declare class LocationStrategyPath extends LocationStrategy implements ILocationStrategy {
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target?: IRoutePath): IRoutePath;
}
export declare class LocationStrategyHash extends LocationStrategy implements ILocationStrategy {
    serializeLink(routerLink: RouterLink): string;
    serializeUrl(url: string): string;
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target?: IRoutePath): IRoutePath;
    getPath(url: string): string;
    getUrl(url: string, params?: URLSearchParams): string;
}
