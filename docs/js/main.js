/**
 * @license rxcomp-router v1.0.0-beta.12
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(rxcomp,operators,rxjs){'use strict';function _defineProperties(target, props) {
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
}function mapCanDeactivate$_(activator) {
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
}var RouteSegment = function () {
  function RouteSegment(path, params) {
    if (params === void 0) {
      params = {};
    }

    this.path = path;
    this.params = params;
  }

  var _proto = RouteSegment.prototype;

  _proto.toString = function toString() {
    return "" + encodeSegment_(this.path) + encodeParams_(this.params);
  };

  return RouteSegment;
}();
function encodeParams_(params) {
  return Object.keys(params).map(function (key) {
    return ";" + encodeSegment_(key) + "=" + encodeSegment_(params[key]);
  }).join('');
}
function encodeSegment_(s) {
  return encodeString_(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function encodeString_(s) {
  return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}var Route = function Route(options) {
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
    this.children = this.children.map(function (route) {
      return new Route(route);
    });
  }

  var segments = [];

  if (this.path === '**') {
    segments.push(new RouteSegment(this.path));
    this.matcher = new RegExp('^.*$');
  } else {
    var matchers = ['^(^\.\.\/|\.\/|\/\/|\/)?'];
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
};
function serializeUrl_(routerLink) {
  var segments = Array.isArray(routerLink) ? routerLink : [routerLink];
  return segments.join('/');
}var RouteSnapshot = function () {
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

  _proto.next = function next(routeSnapshot) {
    var data = this.data = Object.assign({}, routeSnapshot.data);
    this.data$.next(data);
    var params = this.params = Object.assign({}, routeSnapshot.params);
    this.params$.next(params);
    var queryParams = this.queryParams = Object.assign({}, routeSnapshot.queryParams);
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
    this.observe$ = makeObserve$_(this.routes, this.route$, this.events$);
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

  return RouterService;
}();
RouterService.routes = [];
RouterService.route$ = new rxjs.ReplaySubject(1);
RouterService.events$ = new rxjs.ReplaySubject(1);

function setHistory_(url, params, popped) {
  if (rxcomp.isPlatformBrowser && window.history && window.history.pushState) {
    var title = document.title;
    url = "" + url + (params ? '?' + params.toString() : '');

    if (popped) {
      window.history.replaceState(undefined, title, url);
    } else {
      window.history.pushState(undefined, title, url);
    }
  }
}

function resolveRoute_(routes, route, initialUrl) {
  var urlAfterRedirects;
  var extractedUrl = '';
  var remainUrl = initialUrl;
  var resolvedRoute;
  var match = initialUrl.match(route.matcher);

  if (match !== null) {
    extractedUrl = match[0];
    remainUrl = initialUrl.substring(match[0].length, initialUrl.length);
    resolvedRoute = route;
  }

  while (resolvedRoute && resolvedRoute.redirectTo) {
    urlAfterRedirects = resolvedRoute.redirectTo;
    initialUrl = serializeUrl_(resolvedRoute.redirectTo);
    remainUrl = initialUrl;
    resolvedRoute = routes.find(function (r) {
      var match = initialUrl.match(r.matcher);

      if (match !== null) {
        extractedUrl = match[0];
        remainUrl = initialUrl.substr(match[0].length, initialUrl.length);
        return true;
      } else {
        return false;
      }
    });
  }

  if (resolvedRoute) {
    var values = extractedUrl.split('/').filter(function (x) {
      return x !== '';
    });
    var params = {};
    resolvedRoute.segments.forEach(function (segment, index) {
      var keys = Object.keys(segment.params);

      if (keys.length) {
        params[keys[0]] = values[index];
      }
    });
    var routeSnapshot = new RouteSnapshot(_objectSpread2(_objectSpread2({}, resolvedRoute), {}, {
      initialUrl: initialUrl,
      urlAfterRedirects: urlAfterRedirects,
      extractedUrl: extractedUrl,
      remainUrl: remainUrl,
      params: params
    }));

    if (remainUrl.length && route.children) {
      routeSnapshot.childRoute = route.children.map(function (x) {
        return resolveRoute_(routes, x, remainUrl);
      }).find(function (x) {
        return x != null;
      });
    }

    return routeSnapshot;
  } else {
    return undefined;
  }
}

function makeObserve$_(routes, route$, events$) {
  var currentRoute;
  var stateEvents$ = rxjs.merge(rxjs.fromEvent(window, 'popstate')).pipe(operators.tap(function (event) {
    console.log('location', document.location.pathname, 'state', event.state);
  }), operators.map(function (event) {
    return new NavigationStart({
      routerLink: document.location.pathname,
      trigger: 'popstate'
    });
  }), operators.shareReplay(1));
  return rxjs.merge(stateEvents$, events$).pipe(operators.switchMap(function (event) {
    if (event instanceof GuardsCheckStart && event.route.canActivate && event.route.canActivate.length) {
      return rxjs.combineLatest.apply(void 0, event.route.canActivate.map(function (x) {
        return x(event.route);
      })).pipe(operators.map(function (values) {
        var canActivate = values.reduce(function (p, c) {
          return p && c;
        }, true);

        if (canActivate) {
          return event;
        } else {
          return new NavigationCancel(_objectSpread2(_objectSpread2({}, event), {}, {
            reason: 'Activation guard has dismissed navigation to route.'
          }));
        }
      }));
    } else {
      return rxjs.of(event);
    }
  }), operators.tap(function (event) {
    if (event instanceof NavigationStart) {
      var _currentRoute$childre;

      console.log('NavigationStart', event.routerLink);
      var routerLink = event.routerLink;
      var routeSnapshot;
      var initialUrl = serializeUrl_(routerLink);
      var isRelative = initialUrl.indexOf('/') !== 0;

      if (isRelative && currentRoute && ((_currentRoute$childre = currentRoute.children) == null ? void 0 : _currentRoute$childre.length)) {
        routeSnapshot = currentRoute.children.reduce(function (p, r) {
          return p || resolveRoute_(routes, r, initialUrl);
        }, undefined);

        if (routeSnapshot) {
          currentRoute.childRoute = routeSnapshot;
          routeSnapshot = currentRoute;
        }
      } else {
        routeSnapshot = routes.reduce(function (p, r) {
          return p || resolveRoute_(routes, r, initialUrl);
        }, undefined);
      }

      if (routeSnapshot != null) {
        currentRoute = routeSnapshot;
        events$.next(new RoutesRecognized(_objectSpread2(_objectSpread2({}, event), {}, {
          route: routeSnapshot
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

        console.log(source.params, source.data);

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
      console.log('NavigationEnd', extractedUrl);
      setHistory_(extractedUrl, undefined, event.trigger === 'popstate');
      route$.next(event.route);
    } else if (event instanceof NavigationCancel) {
      console.log('NavigationCancel', event);
    } else if (event instanceof NavigationError) {
      console.log('NavigationError', event);
    }
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

    node.setAttribute('href', serializeUrl_(this.routerLink));
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
};var RouterOutletStructure = function (_Structure) {
  _inheritsLoose(RouterOutletStructure, _Structure);

  function RouterOutletStructure() {
    return _Structure.apply(this, arguments) || this;
  }

  var _proto = RouterOutletStructure.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    if (!this.host) {
      RouterService.route$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (route) {
        _this.route = route;

        _this.pushChanges();
      });
    }
  };

  _proto.onChanges = function onChanges() {
    if (this.host) {
      this.route = this.host.route.childRoute;
    }
  };

  _createClass(RouterOutletStructure, [{
    key: "route",
    get: function get() {
      return this.route_;
    },
    set: function set(route) {
      if (this.route_ && route && this.route_.component === route.component) {
        this.route_.next(route);
      } else {
        this.route_ = route;
        this.component = route == null ? void 0 : route.component;
      }
    }
  }, {
    key: "component",
    get: function get() {
      return this.component_;
    },
    set: function set(component) {
      var _getContext = rxcomp.getContext(this),
          module = _getContext.module,
          node = _getContext.node;

      {
        this.component_ = component;

        if (this.element) {
          this.element.parentNode.removeChild(this.element);
          module.remove(this.element, this);
          this.element = undefined;
          this.instance = undefined;
        }

        if (component && component.meta.template) {
          var element = document.createElement('div');
          element.innerHTML = component.meta.template;

          if (element.children.length === 1) {
            element = element.firstElementChild;
          }

          node.appendChild(element);
          var instance = module.makeInstance(element, component, component.meta.selector, this);
          module.compile(element, instance);
          this.instance = instance;
          this.element = element;
        }
      }
    }
  }]);

  return RouterOutletStructure;
}(rxcomp.Structure);
RouterOutletStructure.first = false;
RouterOutletStructure.meta = {
  selector: 'router-outlet,[router-outlet]',
  hosts: {
    host: RouterOutletStructure
  }
};var factories = [RouterOutletStructure, RouterLinkDirective];
var pipes = [];

var RouterModule = function (_Module) {
  _inheritsLoose(RouterModule, _Module);

  function RouterModule() {
    var _this;

    _this = _Module.call(this) || this;
    RouterService.observe$.pipe(operators.takeUntil(_this.unsubscribe$)).subscribe();
    RouterService.navigate(window.location.pathname + window.location.search + window.location.hash);
    return _this;
  }

  RouterModule.forRoot = function forRoot(routes) {
    RouterService.setRoutes(routes);
    return RouterModule;
  };

  return RouterModule;
}(rxcomp.Module);
RouterModule.meta = {
  declarations: [].concat(factories, pipes),
  exports: [].concat(factories, pipes)
};var AppComponent = function (_Component) {
  _inheritsLoose(AppComponent, _Component);

  function AppComponent() {
    var _this;

    _this = _Component.apply(this, arguments) || this;
    _this.error = null;
    return _this;
  }

  var _proto = AppComponent.prototype;

  _proto.onInit = function onInit() {
    var _this2 = this;

    var _getContext = rxcomp.getContext(this),
        node = _getContext.node;

    node.classList.add('init');
    rxcomp.errors$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (error) {
      _this2.error = error;

      _this2.pushChanges();
    });
  };

  return AppComponent;
}(rxcomp.Component);
AppComponent.meta = {
  selector: '[app-component]'
};var ContactsComponent = function (_Component) {
  _inheritsLoose(ContactsComponent, _Component);

  function ContactsComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ContactsComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.host.route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
      return _this.title = data.title;
    });
  };

  return ContactsComponent;
}(rxcomp.Component);
ContactsComponent.meta = {
  selector: '[contacts-component]',
  hosts: {
    host: RouterOutletStructure
  },
  template: "\n        <div class=\"page-contacts\">\n            <div class=\"title\">{{title}}</div>\n        </div>\n        "
};var DetailComponent = function (_Component) {
  _inheritsLoose(DetailComponent, _Component);

  function DetailComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = DetailComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.host.route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
      return _this.title = data.title;
    });
    this.host.route.params$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (params) {
      return _this.detailId = params.detailId;
    });
  };

  return DetailComponent;
}(rxcomp.Component);
DetailComponent.meta = {
  selector: '[detail-component]',
  hosts: {
    host: RouterOutletStructure
  },
  template: "\n        <div class=\"page-detail\">\n            <div class=\"title\">Detail {{detailId}}</div>\n            <ul class=\"nav--menu\">\n                <li><a routerLink=\"media\" routerLinkActive=\"active\">Media</a></li>\n                <li><a routerLink=\"files\" routerLinkActive=\"active\">Files</a></li>\n            </ul>\n            <router-outlet></router-outlet>\n        </div>\n        "
};var IndexComponent = function (_Component) {
  _inheritsLoose(IndexComponent, _Component);

  function IndexComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = IndexComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.host.route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
      return _this.title = data.title;
    });
  };

  return IndexComponent;
}(rxcomp.Component);
IndexComponent.meta = {
  selector: '[index-component]',
  hosts: {
    host: RouterOutletStructure
  },
  template: "\n        <div class=\"page-index\">\n            <div class=\"title\">{{title}}</div>\n        </div>\n        "
};var NotFoundComponent = function (_Component) {
  _inheritsLoose(NotFoundComponent, _Component);

  function NotFoundComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = NotFoundComponent.prototype;

  _proto.onInit = function onInit() {};

  return NotFoundComponent;
}(rxcomp.Component);
NotFoundComponent.meta = {
  selector: '[not-found-component]',
  template: "\n        <div class=\"page-not-found\">\n            <div class=\"title\">Not Found</div>\n        </div>\n        "
};var SubComponent = function (_Component) {
  _inheritsLoose(SubComponent, _Component);

  function SubComponent() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = SubComponent.prototype;

  _proto.onInit = function onInit() {
    var _this = this;

    this.host.route.data$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (data) {
      return _this.title = data.title;
    });
  };

  return SubComponent;
}(rxcomp.Component);
SubComponent.meta = {
  selector: '[sub-component]',
  hosts: {
    host: RouterOutletStructure
  },
  template: "\n        <div class=\"page-sub\">\n            <div class=\"title\">{{title}}</div>\n        </div>\n        "
};var CustomActivator = function () {
  function CustomActivator() {}

  var _proto = CustomActivator.prototype;

  _proto.canDeactivate = function canDeactivate(component, currentRoute) {
    return true;
  };

  _proto.canLoad = function canLoad(route, segments) {
    return true;
  };

  _proto.canActivate = function canActivate(route) {
    console.log('canActivate', route);
    return false;
  };

  _proto.canActivateChild = function canActivateChild(childRoute) {
    return true;
  };

  return CustomActivator;
}();

var AppModule = function (_Module) {
  _inheritsLoose(AppModule, _Module);

  function AppModule() {
    return _Module.apply(this, arguments) || this;
  }

  return AppModule;
}(rxcomp.Module);
AppModule.meta = {
  imports: [rxcomp.CoreModule, RouterModule.forRoot([{
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: IndexComponent,
    data: {
      title: 'Dashboard'
    }
  }, {
    path: 'detail/:detailId',
    component: DetailComponent,
    data: {
      title: 'Detail'
    },
    children: [{
      path: 'media',
      component: SubComponent,
      data: {
        title: 'Media'
      }
    }, {
      path: 'files',
      component: SubComponent,
      data: {
        title: 'Files'
      }
    }]
  }, {
    path: 'contacts',
    component: ContactsComponent,
    data: {
      title: 'Contacts'
    },
    canActivate: [new CustomActivator()]
  }, {
    path: '**',
    component: NotFoundComponent
  }])],
  declarations: [IndexComponent, DetailComponent, ContactsComponent],
  bootstrap: AppComponent
};rxcomp.Browser.bootstrap(AppModule);}(rxcomp,rxjs.operators,rxjs));