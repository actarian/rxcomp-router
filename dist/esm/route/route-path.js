import { LocationStrategy } from '../location/location.strategy';
export class RoutePath {
    constructor(url = '', routeSegments = [], snapshot, locationStrategy) {
        this.prefix = '';
        this.path = '';
        this.query = '';
        this.search = '';
        this.hash = '';
        this.locationStrategy = locationStrategy || new LocationStrategy();
        this.url = url;
        this.routeSegments = routeSegments;
        this.route = snapshot;
    }
    get url() {
        return this.url_;
    }
    set url(url) {
        if (this.url_ !== url) {
            this.locationStrategy.resolve(url, this);
            this.url_ = this.locationStrategy.serialize(this);
        }
    }
    get routeSegments() {
        return this.routeSegments_;
    }
    set routeSegments(routeSegments) {
        if (this.routeSegments_ !== routeSegments) {
            this.routeSegments_ = routeSegments;
            this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
        }
    }
    get remainUrl() {
        return this.query + this.hash;
    }
}
