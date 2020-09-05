"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationStrategyHash = exports.LocationStrategyPath = exports.decodeParam = exports.encodeParam = exports.LocationStrategy = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var LocationStrategy = /** @class */ (function () {
    function LocationStrategy() {
    }
    LocationStrategy.prototype.serializeLink = function (routerLink) {
        var _this = this;
        var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
            return typeof x === 'string' ? x : _this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
    };
    LocationStrategy.prototype.serializeUrl = function (url) {
        return url;
    };
    LocationStrategy.prototype.serialize = function (routePath) {
        return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
    };
    LocationStrategy.prototype.resolve = function (url, target) {
        var e_1, _a;
        if (target === void 0) { target = {}; }
        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        var matches = url.matchAll(regExp);
        try {
            for (var matches_1 = tslib_1.__values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                var match = matches_1_1.value;
                var g1 = match[1];
                var g2 = match[2];
                var g3 = match[3];
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
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function (x) { return x !== ''; });
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
    };
    LocationStrategy.prototype.resolveParams = function (path, routeSegments) {
        var _this = this;
        var segments = path.split('/').filter(function (x) { return x !== ''; });
        var params = {};
        routeSegments.forEach(function (segment, index) {
            // console.log('segment.params', segment.params);
            var keys = Object.keys(segment.params);
            if (keys.length) {
                params[keys[0]] = _this.decodeParams(segments[index]);
            }
        });
        return params;
    };
    LocationStrategy.prototype.encodeParams = function (value) {
        var encoded;
        if (typeof value === 'object') {
            encoded = rxcomp_1.Serializer.encode(value, [rxcomp_1.encodeJson, rxcomp_1.encodeBase64, encodeParam]);
        }
        else if (typeof value === 'number') {
            encoded = value.toString();
        }
        return encoded;
    };
    LocationStrategy.prototype.decodeParams = function (value) {
        var decoded = value;
        if (value.indexOf(';') === 0) {
            try {
                decoded = rxcomp_1.Serializer.decode(value, [decodeParam, rxcomp_1.decodeBase64, rxcomp_1.decodeJson]);
            }
            catch (error) {
                decoded = value;
            }
        }
        else if (Number(value).toString() === value) {
            decoded = Number(value);
        }
        return decoded;
    };
    LocationStrategy.prototype.encodeSegment = function (value) {
        return this.encodeString(value).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
    };
    LocationStrategy.prototype.decodeSegment = function (value) {
        return this.decodeString(value.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
    };
    LocationStrategy.prototype.encodeString = function (value) {
        return encodeURIComponent(value).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
    };
    LocationStrategy.prototype.decodeString = function (value) {
        return decodeURIComponent(value.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
    };
    LocationStrategy.prototype.getPath = function (url) {
        return url;
    };
    LocationStrategy.prototype.getUrl = function (url, params) {
        return "" + url + (params ? '?' + params.toString() : '');
    };
    LocationStrategy.prototype.setHistory = function (url, params, popped) {
        if (rxcomp_1.isPlatformBrowser && typeof history !== 'undefined' && history.pushState) {
            var title = document.title;
            url = this.getUrl(url, params);
            // !!!
            // const state = params ? params.toString() : '';
            // console.log(state);
            if (popped) {
                history.replaceState(undefined, title, url);
            }
            else {
                history.pushState(undefined, title, url);
            }
        }
    };
    return LocationStrategy;
}());
exports.LocationStrategy = LocationStrategy;
function encodeParam(value) {
    return ";" + value;
}
exports.encodeParam = encodeParam;
function decodeParam(value) {
    return value.substring(1, value.length);
}
exports.decodeParam = decodeParam;
var LocationStrategyPath = /** @class */ (function (_super) {
    tslib_1.__extends(LocationStrategyPath, _super);
    function LocationStrategyPath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationStrategyPath.prototype.serialize = function (routePath) {
        return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
    };
    LocationStrategyPath.prototype.resolve = function (url, target) {
        var e_2, _a;
        if (target === void 0) { target = {}; }
        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
        var matches = url.matchAll(regExp);
        try {
            for (var matches_2 = tslib_1.__values(matches), matches_2_1 = matches_2.next(); !matches_2_1.done; matches_2_1 = matches_2.next()) {
                var match = matches_2_1.value;
                var g1 = match[1];
                var g2 = match[2];
                var g3 = match[3];
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
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (matches_2_1 && !matches_2_1.done && (_a = matches_2.return)) _a.call(matches_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        prefix = prefix;
        path = path;
        query = query;
        hash = hash.substring(1, hash.length);
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function (x) { return x !== ''; });
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
    };
    return LocationStrategyPath;
}(LocationStrategy));
exports.LocationStrategyPath = LocationStrategyPath;
var LocationStrategyHash = /** @class */ (function (_super) {
    tslib_1.__extends(LocationStrategyHash, _super);
    function LocationStrategyHash() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationStrategyHash.prototype.serializeLink = function (routerLink) {
        var _this = this;
        var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
            return typeof x === 'string' ? x : _this.encodeParams(x);
        }).join('/');
        return this.serializeUrl(url);
    };
    LocationStrategyHash.prototype.serializeUrl = function (url) {
        var path = this.resolve(url, {});
        return this.serialize(path);
    };
    LocationStrategyHash.prototype.serialize = function (routePath) {
        return "" + routePath.prefix + routePath.search + routePath.hash + routePath.path;
    };
    LocationStrategyHash.prototype.resolve = function (url, target) {
        var e_3, _a;
        if (target === void 0) { target = {}; }
        var prefix = '';
        var path = '';
        var query = '';
        var search = '';
        var hash = '#';
        var segments;
        var params;
        var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#.*)$/gm;
        var matches = url.matchAll(regExp);
        try {
            for (var matches_3 = tslib_1.__values(matches), matches_3_1 = matches_3.next(); !matches_3_1.done; matches_3_1 = matches_3.next()) {
                var match = matches_3_1.value;
                var g1 = match[1];
                var g2 = match[2];
                var g3 = match[3];
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
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (matches_3_1 && !matches_3_1.done && (_a = matches_3.return)) _a.call(matches_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        prefix = prefix;
        path = path.substring(1, path.length);
        hash = hash;
        search = query.substring(1, query.length);
        segments = path.split('/').filter(function (x) { return x !== ''; });
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
    };
    LocationStrategyHash.prototype.getPath = function (url) {
        if (url.indexOf("/#") === -1) {
            return "/#" + url;
        }
        else {
            return url;
        }
    };
    LocationStrategyHash.prototype.getUrl = function (url, params) {
        return "" + (params ? '?' + params.toString() : '') + this.getPath(url);
    };
    return LocationStrategyHash;
}(LocationStrategy));
exports.LocationStrategyHash = LocationStrategyHash;
