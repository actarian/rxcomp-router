import { RouterKeyValue } from '../router.types';

export class RouteSegment {
	path: string;
	params: any;
	constructor(path: string, params: RouterKeyValue = {}) {
		this.path = path;
		this.params = params;
	}
    /*
    toString(): string {
        return `${encodeSegment_(this.path)}${encodeParams_(this.params)}`;
    }
    */
}
/*
export function encodeParams_(params: RouterKeyValue): string {
    // !!! array?
    return Object.keys(params).map(key => `;${encodeSegment_(key)}=${typeof params[key] === 'string' ? encodeSegment_(params[key] as string) : encodeParams_(params[key] as RouterKeyValue)}`).join('');
}
export function encodeSegment_(s: string): string {
    return encodeString_(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
export function encodeString_(s: string): string {
    return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
export function decodeParams_(encodedParams: string): RouterKeyValue {
    const params: RouterKeyValue = {} as RouterKeyValue;
    const keyValues = encodedParams.split(';');
    keyValues.forEach((x: string) => {
        const kvs: string[] = x.split('=');
        if (kvs.length === 2) {
            params[kvs[0]] = kvs[1];
        }
    });
    return params;
}
export function decodeParams__<T>(encoded: string | null = null): T | null {
    let decoded = null;
    if (encoded) {
        try {
            const json = window.atob(encoded);
            decoded = JSON.parse(json) as T;
        } catch (error) {
            console.log('decodeParam_.error', error);
        }
    }
    return decoded;
}
export function encodeParams__(value: any): string | null {
    let encoded = null;
    try {
        const json = JSON.stringify(value);
        encoded = window.btoa(json);
    } catch (error) {
        console.log('encodeParam__.error', error);
    }
    return encoded;
}
export function resolveParams__(url: string, routeSegments: RouteSegment[]): RouterKeyValue {
    // console.log('resolveParams__.resolvedRoute.routeSegments', routeSegments);
    const path: string = url.split('?')[0];
    const query: string = url.substring(path.length, url.length);
    const search: string = query.split('#')[0];
    const hash: string = query.substring(search.length, query.length);
    const segments: string[] = path.split('/').filter(x => x !== '');
    const params: RouterKeyValue = {};
    routeSegments.forEach((segment: RouteSegment, index: number) => {
        // console.log('segment.params', segment.params);
        const keys: string[] = Object.keys(segment.params);
        if (keys.length) {
            params[keys[0]] = decodeParams_(segments[index]);
        }
    });
    return params;
}
*/
