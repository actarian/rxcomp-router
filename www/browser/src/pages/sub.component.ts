import { Component, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouteSnapshot } from '../../../../src/router/router.service';
import { RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class SubComponent extends Component {
    onInit() {
        (this.host.route as RouteSnapshot).data$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((data) => this.title = data.title);
    }

    static meta: IFactoryMeta = {
        selector: '[sub-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
        <div class="page-sub">
            <div class="title">{{title}}</div>
        </div>
        `,
    };
}
