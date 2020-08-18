import { BrowserPlatformLocation, PlatformLocation } from './location';

export abstract class LocationStrategy {
    abstract path(includeHash?: boolean): string;
    abstract prepareExternalUrl(internal: string): string;
    abstract pushState(state: any, title: string, url: string, queryParams: string): void;
    abstract replaceState(state: any, title: string, url: string, queryParams: string): void;
    abstract forward(): void;
    abstract back(): void;
    abstract onPopState(fn: any): void;
    // abstract onPopState(fn: LocationChangeListener): void;
    abstract getBaseHref(): string;
}

export class PathLocationStrategy extends LocationStrategy {
    private location_: PlatformLocation = new BrowserPlatformLocation();
    private _baseHref: string;
    constructor(href?: string) {
        super();
        if (href == null) {
            href = this.location_.getBaseHrefFromDOM();
        }
        if (href == null) {
            throw new Error(`No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.`);
        }
        this._baseHref = href;
    }
    onPopState(fn: any): void {
        // onPopState(fn: LocationChangeListener): void {
        this.location_.onPopState(fn);
        this.location_.onHashChange(fn);
    }
    getBaseHref(): string {
        return this._baseHref;
    }
    prepareExternalUrl(internal: string): string {
        return joinWithSlash(this._baseHref, internal);
    }
    path(includeHash: boolean = false): string {
        const pathname = this.location_.pathname + normalizeQueryParams(this.location_.search);
        const hash = this.location_.hash;
        return hash && includeHash ? `${pathname}${hash}` : pathname;
    }
    pushState(state: any, title: string, url: string, queryParams: string) {
        const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
        this.location_.pushState(state, title, externalUrl);
    }
    replaceState(state: any, title: string, url: string, queryParams: string) {
        const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
        this.location_.replaceState(state, title, externalUrl);
    }
    forward(): void {
        this.location_.forward();
    }
    back(): void {
        this.location_.back();
    }
}

export class HashLocationStrategy extends LocationStrategy {
    private _baseHref: string = '';
    constructor() {
        super();
    }
    // onPopState(fn: LocationChangeListener): void {
    onPopState(fn: any): void {
        this.onPopState(fn);
        this.onHashChange(fn);
    }
    getBaseHref(): string {
        return this._baseHref;
    }
    path(includeHash: boolean = false): string {
        let path = this.hash;
        if (path == null) path = '#';
        return path.length > 0 ? path.substring(1) : path;
    }
    prepareExternalUrl(internal: string): string {
        const url = joinWithSlash(this._baseHref, internal);
        return url.length > 0 ? ('#' + url) : url;
    }
    pushState(state: any, title: string, path: string, queryParams: string) {
        let url: string | null = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this.pathname;
        }
        this.pushState(state, title, url);
    }
    replaceState(state: any, title: string, path: string, queryParams: string) {
        let url = this.prepareExternalUrl(path + normalizeQueryParams(queryParams));
        if (url.length == 0) {
            url = this.pathname;
        }
        this.replaceState(state, title, url);
    }
    forward(): void {
        this.forward();
    }
    back(): void {
        this.back();
    }
}