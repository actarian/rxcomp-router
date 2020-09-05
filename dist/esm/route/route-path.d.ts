import { ILocationStrategy } from '../location/location.strategy';
import { Route } from './route';
import { RouteSegment } from './route-segment';
export interface IRoutePath {
    url?: string;
    prefix?: string;
    path?: string;
    query?: string;
    search?: any;
    hash?: any;
    params?: {
        [key: string]: any;
    };
    segments?: string[];
}
export declare class RoutePath implements IRoutePath {
    private url_;
    get url(): string;
    set url(url: string);
    private routeSegments_;
    get routeSegments(): RouteSegment[];
    set routeSegments(routeSegments: RouteSegment[]);
    get remainUrl(): string;
    prefix: string;
    path: string;
    query: string;
    search: string;
    hash: string;
    params: {
        [key: string]: any;
    };
    segments: string[];
    route?: Route;
    locationStrategy: ILocationStrategy;
    constructor(url?: string, routeSegments?: RouteSegment[], snapshot?: Route, locationStrategy?: ILocationStrategy);
}
