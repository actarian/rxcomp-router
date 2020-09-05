import { isPlatformBrowser } from 'rxcomp';
import { Observable } from 'rxjs';
export function transition$(callback) {
    return Observable.create(function (observer) {
        // let subscription: Subscription;
        try {
            if (isPlatformBrowser) {
                callback((result) => {
                    observer.next(result);
                    observer.complete();
                });
            }
            else {
                observer.next(true);
                observer.complete();
            }
        }
        catch (error) {
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
