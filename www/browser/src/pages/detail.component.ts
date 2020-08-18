import { Component, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouteSnapshot } from '../../../../src/router/router.service';
import { RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class DetailComponent extends Component {
    onInit() {
        (this.host.route as RouteSnapshot).data$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((data) => this.title = data.title);
        (this.host.route as RouteSnapshot).params$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((params) => this.detailId = params.detailId);
    }

    static meta: IFactoryMeta = {
        selector: '[detail-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
        <div class="page-detail">
            <div class="title">Detail {{detailId}}</div>
            <ul class="nav--menu">
                <li><a routerLink="media" routerLinkActive="active">Media</a></li>
                <li><a routerLink="files" routerLinkActive="active">Files</a></li>
            </ul>
            <router-outlet></router-outlet>
        </div>
        `,
    };
}
