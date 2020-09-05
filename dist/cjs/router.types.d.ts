import { Observable } from 'rxjs';
export declare enum RouteLocationStrategy {
    Path = "path",
    Hash = "hash"
}
export declare type RouteComponent = string | number | {
    [key: string]: any;
};
export declare type RouterLink = string | RouteComponent[];
export declare type RouterActivator = Observable<boolean> | (() => boolean) | boolean;
export declare type RouterActivatorResult = Observable<boolean | RouteComponent[]> | Promise<boolean | RouteComponent[]> | boolean | RouteComponent[];
export declare type RouterKeyValue = {
    [key: string]: RouterKeyValue | string | null;
};
export declare type Params = {
    [key: string]: any;
};
export declare type Data = {
    [key: string]: any;
};
