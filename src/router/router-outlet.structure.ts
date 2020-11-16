import { Component, Factory, getContext, IComment, IElement, IFactoryMeta, Structure } from 'rxcomp';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import View, { EnterTransition, LeaveTransition, OnceTransition, Transition } from '../core/view';
import { asObservable } from '../observable/observable';
import { RouteSnapshot } from '../route/route-snapshot';
import { transitionOnce, transitionOnced } from '../transition/transition';
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
	factory$(snapshot: RouteSnapshot | undefined): Observable<void> {
		const { module, node } = getContext(this);
		const factory: typeof Component | undefined = snapshot?.component;
		if (this.factory_ !== factory) {
			this.factory_ = factory;
			return this.onLeave$_(snapshot, this.element, this.instance).pipe(
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
						const instance: Factory | undefined = module.makeInstance(element, factory, factory.meta.selector!, this, undefined, { route: snapshot });
						module.compile(element, instance);
						this.instance = instance;
						this.element = element;
						snapshot.element = element;
						return this.onOnce$_(snapshot, element, instance).pipe(
							switchMap(() => {
								return this.onEnter$_(snapshot, element, instance);
							})
						);
					} else {
						return of(void 0);
					}
				})
			);
		} else {
			return of(void 0);
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
	private onOnce$_(snapshot: RouteSnapshot, element?: IElement, instance?: Component): Observable<void> {
		if (!transitionOnced() && instance instanceof View && element) {
			transitionOnce();
			const factory = instance.constructor as unknown as View;
			const transition: OnceTransition = factory.transitions.find((x: Transition) => x instanceof OnceTransition && x.matcher(snapshot.previousRoute?.path));
			return transition ? asObservable<void>([element, snapshot.previousRoute], transition.callback.bind(instance)) : of(void 0);
		} else {
			return of(void 0);
		}
	}
	private onEnter$_(snapshot: RouteSnapshot, element?: IElement, instance?: Component): Observable<void> {
		if (instance instanceof View && element) {
			const factory = instance.constructor as unknown as View;
			const transition: EnterTransition = factory.transitions.find((x: Transition) => x instanceof EnterTransition && x.matcher(snapshot.previousRoute?.path));
			return transition ? asObservable<void>([element, snapshot.previousRoute], transition.callback.bind(instance)) : of(void 0);
		} else {
			return of(void 0);
		}
	}
	private onLeave$_(snapshot?: RouteSnapshot, element?: IElement, instance?: Component): Observable<void> {
		if (instance instanceof View && element) {
			const factory = instance.constructor as unknown as View;
			const transition: LeaveTransition = factory.transitions.find((x: Transition) => x instanceof LeaveTransition && x.matcher(snapshot?.path));
			return transition ? asObservable<void>([element, snapshot], transition.callback.bind(instance)) : of(void 0);
		} else {
			return of(void 0);
		}
	}
	static meta: IFactoryMeta = {
		selector: 'router-outlet,[router-outlet]',
		hosts: { host: RouterOutletStructure },
	};
}
