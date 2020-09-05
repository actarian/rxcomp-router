"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteSegment = void 0;
var RouteSegment = /** @class */ (function () {
    function RouteSegment(path, params) {
        if (params === void 0) { params = {}; }
        this.path = path;
        this.params = params;
    }
    return RouteSegment;
}());
exports.RouteSegment = RouteSegment;
