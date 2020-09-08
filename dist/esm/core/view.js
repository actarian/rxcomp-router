import { Component } from 'rxcomp';
export class Transition {
    constructor(callback, path) {
        this.callback = callback;
        this.path = path || '**';
    }
    matcher(path) {
        return this.path === '**' ? true : this.path === path;
    }
}
export class OnceTransition extends Transition {
}
export class EnterTransition extends Transition {
}
export class LeaveTransition extends Transition {
}
export default class View extends Component {
    static get transitions() {
        let transitions;
        if (this.transitions_) {
            transitions = this.transitions_;
        }
        else {
            transitions = this.transitions_ = [];
            const source = this.meta.transitions || {};
            Object.keys(source).forEach(key => {
                const matches = /^(once|from|enter|to|leave):\s?(.+)?\s?$/.exec(key);
                // return /([^\s]+)\s?=>\s?([^\s]+)/.test(key);
                if ((matches != null && matches.length > 1)) {
                    switch (matches[1]) {
                        case 'once':
                            transitions.push(new OnceTransition(source[key], matches[2]));
                            break;
                        case 'to':
                        case 'from':
                        case 'enter':
                            transitions.push(new EnterTransition(source[key], matches[2]));
                            break;
                        case 'to':
                        case 'leave':
                            transitions.push(new LeaveTransition(source[key], matches[2]));
                            break;
                    }
                }
            });
        }
        return transitions;
    }
}
