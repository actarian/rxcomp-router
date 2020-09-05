import { getContext, Structure } from 'rxcomp';
import { isObservable, Observable, of, ReplaySubject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import View from '../core/view';
import { isPromise } from '../route/route-activators';
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
            return this.onExit$_(this.element, this.instance).pipe(tap(() => {
                if (this.element) {
                    this.element.parentNode.removeChild(this.element);
                    module.remove(this.element, this);
                    this.element = undefined;
                    this.instance = undefined;
                }
            }), switchMap(() => {
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
                    return this.onEnter$_(element, instance);
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
    onEnter$_(element, instance) {
        if (element && instance && instance instanceof View) {
            return asObservable([element], instance.onEnter);
        }
        else {
            return of(true);
        }
    }
    onExit$_(element, instance) {
        if (element && instance && instance instanceof View) {
            return asObservable([element], instance.onExit);
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
export function asObservable(args, callback) {
    return Observable.create(function (observer) {
        let subscription;
        try {
            let result = callback(...args);
            if (isObservable(result)) {
                subscription = result.subscribe(result => {
                    observer.next(result);
                    observer.complete();
                });
            }
            else if (isPromise(result)) {
                result.then(result => {
                    observer.next(result);
                    observer.complete();
                });
            }
            else if (typeof result === 'function') {
                observer.next(result());
                observer.complete();
            }
            else {
                observer.next(result);
                observer.complete();
            }
        }
        catch (error) {
            observer.error(error);
        }
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    });
}
