
export type UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => UrlMatchResult | null;
export type UrlMatchResult = { consumed: UrlSegment[]; posParams?: { [key: string]: UrlSegment; }; };

export type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface ParamMap {
    has(name: string): boolean;
    get(name: string): string | null;
    getAll(name: string): string[];
    readonly keys: string[];
}

class ParamsAsMap implements ParamMap {
    private params: Params;
    constructor(params: Params) {
        this.params = params || {};
    }
    has(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.params, name);
    }
    get(name: string): string | null {
        if (this.has(name)) {
            const param = this.params[name];
            return Array.isArray(param) ? param[0] : param;
        }
        return null;
    }
    getAll(name: string): string[] {
        if (this.has(name)) {
            const param = this.params[name];
            return Array.isArray(param) ? param : [param];
        }
        return [];
    }
    get keys(): string[] {
        return Object.keys(this.params);
    }
}

export function convertToParamMap(params: Params): ParamMap {
    return new ParamsAsMap(params);
}

export class UrlSegment {
    path: string;
    params: any;
    parameterMap: any;
    constructor(path: string, params: KeyValue) {
        this.path = path;
        this.params = params;
    }
    toString(): string {
        return `${encodeUriSegment(this.path)}${serializeMatrixParams(this.params)}`;
    }
}

export class UrlSegmentGroup {
    parent: UrlSegmentGroup | null = null;
    segments: UrlSegment[];
    children: { [key: string]: UrlSegmentGroup; };
    numberOfChildren: number = 0;
    constructor(segments: UrlSegment[], children: { [key: string]: UrlSegmentGroup; }) {
        this.segments = segments;
        this.children = children;
    }
    hasChildren(): boolean { return false }
    toString(): string { return '' }
}

export class UrlParser {
    private remaining: string;
    constructor(private url: string) {
        this.remaining = url;
    }
    parseRootSegment(): UrlSegmentGroup {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
            return new UrlSegmentGroup([], {});
        }
        return new UrlSegmentGroup([], this.parseChildren());
    }
    parseQueryParams(): Params {
        const params: Params = {};
        if (this.consumeOptional('?')) {
            do {
                this.parseQueryParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    }
    parseFragment(): string | null {
        return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
    }
    private parseChildren(): { [outlet: string]: UrlSegmentGroup } {
        if (this.remaining === '') {
            return {};
        }
        this.consumeOptional('/');
        const segments: UrlSegment[] = [];
        if (!this.peekStartsWith('(')) {
            segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            segments.push(this.parseSegment());
        }
        let children: { [outlet: string]: UrlSegmentGroup } = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        let res: { [outlet: string]: UrlSegmentGroup } = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
            res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
    }
    private parseSegment(): UrlSegment {
        const path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error(`Empty path url segment cannot have parameters: '${this.remaining}'.`);
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
    }
    private parseMatrixParams(): { [key: string]: any } {
        const params: { [key: string]: any } = {};
        while (this.consumeOptional(';')) {
            this.parseParam(params);
        }
        return params;
    }
    private parseParam(params: { [key: string]: any }): void {
        const key = matchSegments(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let value: any = '';
        if (this.consumeOptional('=')) {
            const valueMatch = matchSegments(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decode(key)] = decode(value);
    }
    private parseQueryParam(params: Params): void {
        const key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let value: any = '';
        if (this.consumeOptional('=')) {
            const valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        const decodedKey = decodeQuery(key);
        const decodedVal = decodeQuery(value);
        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            let currentVal = params[decodedKey];
            if (!Array.isArray(currentVal)) {
                currentVal = [currentVal];
                params[decodedKey] = currentVal;
            }
            currentVal.push(decodedVal);
        } else {
            // Create a new value
            params[decodedKey] = decodedVal;
        }
    }
    private parseParens(allowPrimary: boolean): { [outlet: string]: UrlSegmentGroup } {
        const segments: { [key: string]: UrlSegmentGroup } = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
            const path = matchSegments(this.remaining);
            const next = this.remaining[path.length];
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error(`Cannot parse url '${this.url}'`);
            }
            let outletName: string = undefined!;
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            } else if (allowPrimary) {
                outletName = PRIMARY_OUTLET;
            }
            const children = this.parseChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                new UrlSegmentGroup([], children);
            this.consumeOptional('//');
        }
        return segments;
    }
    private peekStartsWith(str: string): boolean {
        return this.remaining.startsWith(str);
    }
    private consumeOptional(str: string): boolean {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    }
    private capture(str: string): void {
        if (!this.consumeOptional(str)) {
            throw new Error(`Expected "${str}".`);
        }
    }
}

export function serializeMatrixParams(params: KeyValue): string {
    return Object.keys(params).map(key => `;${encodeUriSegment(key)}=${encodeUriSegment(params[key])}`).join('');
}

export function encodeUriSegment(s: string): string {
    return encodeUriString(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}

export function encodeUriString(s: string): string {
    return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}

/*
export interface IUrlSerializer {
    parse(url: string): UrlTree;
    serialize(tree: UrlTree): string;
}

export function createUrlTree(
    route: ActivatedRoute, urlTree: UrlTree, commands: any[], queryParams: Params,
    fragment: string): UrlTree {
    if (commands.length === 0) {
        return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
    }
    const nav = computeNavigation(commands);
    if (nav.toRoot()) {
        return tree(urlTree.root, new UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
    }
    const startingPosition = findStartingPosition(nav, urlTree, route);
    const segmentGroup = startingPosition.processChildren ?
        updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) :
        updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
    return tree(startingPosition.segmentGroup, segmentGroup, urlTree, queryParams, fragment);
}

export class DefaultUrlSerializer implements IUrlSerializer {
    static parse(url: string): UrlTree {
        const p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    }
    static serialize(tree: UrlTree): string {
        const segment = `/${serializeSegment(tree.root, true)}`;
        const query = serializeQueryParams(tree.queryParams);
        const fragment = typeof tree.fragment === `string` ? `#${encodeUriFragment(tree.fragment!)}` : '';
        return `${segment}${query}${fragment}`;
    }
}

export class UrlTree {
    _queryParamMap!: ParamMap;

    constructor(
        public root: UrlSegmentGroup,
        public queryParams: Params,
        public fragment: string | null
    ) { }

    get queryParamMap(): ParamMap {
        if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
        }
        return this._queryParamMap;
    }

    toString(): string {
        return DefaultUrlSerializer.serialize(this);
    }
}
*/

// loadChildren: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
// export type LoadChildren = () => Promise<typeof Module>;

export class ActivatedRoute {
    snapshot!: ActivatedRouteSnapshot;
    _futureSnapshot: ActivatedRouteSnapshot;
    _routerState!: RouterState;
    _paramMap!: Observable<ParamMap>;
    _queryParamMap!: Observable<ParamMap>;
    constructor(
        public url: Observable<UrlSegment[]>,
        public params: Observable<Params>,
        public queryParams: Observable<Params>,
        public fragment: Observable<string>,
        public data: Observable<Data>,
        public outlet: string,
        public component: Type<any> | string | null, futureSnapshot: ActivatedRouteSnapshot) {
        this._futureSnapshot = futureSnapshot;
    }
    get routeConfig(): Route | null {
        return this._futureSnapshot.routeConfig;
    }
    get root(): ActivatedRoute {
        return this._routerState.root;
    }
    get parent(): ActivatedRoute | null {
        return this._routerState.parent(this);
    }
    get firstChild(): ActivatedRoute | null {
        return this._routerState.firstChild(this);
    }
    get children(): ActivatedRoute[] {
        return this._routerState.children(this);
    }
    get pathFromRoot(): ActivatedRoute[] {
        return this._routerState.pathFromRoot(this);
    }
    get paramMap(): Observable<ParamMap> {
        if (!this._paramMap) {
            this._paramMap = this.params.pipe(map((p: Params): ParamMap => convertToParamMap(p)));
        }
        return this._paramMap;
    }
    get queryParamMap(): Observable<ParamMap> {
        if (!this._queryParamMap) {
            this._queryParamMap =
                this.queryParams.pipe(map((p: Params): ParamMap => convertToParamMap(p)));
        }
        return this._queryParamMap;
    }
    toString(): string {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
    }
}

/*
export interface INavigationExtras {
    relativeTo?: ActivatedRoute | null;
    queryParams?: Params | null;
    fragment?: string;
    preserveQueryParams?: boolean;
    queryParamsHandling?: QueryParamsHandling | null;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: { [key: string]: any };
}
*/

/*
private static makeObserve$____(): Observable<RouterEvent> {
    let currentRoute: RouteSnapshot | undefined;
    const stateEvents$ = merge(fromEvent<PopStateEvent>(window, 'popstate')).pipe(
        tap((event: PopStateEvent) => {
            console.log('location', document.location.pathname, 'state', event.state);
        }),
        map(event => new RouterEvent({ routerLink: document.location.pathname, trigger: 'popstate' })),
        shareReplay(1),
    );
    return merge(stateEvents$, RouterService.events$).pipe(
        tap((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                console.log('NavigationStart', event);
                const routerLink = event.routerLink;
                // console.log('routerLink', routerLink);
                const segments: any[] = Array.isArray(routerLink) ? routerLink : [routerLink];
                const isRelative: boolean = segments[0].indexOf('/') !== 0;
                if (isRelative && currentRoute) {
                    console.log('relative', currentRoute);
                } else {
                    console.log('absolute');
                }
                const initialUrl: string = RouterService.serializeUrl_(routerLink, currentRoute);
                const routeSnapshot: RouteSnapshot | null | undefined = RouterService.routes.map(route => route.resolve(initialUrl, currentRoute)).find(x => x !== null);
                if (routeSnapshot != null) {
                    currentRoute = routeSnapshot;
                    RouterService.events$.next(new RoutesRecognized({
                        ...event, route: currentRoute, initialUrl,
                        urlAfterRedirects: routeSnapshot.urlAfterRedirects,
                        extractedUrl: routeSnapshot.extractedUrl,
                        remainUrl: routeSnapshot.remainUrl
                    }));
                    console.log('currentRoute', currentRoute);
                } else {
                    RouterService.events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
                }
                // !!!
                if (false) {
                    let urlAfterRedirects!: string;
                    let extractedUrl: string = initialUrl;
                    let remainUrl: string = initialUrl;
                    let route: Route | undefined = this.routes.find(route => {
                        const match: RegExpMatchArray | null = initialUrl.match(route.matcher);
                        console.log('match', match);
                        if (match !== null) {
                            remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    console.log('remainUrl', remainUrl);
                    while (route && route.redirectTo) {
                        urlAfterRedirects = route.redirectTo;
                        extractedUrl = RouterService.serializeUrl_(route.redirectTo, currentRoute);
                        remainUrl = extractedUrl;
                        route = this.routes.find(route => {
                            const match: RegExpMatchArray | null = extractedUrl.match(route.matcher);
                            console.log('match', match);
                            if (match !== null) {
                                remainUrl = extractedUrl.substr(match[0].length, extractedUrl.length);
                                return true;
                            } else {
                                return false;
                            }
                        });
                    }
                    if (route) {
                        //
                        currentRoute = new RouteSnapshot({ ...route, initialUrl, urlAfterRedirects, extractedUrl, remainUrl });
                        //
                        RouterService.events$.next(new RoutesRecognized({ ...event, route: currentRoute, initialUrl, urlAfterRedirects, extractedUrl, remainUrl }));
                    } else {
                        RouterService.events$.next(new NavigationError({ ...event, error: new Error('unknown route') }));
                    }
                }
            } else if (event instanceof RoutesRecognized) {
                console.log('RoutesRecognized', event);
                RouterService.events$.next(new RouteConfigLoadStart({ ...event }));
            } else if (event instanceof RouteConfigLoadStart) {
                console.log('RouteConfigLoadStart', event);
                RouterService.events$.next(new RouteConfigLoadEnd({ ...event }));
            } else if (event instanceof RouteConfigLoadEnd) {
                console.log('RouteConfigLoadEnd', event);
                RouterService.events$.next(new NavigationEnd({ ...event }));
            } else if (event instanceof NavigationEnd) {
                console.log('NavigationEnd', event);
                this.setHistory(event.extractedUrl, undefined, event.trigger === 'popstate');
                RouterService.route$.next(event.route);
            } else if (event instanceof NavigationCancel) {
                console.log('NavigationCancel', event);
            } else if (event instanceof NavigationError) {
                console.log('NavigationError', event);
            }
        }),
        shareReplay(1),
    );
    return Observable.create(function (observer: Observer<RouterEvent>) {
        // observer.next(new RouterEvent());
        // observer.complete();
        // observer.error(new RouterErrorEvent());
    });
}
*/