import { isPlatformBrowser, WINDOW } from 'rxcomp';
import { Observable, Observer } from 'rxjs';

// !!! change boolean to void
export function transition$(callback: (complete: (result: boolean) => void) => void) {
	return Observable.create(function (observer: Observer<boolean>) {
		// let subscription: Subscription;
		try {
			if (isPlatformBrowser) {
				callback((result: boolean) => {
					observer.next(result);
					observer.complete();
				});
			} else {
				observer.next(true);
				observer.complete();
			}
		} catch (error) {
			observer.error(error);
		}
        /*
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        }
        */
	});
}
// !!! should make transition specific?
export function transitionOnce() {
	sessionStorageSet_('rxcomp_transition_once_', true);
}
export function transitionOnced() {
	return sessionStorageGet_('rxcomp_transition_once_');
}
const MEMORY: { [key: string]: any } = {};
function sessionStorageGet_(key: string): any {
	let value: any;
	try {
		const storage = WINDOW.sessionStorage;
		value = storage.getItem(key) || null;
	} catch (error) {
		value = MEMORY[key];
	}
	return value;
}
function sessionStorageSet_(key: string, value: any): void {
	try {
		const storage = WINDOW.sessionStorage;
		storage.setItem(key, value);
	} catch (error) {
		MEMORY[key] = value;
	}
}
