import { isObservable, Observable, Observer, Subscription } from "rxjs";

export function asObservable<T>(args: any[], callback: (...args: any[]) => Observable<T> | Promise<T> | (() => T) | T): Observable<T> {
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
export function isPromise<T>(object: any): object is Promise<T> {
	return object instanceof Promise || (typeof object === 'object' && 'then' in object && typeof object['then'] === 'function');
}
