import { getContext, Structure } from 'rxcomp';
import { of, ReplaySubject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import View, { EnterTransition, LeaveTransition, OnceTransition } from '../core/view';
import { asObservable } from '../observable/observable';
import { transitionOnce, transitionOnced } from '../transition/transition';
import RouterService from './router.service';
export default class RouterOutletStructure extends Structure {
    constructor() {
        super(...arguments);
        this.route$_ = new ReplaySubject(1);
    }
    get route() {
        return this.route_;
    }
    onInit() {
        var _a;
        this.route$().pipe(switchMap(snapshot => this.factory$(snapshot)), takeUntil(this.unsubscribe$)).subscribe(() => {
            // console.log(`RouterOutletStructure ActivatedRoutes: ["${RouterService.flatRoutes.filter(x => x.snapshot).map(x => x.snapshot?.extractedUrl).join('", "')}"]`);
        });
        if (this.host) {
            this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
    }
    onChanges() {
        var _a;
        if (this.host) {
            this.route$_.next((_a = this.host.route) === null || _a === void 0 ? void 0 : _a.childRoute);
        }
    }
    route$() {
        const source = this.host ? this.route$_ : RouterService.route$;
        return source.pipe(filter((snapshot) => {
            this.route_ = snapshot; // !!!
            if (this.snapshot_ && snapshot && this.snapshot_.component === snapshot.component) {
                this.snapshot_.next(snapshot);
                return false;
            }
            else {
                this.snapshot_ = snapshot;
                return true;
            }
        }));
    }
    factory$(snapshot) {
        const { module, node } = getContext(this);
        const factory = snapshot === null || snapshot === void 0 ? void 0 : snapshot.component;
        if (this.factory_ !== factory) {
            this.factory_ = factory;
            return this.onLeave$_(snapshot, this.element, this.instance).pipe(tap(() => {
                if (this.element) {
                    this.element.parentNode.removeChild(this.element);
                    module.remove(this.element, this);
                    this.element = undefined;
                    this.instance = undefined;
                }
            }), switchMap((leaved) => {
                if (snapshot && factory && factory.meta.template) {
                    let element = document.createElement('div');
                    element.innerHTML = factory.meta.template;
                    if (element.children.length === 1) {
                        element = element.firstElementChild;
                    }
                    node.appendChild(element);
                    const instance = module.makeInstance(element, factory, factory.meta.selector, this, undefined, { route: snapshot });
                    module.compile(element, instance);
                    this.instance = instance;
                    this.element = element;
                    snapshot.element = element;
                    return this.onOnce$_(snapshot, element, instance).pipe(switchMap((onced) => {
                        return this.onEnter$_(snapshot, element, instance);
                    }));
                }
                else {
                    return of(false);
                }
            }));
        }
        else {
            return of(false);
        }
    }
    /*
    private onEnter$__(element?: IElement, instance?: Component): Observable<boolean> {
        if (instance instanceof View && element) {
            return asObservable([element], instance.onEnter);
        } else {
            return of(true);
        }
    }
    private onLeave$__(element?: IElement, instance?: Component): Observable<boolean> {
        if (instance instanceof View && element) {
            return asObservable([element], instance.onLeave);
        } else {
            return of(true);
        }
    }
    */
    onOnce$_(snapshot, element, instance) {
        if (!transitionOnced() && instance instanceof View && element) {
            transitionOnce();
            const factory = instance.constructor;
            const transition = factory.transitions.find((x) => { var _a; return x instanceof OnceTransition && x.matcher((_a = snapshot.previousRoute) === null || _a === void 0 ? void 0 : _a.path); });
            return transition ? asObservable([element, snapshot.previousRoute], transition.callback) : of(true);
        }
        else {
            return of(true);
        }
    }
    onEnter$_(snapshot, element, instance) {
        if (instance instanceof View && element) {
            const factory = instance.constructor;
            const transition = factory.transitions.find((x) => { var _a; return x instanceof EnterTransition && x.matcher((_a = snapshot.previousRoute) === null || _a === void 0 ? void 0 : _a.path); });
            return transition ? asObservable([element, snapshot.previousRoute], transition.callback) : of(true);
        }
        else {
            return of(true);
        }
    }
    onLeave$_(snapshot, element, instance) {
        if (instance instanceof View && element) {
            const factory = instance.constructor;
            const transition = factory.transitions.find((x) => x instanceof LeaveTransition && x.matcher(snapshot === null || snapshot === void 0 ? void 0 : snapshot.path));
            return transition ? asObservable([element, snapshot], transition.callback) : of(true);
        }
        else {
            return of(true);
        }
    }
}
RouterOutletStructure.meta = {
    selector: 'router-outlet,[router-outlet]',
    hosts: { host: RouterOutletStructure },
};
