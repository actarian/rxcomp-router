"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var router_link_directive_1 = tslib_1.__importDefault(require("./router-link.directive"));
var router_service_1 = tslib_1.__importDefault(require("./router.service"));
var RouterLinkActiveDirective = /** @class */ (function (_super) {
    tslib_1.__extends(RouterLinkActiveDirective, _super);
    function RouterLinkActiveDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = [];
        return _this;
    }
    RouterLinkActiveDirective.prototype.onChanges = function () {
        // console.log('RouterLinkActive.onChanges');
        var node = rxcomp_1.getContext(this).node;
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
            }
            else if (typeof object === 'string') {
                keys = object.split(' ').filter(function (x) { return x.length; });
            }
        }
        node.classList.add.apply(node.classList, keys);
        this.keys = keys;
        // console.log('RouterLinkActive.onChanges', active, keys);
    };
    RouterLinkActiveDirective.prototype.isActive = function () {
        var _a;
        var path = router_service_1.default.getPath(this.host.routerLink);
        var isActive = ((_a = path.route) === null || _a === void 0 ? void 0 : _a.snapshot) != null;
        // console.log('RouterLinkActive.isActive', isActive, path.route);
        return isActive;
    };
    RouterLinkActiveDirective.meta = {
        selector: '[routerLinkActive],[[routerLinkActive]]',
        hosts: { host: router_link_directive_1.default },
        inputs: ['routerLinkActive'],
    };
    return RouterLinkActiveDirective;
}(rxcomp_1.Directive));
exports.default = RouterLinkActiveDirective;
