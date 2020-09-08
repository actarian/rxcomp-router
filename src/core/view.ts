
import { Component, IElement, IFactoryMeta } from 'rxcomp';
import { Observable } from 'rxjs';
import { RouteSnapshot } from '../route/route-snapshot';

export type TransitionCallback = (node: IElement) => Observable<boolean> | Promise<boolean> | (() => boolean) | boolean;
export interface ITransitionKey extends String { }
export interface ITransition {
	[key: string]: (node: IElement) => Observable<boolean> | Promise<boolean> | (() => boolean) | boolean;
}
export class Transition {
	callback: TransitionCallback;
	path: string;
	constructor(callback: TransitionCallback, path?: string) {
		this.callback = callback;
		this.path = path || '**';
	}
	matcher(path?: string): boolean {
		return this.path === '**' ? true : this.path === path;
	}
}
export class OnceTransition extends Transition { }
export class EnterTransition extends Transition { }
export class LeaveTransition extends Transition { }
export interface IViewMeta extends IFactoryMeta {
	/**
	 * example:
	 * transition: {
	 * 	'from:dashboard': (node:IElement, previousRoute?:RouteSnapshot) => {
	 *  }
	 *	'to:detail/:detailId': (node:IElement, nextRoute:RouteSnapshot) => {
	 *  }
	 * 	'enter:': (node:IElement, previousRoute?:RouteSnapshot) => {
	 *  }
	 *	'leave:': (node:IElement, nextRoute:RouteSnapshot) => {
	 *  }
	 */
	transitions?: ITransition;
}
export default class View extends Component {
	route!: RouteSnapshot;
	/*
	onEnter(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }
	onLeave(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }
	*/
	static meta: IViewMeta;
	static transitions_?: Transition[];
	static get transitions(): Transition[] {
		let transitions!: Transition[];
		if (this.transitions_) {
			transitions = this.transitions_;
		} else {
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
