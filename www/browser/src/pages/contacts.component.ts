import { Component, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouterKeyValue, RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class ContactsComponent extends Component {
    host!: RouterOutletStructure;
    onInit() {
        const route = this.host.route;
        if (route) {
            route.data$.pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe((data: RouterKeyValue) => {
                this.title = data.title;
                // this.pushChanges(); // !!not needed;
                // console.log('ContactsComponent', data);
            });
        }
    }

    static meta: IFactoryMeta = {
        selector: '[contacts-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
        <div class="page-contacts">
            <div class="title">{{title}}</div>
        </div>
        `,
    };
}
