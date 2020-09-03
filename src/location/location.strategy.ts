import { decodeBase64, decodeJson, encodeBase64, encodeJson, isPlatformBrowser, Serializer } from 'rxcomp';
import { IRoutePath } from '../route/route-path';
import { RouterKeyValue, RouterLink } from '../router.types';
import { RouteSegment } from '../rxcomp-router';

export interface ILocationStrategy {
	serializeLink(routerLink: RouterLink): string;
	serializeUrl(url: string): string;
	serialize(routePath: IRoutePath): string;
	resolve(url: string, target: IRoutePath): IRoutePath;
	resolveParams(path: string, routeSegments: RouteSegment[]): { [key: string]: any };
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
	encodeParams(value: any): string {
		let encoded!: string;
		if (typeof value === 'object') {
			encoded = Serializer.encode<string>(value, [encodeJson, encodeBase64, encodeParam]);
		} else if (typeof value === 'number') {
			encoded = value.toString();
		}
		return encoded;
	}
	decodeParams(value: string): any {
		let decoded: any = value;
		if (value.indexOf(';') === 0) {
			try {
				decoded = Serializer.decode<string>(value, [decodeParam, decodeBase64, decodeJson])
			} catch (error) {
				decoded = value;
			}
		} else if (Number(value).toString() === value) {
			decoded = Number(value);
		}
		return decoded;
	}
	encodeSegment(value: string): string {
		return this.encodeString(value).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
	}
	decodeSegment(value: string): string {
		return this.decodeString(value.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
	}
	encodeString(value: string): string {
		return encodeURIComponent(value).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
	}
	decodeString(value: string): string {
		return decodeURIComponent(value.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
	}
	getPath(url: string): string {
		return url;
	}
	getUrl(url: string, params?: URLSearchParams): string {
		return `${url}${params ? '?' + params.toString() : ''}`;
	}
	setHistory(url: string, params?: URLSearchParams, popped?: boolean): void {
		if (isPlatformBrowser && typeof history !== 'undefined' && history.pushState) {
			const title = document.title;
			url = this.getUrl(url, params);
			// !!!
			// const state = params ? params.toString() : '';
			// console.log(state);
			if (popped) {
				history.replaceState(undefined, title, url);
			} else {
				history.pushState(undefined, title, url);
			}
		}
	}
}
export function encodeParam(value: string): string {
	return `;${value}`;
}
export function decodeParam(value: string): string {
	return value.substring(1, value.length);
}
export class LocationStrategyPath extends LocationStrategy implements ILocationStrategy {
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
