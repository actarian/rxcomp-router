import { DomAdapter } from './dom.adapter';

export abstract class PlatformLocation {
    abstract getBaseHrefFromDOM(): string;
    abstract getState(): unknown;
    abstract onPopState(fn: LocationChangeListener): void;
    abstract onHashChange(fn: LocationChangeListener): void;
    abstract get href(): string;
    abstract get protocol(): string;
    abstract get hostname(): string;
    abstract get port(): string;
    abstract get pathname(): string;
    abstract get search(): string;
    abstract get hash(): string;
    abstract replaceState(state: any, title: string, url: string): void;
    abstract pushState(state: any, title: string, url: string): void;
    abstract forward(): void;
    abstract back(): void;
}

export interface LocationChangeEvent {
    type: string;
    state: any;
}

export interface LocationChangeListener {
    (event: LocationChangeEvent): any;
}

export class BrowserPlatformLocation extends PlatformLocation {
    private dom_!: DomAdapter; // !!!
    private document_!: Document; // !!!
    private history_!: History;
    public readonly location!: Location;
    constructor() {
        super();
        (this as { location: Location }).location = this.dom_.getLocation();
        this.history_ = this.dom_.getHistory();
    }
    getBaseHrefFromDOM(): string {
        return this.dom_.getBaseHref(this.document_)!;
    }
    onPopState(fn: LocationChangeListener): void {
        this.dom_.getGlobalEventTarget(this.document_, 'window').addEventListener('popstate', fn, false);
    }
    onHashChange(fn: LocationChangeListener): void {
        this.dom_.getGlobalEventTarget(this.document_, 'window').addEventListener('hashchange', fn, false);
    }
    get href(): string {
        return this.location.href;
    }
    get protocol(): string {
        return this.location.protocol;
    }
    get hostname(): string {
        return this.location.hostname;
    }
    get port(): string {
        return this.location.port;
    }
    get pathname(): string {
        return this.location.pathname;
    }
    get search(): string {
        return this.location.search;
    }
    get hash(): string {
        return this.location.hash;
    }
    set pathname(newPath: string) {
        this.location.pathname = newPath;
    }
    pushState(state: any, title: string, url: string): void {
        if (supportsState()) {
            this.history_.pushState(state, title, url);
        } else {
            this.location.hash = url;
        }
    }
    replaceState(state: any, title: string, url: string): void {
        if (supportsState()) {
            this.history_.replaceState(state, title, url);
        } else {
            this.location.hash = url;
        }
    }
    forward(): void {
        this.history_.forward();
    }
    back(): void {
        this.history_.back();
    }
    getState(): unknown {
        return this.history_.state;
    }
}

export function supportsState(): boolean {
    return !!window.history.pushState;
}
