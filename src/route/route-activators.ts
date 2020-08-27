import { isObservable, Observable, Observer, Subscription } from 'rxjs';
import { RouteComponent, RouterActivatorResult } from '../router.types';
import { RouteSegment } from './route-segment';
import { RouteSnapshot } from './route-snapshot';

export interface ICanDeactivate<T> {
	canDeactivate(component: T, currentRoute: RouteSnapshot): RouterActivatorResult
}

export interface ICanLoad {
	canLoad(route: RouteSnapshot, segments: RouteSegment[]): RouterActivatorResult
}

export interface ICanActivate {
	canActivate(route: RouteSnapshot): RouterActivatorResult
}

export interface ICanActivateChild {
	canActivateChild(childRoute: RouteSnapshot): RouterActivatorResult
}

export function mapCanDeactivate$_<T>(activator: ICanDeactivate<T>): (component: T, currentRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]> {
	return function canDeactivate$(component: T, currentRoute: RouteSnapshot): Observable<boolean | RouteComponent[]> {
		return makeObserver$_(() => activator.canDeactivate(component, currentRoute));
	};
}
export function mapCanLoad$_(activator: ICanLoad): (route: RouteSnapshot, segments: RouteSegment[]) => Observable<boolean | RouteComponent[]> {
	return function canLoad$$(route: RouteSnapshot, segments: RouteSegment[]): Observable<boolean | RouteComponent[]> {
		return makeObserver$_(() => activator.canLoad(route, segments));
	};
}
export function mapCanActivate$_(activator: ICanActivate): (route: RouteSnapshot) => Observable<boolean | RouteComponent[]> {
	return function canActivate$(route: RouteSnapshot): Observable<boolean | RouteComponent[]> {
		return makeObserver$_(() => activator.canActivate(route));
	};
}
export function mapCanActivateChild$_(activator: ICanActivateChild): (childRoute: RouteSnapshot) => Observable<boolean | RouteComponent[]> {
	return function canActivateChild$(childRoute: RouteSnapshot): Observable<boolean | RouteComponent[]> {
		return makeObserver$_(() => activator.canActivateChild(childRoute));
	};
}
export function isPromise<T>(object: any): object is Promise<T> {
	return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}

function makeObserver$_(callback: () => RouterActivatorResult) {
	return Observable.create(function (observer: Observer<boolean | RouteComponent[]>) {
		let subscription: Subscription;
		try {
			let result: RouterActivatorResult = callback();
			if (isObservable(result)) {
				subscription = result.subscribe(result => {
					observer.next(result);
					observer.complete();
				});
			} else if (isPromise<boolean | RouteComponent[]>(result)) {
				(result as Promise<boolean | RouteComponent[]>).then(result => {
					observer.next(result);
					observer.complete();
				});
			} else if (typeof result === 'boolean' || Array.isArray(result)) {
				observer.next(result);
				observer.complete();
			} else {
				observer.error(new Error('invalid value'));
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

