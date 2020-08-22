import { Component, Factory, getContext, IComment, IElement, IFactoryMeta, Structure } from 'rxcomp';
import { isObservable, Observable, Observer, of, ReplaySubject, Subscription } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import View from '../core/view';
import { isPromise } from '../route/route-activators';
import { RouteSnapshot } from '../route/route-snapshot';
import RouterService from './router.service';

export default class RouterOutletStructure extends Structure {
    private route$_: ReplaySubject<RouteSnapshot | undefined> = new ReplaySubject<RouteSnapshot | undefined>(1);
    private route_?: RouteSnapshot;
    private factory_?: typeof Component;
    get route(): RouteSnapshot | undefined {
        return this.route_;
    }
    host?: RouterOutletStructure;
    outlet!: IComment;
    element?: IElement;
    instance?: Component;
    onInit() {
        this.route$().pipe(
            switchMap(snapshot => this.factory$(snapshot)),
            takeUntil(this.unsubscribe$)
        ).subscribe(() => {
            // console.log(`RouterOutletStructure ActivatedRoutes: ["${RouterService.flatRoutes.filter(x => x.snapshot).map(x => x.snapshot?.extractedUrl).join('", "')}"]`);
        });
        if (this.host) {
            this.route$_.next(this.host.route?.childRoute);
        }
    }
    onChanges() {
        if (this.host) {
            this.route$_.next(this.host.route?.childRoute);
        }
    }
    route$(): Observable<RouteSnapshot | undefined> {
        const source: Observable<RouteSnapshot | undefined> = this.host ? this.route$_ : RouterService.route$;
        return source.pipe(
            filter((snapshot: RouteSnapshot | undefined) => {
                this.route_ = snapshot; // !!!
                if (this.snapshot_ && snapshot && this.snapshot_.component === snapshot.component) {
                    this.snapshot_.next(snapshot);
                    return false;
                } else {
                    this.snapshot_ = snapshot;
                    return true;
                }
            }),
        );
    }
    factory$(snapshot: RouteSnapshot | undefined): Observable<boolean> {
        const { module, node } = getContext(this);
        const factory: typeof Component | undefined = snapshot?.component;
        if (this.factory_ !== factory) {
            this.factory_ = factory;
            return this.onExit$_(this.element, this.instance).pipe(
                tap(() => {
                    if (this.element) {
                        this.element.parentNode!.removeChild(this.element);
                        module.remove(this.element, this);
                        this.element = undefined;
                        this.instance = undefined;
                    }
                }),
                switchMap(() => {
                    if (snapshot && factory && factory.meta.template) {
                        let element: IElement = document.createElement('div');
                        element.innerHTML = factory.meta.template;
                        if (element.children.length === 1) {
                            element = element.firstElementChild as IElement;
                        }
                        node.appendChild(element);
                        const instance: Factory | undefined = module.makeInstance(element, factory, factory.meta.selector!, this);
                        module.compile(element, instance);
                        this.instance = instance;
                        this.element = element;
                        snapshot.instance = instance;
                        return this.onEnter$_(element, instance);
                    } else {
                        return of(false);
                    }
                })
            );
        } else {
            return of(false);
        }
    }
    private onEnter$_(element?: IElement, instance?: Component): Observable<boolean> {
        if (element && instance && instance instanceof View) {
            return asObservable_([element], instance.onEnter);
        } else {
            return of(true);
        }
    }
    private onExit$_(element?: IElement, instance?: Component): Observable<boolean> {
        if (element && instance && instance instanceof View) {
            return asObservable_([element], instance.onExit);
        } else {
            return of(true);
        }
    }
    static meta: IFactoryMeta = {
        selector: 'router-outlet,[router-outlet]',
        hosts: { host: RouterOutletStructure },
    };
}

function asObservable_<T>(args: any[], callback: (...args: any[]) => Observable<T> | Promise<T> | (() => T) | T): Observable<T> {
    return Observable.create(function (observer: Observer<T>) {
        let subscription: Subscription;
        try {
            let result: Observable<T> | Promise<T> | (() => T) | T = callback(...args);
            if (isObservable(result)) {
                subscription = result.subscribe(result => {
                    observer.next(result);
                    observer.complete();
                });
            } else if (isPromise<T>(result)) {
                (result as Promise<T>).then(result => {
                    observer.next(result);
                    observer.complete();
                });
            } else if (typeof result === 'function') {
                observer.next((result as (() => T))() as T);
                observer.complete();
            } else {
                observer.next(result);
                observer.complete();
            }
        } catch (error) {
            observer.error(error);
        }
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        }
    });
}

/*
set route(route: RouteSnapshot | undefined) {
    if (this.route_ && route && this.route_.component === route.component) {
        this.route_.next(route);
    } else {
        this.route_ = route;
        if (route) {
            this.factory = route.component;
            route.instance = this.instance;
        } else {
            this.factory = undefined;
        }
    }
}
get factory(): typeof Component | undefined {
    return this.factory_;
}
set factory(factory: typeof Component | undefined) {
    const { module, node } = getContext(this);
    if (this.factory_ !== factory) {
        this.factory_ = factory;
        if (this.element) {
            if (this.instance && this.instance instanceof View) {
                asObservable_([this.element], this.instance.onExit);
            }
            this.element.parentNode!.removeChild(this.element);
            module.remove(this.element, this);
            this.element = undefined;
            this.instance = undefined;
        }
        if (factory && factory.meta.template) {
            let element: IElement = document.createElement('div');
            element.innerHTML = factory.meta.template;
            if (element.children.length === 1) {
                element = element.firstElementChild as IElement;
            }
            node.appendChild(element);
            const instance: Factory | undefined = module.makeInstance(element, factory, factory.meta.selector!, this);
            module.compile(element, instance);
            this.instance = instance;
            this.element = element;
        }
    }
}
*/