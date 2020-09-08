import { Component, IElement, IFactoryMeta } from 'rxcomp';
import { Observable } from 'rxjs';
import { RouteSnapshot } from '../route/route-snapshot';
export declare type TransitionCallback = (node: IElement) => Observable<boolean> | Promise<boolean> | (() => boolean) | boolean;
export interface ITransitionKey extends String {
}
export interface ITransition {
    [key: string]: (node: IElement) => Observable<boolean> | Promise<boolean> | (() => boolean) | boolean;
}
export declare class Transition {
    callback: TransitionCallback;
    path: string;
    constructor(callback: TransitionCallback, path?: string);
    matcher(path?: string): boolean;
}
export declare class OnceTransition extends Transition {
}
export declare class EnterTransition extends Transition {
}
export declare class LeaveTransition extends Transition {
}
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
    route: RouteSnapshot;
    static meta: IViewMeta;
    static transitions_?: Transition[];
    static get transitions(): Transition[];
}
