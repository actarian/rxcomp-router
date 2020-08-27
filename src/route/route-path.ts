import { encodeJson, Serializer } from 'rxcomp';
import { ILocationStrategy, LocationStrategy } from '../location/location.strategy';
import { RouterKeyValue } from '../router.types';
import { Route } from './route';
import { RouteSegment } from './route-segment';

export interface IRoutePath {
	url?: string;
	prefix?: string;
	path?: string;
	query?: string;
	search?: any;
	hash?: any;
	params?: { [key: string]: any };
	segments?: string[];
}

export class RoutePath implements IRoutePath {
	private url_!: string;
	get url(): string {
		return this.url_;
	}
	set url(url: string) {
		// console.log(this.url_, url);
		if (this.url_ !== url) {
			this.locationStrategy.resolve(url, this);
			// resolvePath_(url, this, this.locationStrategy);
			this.url_ = this.locationStrategy.serialize(this);
			// serializeUrl_(this, this.locationStrategy);
			// this.url_ = url; // !!! serialize url;
			// console.log('url_', this.url_);
		}
	}
	private routeSegments_!: RouteSegment[];
	get routeSegments(): RouteSegment[] {
		return this.routeSegments_;
	}
	set routeSegments(routeSegments: RouteSegment[]) {
		if (this.routeSegments_ !== routeSegments) {
			this.routeSegments_ = routeSegments;
			// !!! const path: string = this.locationStrategy === RouteLocationStrategy.Hash ? this.hash : this.path;
			// this.params = resolveParams_(this.path, routeSegments);
			this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
		}
	}
	get remainUrl(): string {
		return this.query + this.hash;
	}
	prefix: string = '';
	path: string = '';
	query: string = '';
	search: string = '';
	hash: string = '';
	params!: { [key: string]: any };
	segments!: string[];
	route?: Route;
	locationStrategy: ILocationStrategy;
	constructor(url: string = '', routeSegments: RouteSegment[] = [], snapshot?: Route, locationStrategy?: ILocationStrategy) {
		this.locationStrategy = locationStrategy || new LocationStrategy();
		this.url = url;
		this.routeSegments = routeSegments;
		this.route = snapshot;
	}
    /*
    toString(): string {
        return this.url_;
        // return `${encodeSegment_(this.path)}${encodeParams_(this.params)}`;
    }
    */
}

/*

export function serializeUrl_(target: IRoutePath, locationStrategy: ILocationStrategy): string {
    // return `${target.path!}${target.search}${target.hash}`;
    return locationStrategy.serialize(target);
}

// !!! todo: resolvePath_ in LocationStrategy interface

export function resolvePath_(url: string, target: IRoutePath = {}, locationStrategy: ILocationStrategy): IRoutePath {
    return locationStrategy.resolve(url, target);
}

export function resolveStrategyPath_(url: string, target: IRoutePath = {}): IRoutePath {
    let path: string = '';
    let query: string = '';
    let hash: string = '';
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
    target.path = path;
    target.query = query;
    target.hash = hash.substring(1, hash.length);
    target.search = query.substring(1, query.length);
    // let search: string = target.search = query.substring(1, query.length);
    // const path: string = target.path = url.split('?')[0];
    // const query: string = target.query = url.substring(path.length, url.length);
    // const search: string = target.search = query.split('#')[0];
    // const hash: string = target.hash = query.substring(search.length, query.length);
    target.segments = path.split('/').filter(x => x !== '');
    target.params = {};
    // console.log('resolvePath_', url, path, query, target.search, hash, target.segments, target.params);
    return target;
}
export function resolveStrategyHash_(url: string, target: IRoutePath = {}): IRoutePath {
    let path: string = '';
    let query: string = '';
    let hash: string = '';
    const regExp: RegExp = /^(\/)?(\?[^\#]*)?(\#.*)$/gm;
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
    target.path = path;
    target.query = query;
    target.hash = hash.substring(1, hash.length);
    target.search = query.substring(1, query.length);
    // let search: string = target.search = query.substring(1, query.length);
    // const path: string = target.path = url.split('?')[0];
    // const query: string = target.query = url.substring(path.length, url.length);
    // const search: string = target.search = query.split('#')[0];
    // const hash: string = target.hash = query.substring(search.length, query.length);
    target.segments = hash.split('/').filter(x => x !== '');
    target.params = {};
    // console.log('resolvePath_', url, path, query, search, hash, segments, params);
    return target;
}
*/

export function resolveParams_(path: string, routeSegments: RouteSegment[]): { [key: string]: any } {
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
export function decodeParams_(encoded: string | null = null): any | null {
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
export function encodeParams_(value: any): string | null {
	let encoded: string | null = null;
	try {
		if (typeof value === 'object') {
			// const json = JSON.stringify(value);
			const json = Serializer.encode<string>(value, [encodeJson]) || '';
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
export function decodeSegment_(s: string): string {
	return decodeString_(s.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
}
export function encodeSegment_(s: string): string {
	return encodeString_(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
export function decodeString_(s: string): string {
	return decodeURIComponent(s.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
}
export function encodeString_(s: string): string {
	return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
/*
export function encodeParams_(params: RouterKeyValue): string {
    // !!! array?
    return Object.keys(params).map(key => `;${encodeSegment_(key)}=${typeof params[key] === 'string' ? encodeSegment_(params[key] as string) : encodeParams_(params[key] as RouterKeyValue)}`).join('');
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
export function resolvePath___(url: string, routeSegments: RouteSegment[]): { path: string, search: string, hash: string, segments: any[] } {
    // console.log('resolvePath_.resolvedRoute.routeSegments', routeSegments);
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
    return { path, search, hash, segments };
}
*/
