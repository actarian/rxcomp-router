import { isPlatformBrowser } from 'rxcomp';
import { Observable, Observer } from 'rxjs';

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