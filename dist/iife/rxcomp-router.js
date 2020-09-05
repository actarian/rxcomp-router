/**
 * @license rxcomp-router v1.0.0-beta.17
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

this.rxcomp=this.rxcomp||{};this.rxcomp.router=(function(exports,rxcomp,rxjs,operators){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}var View = function (_Component) {
  _inheritsLoose(View, _Component);

  function View() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = View.prototype;

  _proto.onEnter = function onEnter(node) {
    return rxjs.of(true);
  };

  _proto.onExit = function onExit(node) {
    return rxjs.of(true);
  };

  return View;
}(rxcomp.Component);var LocationStrategy = function () {
  function LocationStrategy() {}

  var _proto = LocationStrategy.prototype;

  _proto.serializeLink = function serializeLink(routerLink) {
    var _this = this;

    var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this.encodeParams(x);
    }).join('/');
    return this.serializeUrl(url);
  };

  _proto.serializeUrl = function serializeUrl(url) {
    return url;
  };

  _proto.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
  };

  _proto.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
      var match = _step.value;
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

    prefix = prefix;
    path = path;
    query = query;
    hash = hash.substring(1, hash.length);
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params;
    return target;
  };

  _proto.resolveParams = function resolveParams(path, routeSegments) {
    var _this2 = this;

    var segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    var params = {};
    routeSegments.forEach(function (segment, index) {
      var keys = Object.keys(segment.params);

      if (keys.length) {
        params[keys[0]] = _this2.decodeParams(segments[index]);
      }
    });
    return params;
  };

  _proto.encodeParams = function encodeParams(value) {
    var encoded;

    if (typeof value === 'object') {
      encoded = rxcomp.Serializer.encode(value, [rxcomp.encodeJson, rxcomp.encodeBase64, encodeParam]);
    } else if (typeof value === 'number') {
      encoded = value.toString();
    }

    return encoded;
  };

  _proto.decodeParams = function decodeParams(value) {
    var decoded = value;

    if (value.indexOf(';') === 0) {
      try {
        decoded = rxcomp.Serializer.decode(value, [decodeParam, rxcomp.decodeBase64, rxcomp.decodeJson]);
      } catch (error) {
        decoded = value;
      }
    } else if (Number(value).toString() === value) {
      decoded = Number(value);
    }

    return decoded;
  };

  _proto.encodeSegment = function encodeSegment(value) {
    return this.encodeString(value).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
  };

  _proto.decodeSegment = function decodeSegment(value) {
    return this.decodeString(value.replace(/%28/g, '(').replace(/%29/g, ')').replace(/\&/gi, '%26'));
  };

  _proto.encodeString = function encodeString(value) {
    return encodeURIComponent(value).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
  };

  _proto.decodeString = function decodeString(value) {
    return decodeURIComponent(value.replace(/\@/g, '%40').replace(/\:/gi, '%3A').replace(/\$/g, '%24').replace(/\,/gi, '%2C'));
  };

  _proto.getPath = function getPath(url) {
    return url;
  };

  _proto.getUrl = function getUrl(url, params) {
    return "" + url + (params ? '?' + params.toString() : '');
  };

  _proto.setHistory = function setHistory(url, params, popped) {
    if (rxcomp.isPlatformBrowser && typeof history !== 'undefined' && history.pushState) {
      var title = document.title;
      url = this.getUrl(url, params);

      if (popped) {
        history.replaceState(undefined, title, url);
      } else {
        history.pushState(undefined, title, url);
      }
    }
  };

  return LocationStrategy;
}();
function encodeParam(value) {
  return ";" + value;
}
function decodeParam(value) {
  return value.substring(1, value.length);
}
var LocationStrategyPath = function (_LocationStrategy) {
  _inheritsLoose(LocationStrategyPath, _LocationStrategy);

  function LocationStrategyPath() {
    return _LocationStrategy.apply(this, arguments) || this;
  }

  var _proto2 = LocationStrategyPath.prototype;

  _proto2.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.path + routePath.search + routePath.hash;
  };

  _proto2.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#[^\#]*?)?$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator2 = _createForOfIteratorHelperLoose(matches), _step2; !(_step2 = _iterator2()).done;) {
      var match = _step2.value;
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

    prefix = prefix;
    path = path;
    query = query;
    hash = hash.substring(1, hash.length);
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params;
    return target;
  };

  return LocationStrategyPath;
}(LocationStrategy);
var LocationStrategyHash = function (_LocationStrategy2) {
  _inheritsLoose(LocationStrategyHash, _LocationStrategy2);

  function LocationStrategyHash() {
    return _LocationStrategy2.apply(this, arguments) || this;
  }

  var _proto3 = LocationStrategyHash.prototype;

  _proto3.serializeLink = function serializeLink(routerLink) {
    var _this3 = this;

    var url = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this3.encodeParams(x);
    }).join('/');
    return this.serializeUrl(url);
  };

  _proto3.serializeUrl = function serializeUrl(url) {
    var path = this.resolve(url, {});
    return this.serialize(path);
  };

  _proto3.serialize = function serialize(routePath) {
    return "" + routePath.prefix + routePath.search + routePath.hash + routePath.path;
  };

  _proto3.resolve = function resolve(url, target) {
    if (target === void 0) {
      target = {};
    }

    var prefix = '';
    var path = '';
    var query = '';
    var search = '';
    var hash = '#';
    var segments;
    var params;
    var regExp = /^([^\?|\#]*)?(\?[^\#]*)?(\#.*)$/gm;
    var matches = url.matchAll(regExp);

    for (var _iterator3 = _createForOfIteratorHelperLoose(matches), _step3; !(_step3 = _iterator3()).done;) {
      var match = _step3.value;
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

    prefix = prefix;
    path = path.substring(1, path.length);
    hash = hash;
    search = query.substring(1, query.length);
    segments = path.split('/').filter(function (x) {
      return x !== '';
    });
    params = {};
    target.prefix = prefix;
    target.path = path;
    target.query = query;
    target.hash = hash;
    target.search = search;
    target.segments = segments;
    target.params = params;
    return target;
  };

  _proto3.getPath = function getPath(url) {
    if (url.indexOf("/#") === -1) {
      return "/#" + url;
    } else {
      return url;
    }
  };

  _proto3.getUrl = function getUrl(url, params) {
    return "" + (params ? '?' + params.toString() : '') + this.getPath(url);
  };

  return LocationStrategyHash;
}(LocationStrategy);function mapCanDeactivate$_(activator) {
  return function canDeactivate$(component, currentRoute) {
    return makeObserver$_(function () {
      return activator.canDeactivate(component, currentRoute);
    });
  };
}
function mapCanLoad$_(activator) {
  return function canLoad$$(route, segments) {
    return makeObserver$_(function () {
      return activator.canLoad(route, segments);
    });
  };
}
function mapCanActivate$_(activator) {
  return function canActivate$(route) {
    return makeObserver$_(function () {
      return activator.canActivate(route);
    });
  };
}
function mapCanActivateChild$_(activator) {
  return function canActivateChild$(childRoute) {
    return makeObserver$_(function () {
      return activator.canActivateChild(childRoute);
    });
  };
}
function isPromise(object) {
  return object instanceof Promise || typeof object === 'object' && 'then' in object && typeof object['then'] === 'function';
}

function makeObserver$_(callback) {
  return rxjs.Observable.create(function (observer) {
    var subscription;

    try {
      var result = callback();

      if (rxjs.isObservable(result)) {
        subscription = result.subscribe(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (isPromise(result)) {
        result.then(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (typeof result === 'boolean' || Array.isArray(result)) {
        observer.next(result);
        observer.complete();
      } else {
        observer.error(new Error('invalid value'));
      }
    } catch (error) {
      observer.error(error);
    }

    return function () {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
}var RouteSegment = function RouteSegment(path, params) {
  if (params === void 0) {
    params = {};
  }

  this.path = path;
  this.params = params;
};var Route = function Route(options) {
  var _this = this;

  this.pathMatch = 'prefix';
  this.relative = true;
  this.canDeactivate = [];
  this.canLoad = [];
  this.canActivate = [];
  this.canActivateChild = [];

  if (options) {
    Object.assign(this, options);
    this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(function (x) {
      return mapCanDeactivate$_(x);
    }) : [];
    this.canLoad = options.canLoad ? options.canLoad.map(function (x) {
      return mapCanLoad$_(x);
    }) : [];
    this.canActivate = options.canActivate ? options.canActivate.map(function (x) {
      return mapCanActivate$_(x);
    }) : [];
    this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(function (x) {
      return mapCanActivateChild$_(x);
    }) : [];
  }

  if (this.children) {
    this.children = this.children.map(function (iRoute) {
      var route = new Route(iRoute);
      route.parent = _this;
      return route;
    });
  }

  var segments = [];

  if (this.path === '**') {
    segments.push(new RouteSegment(this.path));
    this.matcher = new RegExp('^.*$');
  } else {
    var matchers = ["^(../|./|//|/)?"];
    var regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
    var matches = this.path.matchAll(regExp);

    for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
      var match = _step.value;
      var g1 = match[1];
      var g2 = match[2];
      var g3 = match[3];

      if (g1) {
        this.relative = !(g1 === '//' || g1 === '/');
      } else if (g2) {
        matchers.push(g2);
        segments.push(new RouteSegment(g2));
      } else if (g3) {
        matchers.push('(\/[^\/]+)');
        var param = {};
        param[g3] = null;
        segments.push(new RouteSegment('', param));
      }
    }

    if (this.pathMatch === 'full') {
      matchers.push('$');
    }

    var regexp = matchers.join('');
    this.matcher = new RegExp(regexp);
  }

  this.segments = segments;
};var RoutePath = function () {
  function RoutePath(url, routeSegments, snapshot, locationStrategy) {
    if (url === void 0) {
      url = '';
    }

    if (routeSegments === void 0) {
      routeSegments = [];
    }

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

  _createClass(RoutePath, [{
    key: "url",
    get: function get() {
      return this.url_;
    },
    set: function set(url) {
      if (this.url_ !== url) {
        this.locationStrategy.resolve(url, this);
        this.url_ = this.locationStrategy.serialize(this);
      }
    }
  }, {
    key: "routeSegments",
    get: function get() {
      return this.routeSegments_;
    },
    set: function set(routeSegments) {
      if (this.routeSegments_ !== routeSegments) {
        this.routeSegments_ = routeSegments;
        this.params = this.locationStrategy.resolveParams(this.path, routeSegments);
      }
    }
  }, {
    key: "remainUrl",
    get: function get() {
      return this.query + this.hash;
    }
  }]);

  return RoutePath;
}();var RouteSnapshot = function () {
  function RouteSnapshot(options) {
    this.pathMatch = 'prefix';
    this.relative = true;
    this.data$ = new rxjs.ReplaySubject(1);
    this.params$ = new rxjs.ReplaySubject(1);
    this.queryParams$ = new rxjs.ReplaySubject(1);
    this.canDeactivate = [];
    this.canLoad = [];
    this.canActivate = [];
    this.canActivateChild = [];

    if (options) {
      Object.assign(this, options);
    }

    this.data$.next(this.data);
    this.params$.next(this.params);
    this.queryParams$.next(this.queryParams);
  }

  var _proto = RouteSnapshot.prototype;

  _proto.next = function next(snapshot) {
    this.childRoute = snapshot.childRoute;

    if (snapshot.childRoute) {
      snapshot.childRoute.parent = this;
    }

    var data = this.data = Object.assign({}, snapshot.data);
    this.data$.next(data);
    var params = this.params = Object.assign({}, snapshot.params);
    this.params$.next(params);
    var queryParams = this.queryParams = Object.assign({}, snapshot.queryParams);
    this.queryParams$.next(queryParams);
  };

  return RouteSnapshot;
}();var RouterEvent = function RouterEvent(options) {
  if (options) {
    Object.assign(this, options);
  }

  if (this.routerLink) {
    this.url = Array.isArray(this.routerLink) ? this.routerLink.join('') : this.routerLink;
  }
};
var NavigationStart = function (_RouterEvent) {
  _inheritsLoose(NavigationStart, _RouterEvent);

  function NavigationStart() {
    return _RouterEvent.apply(this, arguments) || this;
  }

  return NavigationStart;
}(RouterEvent);
var RoutesRecognized = function (_RouterEvent2) {
  _inheritsLoose(RoutesRecognized, _RouterEvent2);

  function RoutesRecognized() {
    return _RouterEvent2.apply(this, arguments) || this;
  }

  return RoutesRecognized;
}(RouterEvent);
var GuardsCheckStart = function (_RouterEvent3) {
  _inheritsLoose(GuardsCheckStart, _RouterEvent3);

  function GuardsCheckStart() {
    return _RouterEvent3.apply(this, arguments) || this;
  }

  return GuardsCheckStart;
}(RouterEvent);
var ChildActivationStart = function (_RouterEvent4) {
  _inheritsLoose(ChildActivationStart, _RouterEvent4);

  function ChildActivationStart() {
    return _RouterEvent4.apply(this, arguments) || this;
  }

  return ChildActivationStart;
}(RouterEvent);
var ActivationStart = function (_RouterEvent5) {
  _inheritsLoose(ActivationStart, _RouterEvent5);

  function ActivationStart() {
    return _RouterEvent5.apply(this, arguments) || this;
  }

  return ActivationStart;
}(RouterEvent);
var GuardsCheckEnd = function (_RouterEvent6) {
  _inheritsLoose(GuardsCheckEnd, _RouterEvent6);

  function GuardsCheckEnd() {
    return _RouterEvent6.apply(this, arguments) || this;
  }

  return GuardsCheckEnd;
}(RouterEvent);
var ResolveStart = function (_RouterEvent7) {
  _inheritsLoose(ResolveStart, _RouterEvent7);

  function ResolveStart() {
    return _RouterEvent7.apply(this, arguments) || this;
  }

  return ResolveStart;
}(RouterEvent);
var ResolveEnd = function (_RouterEvent8) {
  _inheritsLoose(ResolveEnd, _RouterEvent8);

  function ResolveEnd() {
    return _RouterEvent8.apply(this, arguments) || this;
  }

  return ResolveEnd;
}(RouterEvent);
var ActivationEnd = function (_RouterEvent9) {
  _inheritsLoose(ActivationEnd, _RouterEvent9);

  function ActivationEnd() {
    return _RouterEvent9.apply(this, arguments) || this;
  }

  return ActivationEnd;
}(RouterEvent);
var ChildActivationEnd = function (_RouterEvent10) {
  _inheritsLoose(ChildActivationEnd, _RouterEvent10);

  function ChildActivationEnd() {
    return _RouterEvent10.apply(this, arguments) || this;
  }

  return ChildActivationEnd;
}(RouterEvent);
var RouteConfigLoadStart = function (_RouterEvent11) {
  _inheritsLoose(RouteConfigLoadStart, _RouterEvent11);

  function RouteConfigLoadStart() {
    return _RouterEvent11.apply(this, arguments) || this;
  }

  return RouteConfigLoadStart;
}(RouterEvent);
var RouteConfigLoadEnd = function (_RouterEvent12) {
  _inheritsLoose(RouteConfigLoadEnd, _RouterEvent12);

  function RouteConfigLoadEnd() {
    return _RouterEvent12.apply(this, arguments) || this;
  }

  return RouteConfigLoadEnd;
}(RouterEvent);
var NavigationEnd = function (_RouterEvent13) {
  _inheritsLoose(NavigationEnd, _RouterEvent13);

  function NavigationEnd() {
    return _RouterEvent13.apply(this, arguments) || this;
  }

  return NavigationEnd;
}(RouterEvent);
var NavigationCancel = function (_RouterEvent14) {
  _inheritsLoose(NavigationCancel, _RouterEvent14);

  function NavigationCancel() {
    return _RouterEvent14.apply(this, arguments) || this;
  }

  return NavigationCancel;
}(RouterEvent);
var NavigationError = function (_RouterEvent15) {
  _inheritsLoose(NavigationError, _RouterEvent15);

  function NavigationError() {
    return _RouterEvent15.apply(this, arguments) || this;
  }

  return NavigationError;
}(RouterEvent);var RouterService = function () {
  function RouterService() {}

  RouterService.setRoutes = function setRoutes(routes) {
    this.routes = routes.map(function (x) {
      return new Route(x);
    });
    this.observe$ = makeObserve$_(this.routes, this.route$, this.events$, this.locationStrategy);
    return this;
  };

  RouterService.setRouterLink = function setRouterLink(routerLink, extras) {

    this.events$.next(new NavigationStart({
      routerLink: routerLink,
      trigger: 'imperative'
    }));
  };

  RouterService.navigate = function navigate(routerLink, extras) {

    this.events$.next(new NavigationStart({
      routerLink: routerLink,
      trigger: 'imperative'
    }));
  };

  RouterService.findRoute = function findRoute(routerLink) {
    var initialUrl = this.locationStrategy.serializeLink(routerLink);
    return this.findRouteByUrl(initialUrl);
  };

  RouterService.findRouteByUrl = function findRouteByUrl(initialUrl) {
    var routes = getFlatRoutes_(this.routes);
    var resolvedRoute = null;
    var lastMatcbesLength = Number.NEGATIVE_INFINITY;

    for (var _iterator = _createForOfIteratorHelperLoose(routes), _step; !(_step = _iterator()).done;) {
      var route = _step.value;
      var matches = initialUrl.match(route.matcher);

      if (matches && (!resolvedRoute || matches[0].length > lastMatcbesLength)) {
        lastMatcbesLength = matches[0].length;
        resolvedRoute = route;
      }
    }

    var urlAfterRedirects = initialUrl;

    if (resolvedRoute && resolvedRoute.redirectTo) {
      urlAfterRedirects = resolvedRoute.redirectTo;
      resolvedRoute = this.findRouteByUrl(urlAfterRedirects);
    }

    return resolvedRoute;
  };

  RouterService.getPath = function getPath(routerLink) {
    var _this = this;

    if (routerLink === void 0) {
      routerLink = [];
    }

    var lastPath = (Array.isArray(routerLink) ? routerLink : [routerLink]).map(function (x) {
      return typeof x === 'string' ? x : _this.locationStrategy.encodeParams(x);
    }).join('/');
    var segments = [];
    var routes = [];
    var route = this.findRouteByUrl(lastPath);

    if (route) {
      var r = route == null ? void 0 : route.parent;

      while (r) {
        segments.unshift.apply(segments, r.segments);
        routes.unshift(r instanceof RouteSnapshot ? r : r.snapshot || r);
        r = r.parent;
      }

      segments.push.apply(segments, (route == null ? void 0 : route.segments) || []);
      routes.push({
        path: lastPath
      });
    }

    var initialUrl = routes.map(function (r) {
      return r instanceof RouteSnapshot ? r.extractedUrl : r.path;
    }).join('/');
    initialUrl = this.locationStrategy.getPath(initialUrl);
    var routePath = new RoutePath(initialUrl, segments, route || undefined, this.locationStrategy);
    return routePath;
  };

  RouterService.useLocationStrategy = function useLocationStrategy(locationStrategyType) {
    this.locationStrategy_ = new locationStrategyType();
  };

  _createClass(RouterService, null, [{
    key: "flatRoutes",
    get: function get() {
      return getFlatRoutes_(this.routes);
    }
  }, {
    key: "locationStrategy",
    get: function get() {
      if (this.locationStrategy_) {
        return this.locationStrategy_;
      } else {
        return this.locationStrategy_ = new LocationStrategyPath();
      }
    }
  }]);

  return RouterService;
}();
RouterService.routes = [];
RouterService.route$ = new rxjs.ReplaySubject(1);
RouterService.events$ = new rxjs.ReplaySubject(1);

function getFlatRoutes_(routes) {
  var reduceRoutes = function reduceRoutes(routes) {
    return routes.reduce(function (p, c) {
      p.push(c);
      p.push.apply(p, reduceRoutes(c.children || []));
      return p;
    }, []);
  };

  return reduceRoutes(routes);
}

function getFlatSnapshots_(currentSnapshot) {
  var snapshots = [currentSnapshot];
  var childRoute = currentSnapshot.childRoute;

  while (childRoute) {
    snapshots.push(childRoute);
    childRoute = childRoute.childRoute;
  }

  return snapshots;
}

function clearRoutes_(routes, currentSnapshot) {
  var snapshots = getFlatSnapshots_(currentSnapshot);
  var flatRoutes = getFlatRoutes_(routes);
  flatRoutes.forEach(function (route) {
    if (route.snapshot && snapshots.indexOf(route.snapshot) === -1) {
      route.snapshot = undefined;
    }
  });
}

function resolveRoutes_(routes, childRoutes, initialUrl) {
  var resolvedSnapshot;

  for (var _iterator2 = _createForOfIteratorHelperLoose(childRoutes), _step2; !(_step2 = _iterator2()).done;) {
    var route = _step2.value;
    var snapshot = resolveRoute_(routes, route, initialUrl);

    if (snapshot) {
      if (resolvedSnapshot) {
        resolvedSnapshot = snapshot.remainUrl.length < resolvedSnapshot.remainUrl.length ? snapshot : resolvedSnapshot;
      } else {
        resolvedSnapshot = snapshot;
      }
    }
  }

  return resolvedSnapshot;
}

function resolveRoute_(routes, route, initialUrl) {
  var _route$children;

  var urlAfterRedirects;
  var extractedUrl = '';
  var remainUrl = initialUrl;
  var match = initialUrl.match(route.matcher);

  if (!match) {
    return undefined;
  }

  if (route.redirectTo) {
    var _routePath = RouterService.getPath(route.redirectTo);

    return resolveRoutes_(routes, routes, _routePath.url);
  }

  extractedUrl = match[0];
  remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
  var routePath = new RoutePath(extractedUrl, route.segments, undefined, RouterService.locationStrategy);
  var params = routePath.params;
  var snapshot = new RouteSnapshot(_objectSpread2(_objectSpread2({}, route), {}, {
    initialUrl: initialUrl,
    urlAfterRedirects: urlAfterRedirects,
    extractedUrl: extractedUrl,
    remainUrl: remainUrl,
    params: params
  }));
  route.snapshot = snapshot;

  if (snapshot && snapshot.remainUrl.length && ((_route$children = route.children) == null ? void 0 : _route$children.length)) {
    var childSnapshot = resolveRoutes_(routes, route.children, snapshot.remainUrl);
    snapshot.childRoute = childSnapshot;

    if (childSnapshot) {
      childSnapshot.parent = snapshot;
      snapshot.remainUrl = childSnapshot.remainUrl;
    }
  }

  return snapshot;
}

function makeActivatorResponse$_(event, activators) {
  return rxjs.combineLatest.apply(void 0, activators).pipe(operators.map(function (values) {
    var canActivate = values.reduce(function (p, c) {
      return p === true ? c === true ? true : c : p;
    }, true);

    if (canActivate === true) {
      return event;
    } else {
      var cancelEvent = _objectSpread2(_objectSpread2({}, event), {}, {
        reason: 'An activation guard has dismissed navigation to the route.'
      });

      if (canActivate !== false) {
        var routePath = RouterService.getPath(canActivate);
        cancelEvent.redirectTo = [routePath.url];
      }

      return new NavigationCancel(cancelEvent);
    }
  }));
}

function makeCanDeactivateResponse$_(events$, event, currentRoute) {
  if (event.route.canDeactivate && event.route.canDeactivate.length) {
    var route = event.route;
    var instance = rxcomp.getContextByNode(event.route.element).instance;
    return makeActivatorResponse$_(event, route.canDeactivate.map(function (x) {
      return x(instance, currentRoute);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeCanLoadResponse$_(events$, event) {
  if (event.route.canLoad && event.route.canLoad.length) {
    var route = event.route;
    return makeActivatorResponse$_(event, route.canLoad.map(function (x) {
      return x(route, route.segments);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeCanActivateChildResponse$_(events$, event) {
  var reduceChildRouteActivators_ = function reduceChildRouteActivators_(route, activators) {
    while (route != null && route.canActivateChild && route.canActivateChild.length && route.childRoute) {
      var routeActivators = route.canActivateChild.map(function (x) {
        return x(route.childRoute);
      });
      Array.prototype.push.apply(activators, routeActivators);
      route = route.childRoute;
    }

    return activators;
  };

  var activators = reduceChildRouteActivators_(event.route, []);

  if (activators.length) {
    return makeActivatorResponse$_(event, activators);
  } else {
    return rxjs.of(event);
  }
}

function makeCanActivateResponse$_(events$, event) {
  if (event.route.canActivate && event.route.canActivate.length) {
    var route = event.route;
    return makeActivatorResponse$_(event, route.canActivate.map(function (x) {
      return x(route);
    }));
  } else {
    return rxjs.of(event);
  }
}

function makeObserve$_(routes, route$, events$, locationStrategy) {
  var currentRoute;
  var stateEvents$ = rxcomp.isPlatformServer ? rxjs.EMPTY : rxjs.merge(rxjs.fromEvent(rxcomp.WINDOW, 'popstate')).pipe(operators.map(function (event) {
    return new NavigationStart({
      routerLink: document.location.pathname,
      trigger: 'popstate'
    });
  }), operators.shareReplay(1));
  return rxjs.merge(stateEvents$, events$).pipe(operators.switchMap(function (event) {
    if (event instanceof GuardsCheckStart) {
      return makeCanDeactivateResponse$_(events$, event, currentRoute).pipe(operators.switchMap(function (nextEvent) {
        if (nextEvent instanceof NavigationCancel) {
          return rxjs.of(nextEvent);
        } else {
          return makeCanLoadResponse$_(events$, event).pipe(operators.switchMap(function (nextEvent) {
            if (nextEvent instanceof NavigationCancel) {
              return rxjs.of(nextEvent);
            } else {
              return makeCanActivateChildResponse$_(events$, event);
            }
          }));
        }
      }));
    } else if (event instanceof ChildActivationStart) {
      return makeCanActivateResponse$_(events$, event);
    } else {
      return rxjs.of(event);
    }
  }), operators.tap(function (event) {
    if (event instanceof NavigationStart) {
      var _currentRoute$childre;

      var routerLink = event.routerLink;
      var snapshot;
      var initialUrl;
      var routePath = RouterService.getPath(routerLink);
      initialUrl = routePath.url;
      var isRelative = initialUrl.indexOf('/') !== 0;

      if (isRelative && currentRoute && ((_currentRoute$childre = currentRoute.children) == null ? void 0 : _currentRoute$childre.length)) {
        snapshot = resolveRoutes_(routes, currentRoute.children, initialUrl);

        if (snapshot) {
          currentRoute.childRoute = snapshot;
          snapshot.parent = currentRoute;
          snapshot = currentRoute;
        }
      } else {
        snapshot = resolveRoutes_(routes, routes, initialUrl);
      }

      if (snapshot) {
        currentRoute = snapshot;
        events$.next(new RoutesRecognized(_objectSpread2(_objectSpread2({}, event), {}, {
          route: snapshot
        })));
      } else {
        events$.next(new NavigationError(_objectSpread2(_objectSpread2({}, event), {}, {
          error: new Error('unknown route')
        })));
      }
    } else if (event instanceof RoutesRecognized) {
      events$.next(new GuardsCheckStart(_objectSpread2({}, event)));
    } else if (event instanceof GuardsCheckStart) {
      events$.next(new ChildActivationStart(_objectSpread2({}, event)));
    } else if (event instanceof ChildActivationStart) {
      events$.next(new ActivationStart(_objectSpread2({}, event)));
    } else if (event instanceof ActivationStart) {
      events$.next(new GuardsCheckEnd(_objectSpread2({}, event)));
    } else if (event instanceof GuardsCheckEnd) {
      events$.next(new ResolveStart(_objectSpread2({}, event)));
    } else if (event instanceof ResolveStart) {
      events$.next(new ResolveEnd(_objectSpread2({}, event)));
    } else if (event instanceof ResolveEnd) {
      events$.next(new ActivationEnd(_objectSpread2({}, event)));
    } else if (event instanceof ActivationEnd) {
      events$.next(new ChildActivationEnd(_objectSpread2({}, event)));
    } else if (event instanceof ChildActivationEnd) {
      events$.next(new RouteConfigLoadStart(_objectSpread2({}, event)));
    } else if (event instanceof RouteConfigLoadStart) {
      events$.next(new RouteConfigLoadEnd(_objectSpread2({}, event)));
    } else if (event instanceof RouteConfigLoadEnd) {
      events$.next(new NavigationEnd(_objectSpread2({}, event)));
    } else if (event instanceof NavigationEnd) {
      var segments = [];
      var source = event.route;

      while (source != null) {
        var _source$extractedUrl;

        if ((_source$extractedUrl = source.extractedUrl) == null ? void 0 : _source$extractedUrl.length) {
          segments.push(source.extractedUrl);
        }

        if (source.childRoute) {
          source = source.childRoute;
        } else {
          var _source$remainUrl;

          if ((_source$remainUrl = source.remainUrl) == null ? void 0 : _source$remainUrl.length) {
            segments[segments.length - 1] = segments[segments.length - 1] + source.remainUrl;
          }

          source = undefined;
        }
      }

      var extractedUrl = segments.join('/').replace(/\/\//g, '/');
      clearRoutes_(routes, event.route);
      locationStrategy.setHistory(extractedUrl, undefined, event.trigger === 'popstate');
      route$.next(event.route);
    } else if (event instanceof NavigationCancel) {
      if (event.redirectTo) {
        events$.next(new NavigationStart({
          routerLink: event.redirectTo,
          trigger: 'imperative'
        }));
      }
    } else if (event instanceof NavigationError) {
      console.log('NavigationError', event.error);
    }
  }), operators.catchError(function (error) {
    return rxjs.of(new NavigationError(_objectSpread2(_objectSpread2({}, event), {}, {
      error: error
    })));
  }), operators.shareReplay(1));
}var RouterLinkDirective = function (_Directive) {
  _inheritsLoose(RouterLinkDirective, _Directive);

  function RouterLinkDirective() {
    return _Directive.apply(this, arguments) || this;
  }

  var _proto = RouterLinkDirective.prototype;

  _proto.getSegments = function getSegments(routerLink) {
    var segments = [];
    routerLink.forEach(function (item) {
      if (typeof item === 'string') {
        var regExp = /([^:]+)|\:([^\/]+)/g;
        var matches = item.matchAll(regExp);
        var components = [];

        for (var _iterator = _createForOfIteratorHelperLoose(matches), _step; !(_step = _iterator()).done;) {
          var match = _step.value;
          var g1 = match[1];
          var g2 = match[2];

          if (g1) {
            components.push(g1);
          } else if (g2) {
            var param = {};
            param[g2] = null;
            components.push(param);
          }
        }
      } else {
        segments.push(new RouteSegment('', {}));
      }
    });
    return segments;
  };

  _proto.onInit = function onInit() {
    var _this = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    var event$ = rxjs.fromEvent(node, 'click').pipe(operators.shareReplay(1));
    event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
      var navigationExtras = {
        skipLocationChange: _this.skipLocationChange,
        replaceUrl: _this.replaceUrl,
        state: _this.state
      };
      RouterService.setRouterLink(_this.routerLink, navigationExtras);
      event.preventDefault();
      return false;
    });
  };

  _proto.onChanges = function onChanges() {
    var _getContext2 = rxcomp.getContext(this),
        node = _getContext2.node;

    var routePath = RouterService.getPath(this.routerLink_);
    node.setAttribute('href', routePath.url);
  };

  _createClass(RouterLinkDirective, [{
    key: "routerLink",
    get: function get() {
      return this.routerLink_;
    },
    set: function set(routerLink) {
      this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
      this.segments = this.getSegments(this.routerLink_);
    }
  }]);

  return RouterLinkDirective;
}(rxcomp.Directive);
RouterLinkDirective.meta = {
  selector: '[routerLink],[[routerLink]]',
  inputs: ['routerLink']
};var RouterLinkActiveDirective = function (_Directive) {
  _inheritsLoose(RouterLinkActiveDirective, _Directive);

  function RouterLinkActiveDirective() {
    var _this;

    _this = _Directive.apply(this, arguments) || this;
    _this.keys = [];
    return _this;
  }

  var _proto = RouterLinkActiveDirective.prototype;

  _proto.onChanges = function onChanges() {
    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.remove.apply(node.classList, this.keys);
    var keys = [];
    var active = this.isActive();

    if (active) {
      var object = this.routerLinkActive;

      if (typeof object === 'object') {
        for (var key in object) {
          if (object[key]) {
            keys.push(key);
          }
        }
      } else if (typeof object === 'string') {
        keys = object.split(' ').filter(function (x) {
          return x.length;
        });
      }
    }

    node.classList.add.apply(node.classList, keys);
    this.keys = keys;
  };

  _proto.isActive = function isActive() {
    var _path$route;

    var path = RouterService.getPath(this.host.routerLink);
    var isActive = ((_path$route = path.route) == null ? void 0 : _path$route.snapshot) != null;
    return isActive;
  };

  return RouterLinkActiveDirective;
}(rxcomp.Directive);
RouterLinkActiveDirective.meta = {
  selector: '[routerLinkActive],[[routerLinkActive]]',
  hosts: {
    host: RouterLinkDirective
  },
  inputs: ['routerLinkActive']
};var RouterOutletStructure = function (_Structure) {
  _inheritsLoose(RouterOutletStructure, _Structure);

  function RouterOutletStructure() {
    var _this;

    _this = _Structure.apply(this, arguments) || this;
    _this.route$_ = new rxjs.ReplaySubject(1);
    return _this;
  }

  var _proto = RouterOutletStructure.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    this.route$().pipe(operators.switchMap(function (snapshot) {
      return _this2.factory$(snapshot);
    }), operators.takeUntil(this.unsubscribe$)).subscribe(function () {});

    if (this.host) {
      var _this$host$route;

      this.route$_.next((_this$host$route = this.host.route) == null ? void 0 : _this$host$route.childRoute);
    }
  };

  _proto.onChanges = function onChanges() {
    if (this.host) {
      var _this$host$route2;

      this.route$_.next((_this$host$route2 = this.host.route) == null ? void 0 : _this$host$route2.childRoute);
    }
  };

  _proto.route$ = function route$() {
    var _this3 = this;

    var source = this.host ? this.route$_ : RouterService.route$;
    return source.pipe(operators.filter(function (snapshot) {
      _this3.route_ = snapshot;

      if (_this3.snapshot_ && snapshot && _this3.snapshot_.component === snapshot.component) {
        _this3.snapshot_.next(snapshot);

        return false;
      } else {
        _this3.snapshot_ = snapshot;
        return true;
      }
    }));
  };

  _proto.factory$ = function factory$(snapshot) {
    var _this4 = this;

    var _getContext = rxcomp.getContext(this),
        module = _getContext.module,
        node = _getContext.node;

    var factory = snapshot == null ? void 0 : snapshot.component;

    if (this.factory_ !== factory) {
      this.factory_ = factory;
      return this.onExit$_(this.element, this.instance).pipe(operators.tap(function () {
        if (_this4.element) {
          _this4.element.parentNode.removeChild(_this4.element);

          module.remove(_this4.element, _this4);
          _this4.element = undefined;
          _this4.instance = undefined;
        }
      }), operators.switchMap(function () {
        if (snapshot && factory && factory.meta.template) {
          var element = document.createElement('div');
          element.innerHTML = factory.meta.template;

          if (element.children.length === 1) {
            element = element.firstElementChild;
          }

          node.appendChild(element);
          var instance = module.makeInstance(element, factory, factory.meta.selector, _this4, undefined, {
            route: snapshot
          });
          module.compile(element, instance);
          _this4.instance = instance;
          _this4.element = element;
          snapshot.element = element;
          return _this4.onEnter$_(element, instance);
        } else {
          return rxjs.of(false);
        }
      }));
    } else {
      return rxjs.of(false);
    }
  };

  _proto.onEnter$_ = function onEnter$_(element, instance) {
    if (element && instance && instance instanceof View) {
      return asObservable([element], instance.onEnter);
    } else {
      return rxjs.of(true);
    }
  };

  _proto.onExit$_ = function onExit$_(element, instance) {
    if (element && instance && instance instanceof View) {
      return asObservable([element], instance.onExit);
    } else {
      return rxjs.of(true);
    }
  };

  _createClass(RouterOutletStructure, [{
    key: "route",
    get: function get() {
      return this.route_;
    }
  }]);

  return RouterOutletStructure;
}(rxcomp.Structure);
RouterOutletStructure.meta = {
  selector: 'router-outlet,[router-outlet]',
  hosts: {
    host: RouterOutletStructure
  }
};
function asObservable(args, callback) {
  return rxjs.Observable.create(function (observer) {
    var subscription;

    try {
      var result = callback.apply(void 0, args);

      if (rxjs.isObservable(result)) {
        subscription = result.subscribe(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (isPromise(result)) {
        result.then(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else if (typeof result === 'function') {
        observer.next(result());
        observer.complete();
      } else {
        observer.next(result);
        observer.complete();
      }
    } catch (error) {
      observer.error(error);
    }

    return function () {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
}var factories = [RouterOutletStructure, RouterLinkDirective, RouterLinkActiveDirective];
var pipes = [];

var RouterModule = function (_Module) {
  _inheritsLoose(RouterModule, _Module);

  function RouterModule() {
    var _this;

    _this = _Module.call(this) || this;
    RouterService.observe$.pipe(operators.tap(function (event) {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        var _this$instances;

        if ((_this$instances = _this.instances) == null ? void 0 : _this$instances.length) {
          var root = _this.instances[0];
          root.pushChanges();
        }
      }
    }), operators.takeUntil(_this.unsubscribe$)).subscribe();
    RouterService.navigate("" + (location.pathname === '' ? '/' : location.pathname) + location.search + location.hash);
    return _this;
  }

  RouterModule.forRoot = function forRoot(routes) {
    RouterService.setRoutes(routes);
    return this;
  };

  RouterModule.useStrategy = function useStrategy(locationStrategyType) {
    RouterService.useLocationStrategy(locationStrategyType);
    return this;
  };

  return RouterModule;
}(rxcomp.Module);
RouterModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};(function (RouteLocationStrategy) {
  RouteLocationStrategy["Path"] = "path";
  RouteLocationStrategy["Hash"] = "hash";
})(exports.RouteLocationStrategy || (exports.RouteLocationStrategy = {}));function transition$(callback) {
  return rxjs.Observable.create(function (observer) {
    try {
      if (rxcomp.isPlatformBrowser) {
        callback(function (result) {
          observer.next(result);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    } catch (error) {
      observer.error(error);
    }
  });
}exports.ActivationEnd=ActivationEnd;exports.ActivationStart=ActivationStart;exports.ChildActivationEnd=ChildActivationEnd;exports.ChildActivationStart=ChildActivationStart;exports.GuardsCheckEnd=GuardsCheckEnd;exports.GuardsCheckStart=GuardsCheckStart;exports.LocationStrategy=LocationStrategy;exports.LocationStrategyHash=LocationStrategyHash;exports.LocationStrategyPath=LocationStrategyPath;exports.NavigationCancel=NavigationCancel;exports.NavigationEnd=NavigationEnd;exports.NavigationError=NavigationError;exports.NavigationStart=NavigationStart;exports.ResolveEnd=ResolveEnd;exports.ResolveStart=ResolveStart;exports.Route=Route;exports.RouteConfigLoadEnd=RouteConfigLoadEnd;exports.RouteConfigLoadStart=RouteConfigLoadStart;exports.RoutePath=RoutePath;exports.RouteSegment=RouteSegment;exports.RouteSnapshot=RouteSnapshot;exports.RouterEvent=RouterEvent;exports.RouterLinkActiveDirective=RouterLinkActiveDirective;exports.RouterLinkDirective=RouterLinkDirective;exports.RouterModule=RouterModule;exports.RouterOutletStructure=RouterOutletStructure;exports.RoutesRecognized=RoutesRecognized;exports.View=View;exports.asObservable=asObservable;exports.transition$=transition$;return exports;}({},rxcomp,rxjs,rxjs.operators));