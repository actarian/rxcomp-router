import { Observable } from 'rxjs';

export enum RouteLocationStrategy {
	Path = 'path',
	Hash = 'hash',
}
export type RouteComponent = string | number | { [key: string]: any; };
export type RouterLink = string | RouteComponent[];
export type RouterActivator = Observable<boolean> | (() => boolean) | boolean;
export type RouterActivatorResult = Observable<boolean | RouteComponent[]> | Promise<boolean | RouteComponent[]> | boolean | RouteComponent[];
export type RouterKeyValue = { [key: string]: RouterKeyValue | string | null };
export type Params = { [key: string]: any; };
export type Data = { [key: string]: any; };
