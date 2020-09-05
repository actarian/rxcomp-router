"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var operators_1 = require("rxjs/operators");
var router_events_1 = require("./router/router-events");
var router_link_active_directive_1 = tslib_1.__importDefault(require("./router/router-link-active.directive"));
var router_link_directive_1 = tslib_1.__importDefault(require("./router/router-link.directive"));
var router_outlet_structure_1 = tslib_1.__importDefault(require("./router/router-outlet.structure"));
var router_service_1 = tslib_1.__importDefault(require("./router/router.service"));
var factories = [
    router_outlet_structure_1.default,
    router_link_directive_1.default,
    router_link_active_directive_1.default,
];
var pipes = [];
/**
 *  RouterModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *   RouterModule.forRoot([
 *    { path: '', redirectTo: '/index', pathMatch: 'full' },
 *    { path: 'index', component: IndexComponent, data: { title: 'Index' } }
 *   ])
 *  ],
 *  declarations: [
 *   IndexComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */
var RouterModule = /** @class */ (function (_super) {
    tslib_1.__extends(RouterModule, _super);
    function RouterModule() {
        var _this = _super.call(this) || this;
        // console.log('RouterModule');
        router_service_1.default.observe$.pipe(operators_1.tap(function (event) {
            var _a;
            if (event instanceof router_events_1.NavigationEnd
                || event instanceof router_events_1.NavigationCancel
                || event instanceof router_events_1.NavigationError) {
                if ((_a = _this.instances) === null || _a === void 0 ? void 0 : _a.length) {
                    var root = _this.instances[0];
                    root.pushChanges();
                }
            }
        }), operators_1.takeUntil(_this.unsubscribe$)).subscribe();
        router_service_1.default.navigate("" + (location.pathname === '' ? '/' : location.pathname) + location.search + location.hash);
        return _this;
    }
    RouterModule.forRoot = function (routes) {
        router_service_1.default.setRoutes(routes);
        return this;
    };
    RouterModule.useStrategy = function (locationStrategyType) {
        router_service_1.default.useLocationStrategy(locationStrategyType);
        return this;
    };
    RouterModule.meta = {
        declarations: tslib_1.__spread(factories, pipes),
        exports: tslib_1.__spread(factories, pipes)
    };
    return RouterModule;
}(rxcomp_1.Module));
exports.default = RouterModule;
