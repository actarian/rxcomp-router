"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutePath = void 0;
var location_strategy_1 = require("../location/location.strategy");
var RoutePath = /** @class */ (function () {
    function RoutePath(url, routeSegments, snapshot, locationStrategy) {
        if (url === void 0) { url = ''; }
        if (routeSegments === void 0) { routeSegments = []; }
        this.prefix = '';
        this.path = '';
        this.query = '';
        this.search = '';
        this.hash = '';
        this.locationStrategy = locationStrategy || new location_strategy_1.LocationStrategy();
        this.url = url;
        this.routeSegments = routeSegments;
        this.route = snapshot;
    }
    Object.defineProperty(RoutePath.prototype, "url", {
        get: function () {
            return this.url_;
        },
        set: function (url) {
            if (this.url_ !== url) {
                this.locationStrategy.resolve(url, this);
                this.url_ = this.locationStrategy.serialize(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoutePath.prototype, "routeSegments", {
        get: function () {
            return this.routeSegments_;
        },
        set: function (routeSegments) {
            if (this.routeSegments_ !== routeSegments) {
                this.routeSegments_ = routeSegments;
                this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoutePath.prototype, "remainUrl", {
        get: function () {
            return this.query + this.hash;
        },
        enumerable: false,
        configurable: true
    });
    return RoutePath;
}());
exports.RoutePath = RoutePath;
