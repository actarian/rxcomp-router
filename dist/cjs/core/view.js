"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTransition = exports.EnterTransition = exports.OnceTransition = exports.Transition = void 0;
var tslib_1 = require("tslib");
var rxcomp_1 = require("rxcomp");
var Transition = /** @class */ (function () {
    function Transition(callback, path) {
        this.callback = callback;
        this.path = path || '**';
    }
    Transition.prototype.matcher = function (path) {
        return this.path === '**' ? true : this.path === path;
    };
    return Transition;
}());
exports.Transition = Transition;
var OnceTransition = /** @class */ (function (_super) {
    tslib_1.__extends(OnceTransition, _super);
    function OnceTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OnceTransition;
}(Transition));
exports.OnceTransition = OnceTransition;
var EnterTransition = /** @class */ (function (_super) {
    tslib_1.__extends(EnterTransition, _super);
    function EnterTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnterTransition;
}(Transition));
exports.EnterTransition = EnterTransition;
var LeaveTransition = /** @class */ (function (_super) {
    tslib_1.__extends(LeaveTransition, _super);
    function LeaveTransition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LeaveTransition;
}(Transition));
exports.LeaveTransition = LeaveTransition;
var View = /** @class */ (function (_super) {
    tslib_1.__extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(View, "transitions", {
        get: function () {
            var transitions;
            if (this.transitions_) {
                transitions = this.transitions_;
            }
            else {
                transitions = this.transitions_ = [];
                var source_1 = this.meta.transitions || {};
                Object.keys(source_1).forEach(function (key) {
                    var matches = /^(once|from|enter|to|leave):\s?(.+)?\s?$/.exec(key);
                    // return /([^\s]+)\s?=>\s?([^\s]+)/.test(key);
                    if ((matches != null && matches.length > 1)) {
                        switch (matches[1]) {
                            case 'once':
                                transitions.push(new OnceTransition(source_1[key], matches[2]));
                                break;
                            case 'to':
                            case 'from':
                            case 'enter':
                                transitions.push(new EnterTransition(source_1[key], matches[2]));
                                break;
                            case 'to':
                            case 'leave':
                                transitions.push(new LeaveTransition(source_1[key], matches[2]));
                                break;
                        }
                    }
                });
            }
            return transitions;
        },
        enumerable: false,
        configurable: true
    });
    return View;
}(rxcomp_1.Component));
exports.default = View;
