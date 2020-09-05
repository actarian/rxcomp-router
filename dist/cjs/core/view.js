"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var rxjs_1 = require("rxjs");
var View = /** @class */ (function (_super) {
    tslib_1.__extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    View.prototype.onEnter = function (node) { return rxjs_1.of(true); };
    View.prototype.onExit = function (node) { return rxjs_1.of(true); };
    return View;
}(rxcomp_1.Component));
exports.default = View;
