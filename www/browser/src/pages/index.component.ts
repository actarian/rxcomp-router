import { Component, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouteSnapshot } from '../../../../src/router/router.service';
import { RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class IndexComponent extends Component {
    onInit() {
        (this.host.route as RouteSnapshot).data$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((data) => this.title = data.title);
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
