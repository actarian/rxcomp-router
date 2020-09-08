import { Observable } from "rxjs";
export declare function asObservable<T>(args: any[], callback: (...args: any[]) => Observable<T> | Promise<T> | (() => T) | T): Observable<T>;
export declare function isPromise<T>(object: any): object is Promise<T>;
