import { Component, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouterKeyValue, RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class IndexComponent extends Component {
    host!: RouterOutletStructure;
    onInit() {
        const route = this.host.route;
        if (route) {
            route.data$.pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe((data: RouterKeyValue) => {
                this.title = data.title;
                // this.pushChanges(); // !!not needed;
                // console.log('IndexComponent', data);
            });
        }
    }
    static meta: IFactoryMeta = {
        selector: '[index-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
        <div class="page-index">
            <div class="title">{{title}}</div>
        </div>
        `,
    };
}
