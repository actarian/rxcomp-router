import { ILocationStrategy, LocationStrategy } from '../location/location.strategy';
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
		if (this.url_ !== url) {
			this.locationStrategy.resolve(url, this);
			this.url_ = this.locationStrategy.serialize(this);
		}
	}
	private routeSegments_!: RouteSegment[];
	get routeSegments(): RouteSegment[] {
		return this.routeSegments_;
	}
	set routeSegments(routeSegments: RouteSegment[]) {
		if (this.routeSegments_ !== routeSegments) {
			this.routeSegments_ = routeSegments;
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
}
