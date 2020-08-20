import { Observable, Observer } from 'rxjs';

export function transition$(callback: (complete: (result: boolean) => void) => void, delay = 350) {
    return Observable.create(function (observer: Observer<boolean>) {
        // let subscription: Subscription;
        try {
            callback((result: boolean) => {
                // setTimeout(() => {
                observer.next(result);
                observer.complete();
                // }, delay);
            });
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