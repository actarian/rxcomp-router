import { isPlatformBrowser } from "rxcomp";
import { IRoutePath } from "../route/route-path";
import { RouterKeyValue, RouterLink } from "../router.types";
import { RouteSegment } from "../rxcomp-router";

export interface ILocationStrategy {
    serializeLink(routerLink: RouterLink): string;
    serializeUrl(url: string): string;
    serialize(routePath: IRoutePath): string;
    resolve(url: string, target: IRoutePath): IRoutePath;
    resolveParams(path: string, routeSegments: RouteSegment[]): { [key: string]: any };
    decodeParams(encoded: string | null): any | null;
    encodeParams(value: any): string | null;
    decodeSegment(s: string): string;
    encodeSegment(s: string): string;
    decodeString(s: string): string;
    encodeString(s: string): string;
    getPath(url: string): string;
    getUrl(url: string, params?: URLSearchParams): string;
    setHistory(url: string, params?: URLSearchParams, popped?: boolean): void;
}

export class LocationStrategy implements ILocationStrategy {
    serializeLink(routerLink: RouterLink): string {
        const url: string = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(x => {
            return typeof x === 'string' ? x : this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
    }
    serializeUrl(url: string): string {
        return url;
    }
    serialize(routePath: IRoutePath): string {
        return `${routePath.prefix}${routePath.path}${routePath.search}${routePath.hash}`;
    }
    resolve(url: string, target: IRoutePath = {}): IRoutePath {
        let prefix: string = '';
        let path: string = '';
        let query: string = '';
        let search: string = '';
        let hash: string = '';
        let segments: string[];
        let params: { [key: string]: any };
        const regExp: RegExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        const matches = url.matchAll(regExp);
        for (let match of matches) {
            const g1 = match[1];
            const g2 = match[2];
            const g3 = match[3];
            if (g1) {
                path = g1;
            }
            if (g2) {
                query = g2;
            }
            if (g3) {
                hash = g3;
            }
        }
        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(x => x !== '');
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);
        return target;
    }
    resolveParams(path: string, routeSegments: RouteSegment[]): { [key: string]: any } {
        const segments: string[] = path.split('/').filter(x => x !== '');
        const params: RouterKeyValue = {};
        routeSegments.forEach((segment: RouteSegment, index: number) => {
            // console.log('segment.params', segment.params);
            const keys: string[] = Object.keys(segment.params);
            if (keys.length) {
                params[keys[0]] = this.decodeParams(segments[index]);
            }
        });
        return params;
    }
    decodeParams(encoded: string | null = null): any | null {
        let decoded: any | null = encoded;
        if (encoded) {
            if (encoded.indexOf(';') === 0) {
                try {
                    const json = window.atob(encoded.substring(1, encoded.length));
                    // const json = encoded;
                    decoded = JSON.parse(json);
                } catch (error) {
                    // console.log('decodeParam_.error', error);
                    decoded = encoded;
                }
            } else if (Number(encoded).toString() === encoded) {
                decoded = Number(encoded);
            }
        }
        return decoded;
    }
    encodeParams(value: any): string | null {
        let encoded: string | null = null;
        try {
            if (typeof value === 'object') {
                const json = JSON.stringify(value);
                encoded = ';' + window.btoa(json);
                // encoded = json;
            } else if (typeof value === 'number') {
                encoded = value.toString();
            }
        } catch (error) {
            console.log('encodeParam__.error', error);
        }
        return encoded;
    }
    decodeSegment(s: string): string {
        return this.decodeString(s.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
    }
    encodeSegment(s: string): string {
        return this.encodeString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
    }
    decodeString(s: string): string {
        return decodeURIComponent(s.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
    }
    encodeString(s: string): string {
        return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
    }
    getPath(url: string): string {
        return url;
    }
    getUrl(url: string, params?: URLSearchParams): string {
        return `${url}${params ? '?' + params.toString() : ''}`;
    }
    setHistory(url: string, params?: URLSearchParams, popped?: boolean): void {
        if (isPlatformBrowser && window.history && window.history.pushState) {
            const title = document.title;
            url = this.getUrl(url, params);
            // !!!
            // const state = params ? params.toString() : '';
            // console.log(state);
            if (popped) {
                window.history.replaceState(undefined, title, url);
            } else {
                window.history.pushState(undefined, title, url);
            }
        }
    }
}

export class LocationStrategyPath extends LocationStrategy implements ILocationStrategy {
    constructor() {
        super();
    }
    serialize(routePath: IRoutePath): string {
        return `${routePath.prefix}${routePath.path}${routePath.search}${routePath.hash}`;
    }
    resolve(url: string, target: IRoutePath = {}): IRoutePath {
        let prefix: string = '';
        let path: string = '';
        let query: string = '';
        let search: string = '';
        let hash: string = '';
        let segments: string[];
        let params: { [key: string]: any };
        const regExp: RegExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        const matches = url.matchAll(regExp);
        for (let match of matches) {
            const g1 = match[1];
            const g2 = match[2];
            const g3 = match[3];
            if (g1) {
                path = g1;
            }
            if (g2) {
                query = g2;
            }
            if (g3) {
                hash = g3;
            }
        }
        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(x => x !== '');
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);
        return target;
    }
}

export class LocationStrategyHash extends LocationStrategy implements ILocationStrategy {
    constructor() {
        super();
    }
    serializeLink(routerLink: RouterLink): string {
        const url: string = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(x => {
            return typeof x === 'string' ? x : this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
    }
    serializeUrl(url: string): string {
        const path: IRoutePath = this.resolve(url, {});
        return this.serialize(path);
    }
    serialize(routePath: IRoutePath): string {
        return `${routePath.prefix}${routePath.search}${routePath.hash}${routePath.path}`;
    }
    resolve(url: string, target: IRoutePath = {}): IRoutePath {
        let prefix: string = '';
        let path: string = '';
        let query: string = '';
        let search: string = '';
        let hash: string = '#';
        let segments: string[];
        let params: { [key: string]: any };
        const regExp: RegExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#.*)$/gm;
        const matches = url.matchAll(regExp);
        for (let match of matches) {
            const g1 = match[1];
            const g2 = match[2];
            const g3 = match[3];
            if (g1) {
                prefix = g1;
            }
            if (g2) {
                query = g2;
            }
            if (g3) {
                path = g3;
            }
        }
        prefix = prefix;
        path = path.substring(1, path.length);
        hash = hash;
        search = query.substring(1, query.length);
        segments = path.split('/').filter(x => x !== '');
        params = {};
        target.prefix = prefix;
        target.path = path;
        target.query = query;
        target.hash = hash;
        target.search = search;
        target.segments = segments;
        target.params = params;
        // console.log('resolvePath_', url, prefix, path, query, search, hash, segments, params);
        return target;
    }
    getPath(url: string): string {
        if (url.indexOf(`/#`) === -1) {
            return `/#${url}`;
        } else {
            return url;
        }
    }
    getUrl(url: string, params?: URLSearchParams): string {
        return `${params ? '?' + params.toString() : ''}${this.getPath(url)}`;
    }
}
