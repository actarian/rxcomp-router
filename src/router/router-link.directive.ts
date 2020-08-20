import { Directive, getContext, IFactoryMeta } from 'rxcomp';
import { fromEvent, Observable } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { INavigationExtras } from '../route/route';
import { RoutePath } from '../route/route-path';
import { RouteSegment } from '../route/route-segment';
import { RouteComponent, RouterLink } from '../router.types';
import RouterService from './router.service';

export default class RouterLinkDirective extends Directive {

    segments!: RouteSegment[];
    private routerLink_!: RouteComponent[];
    get routerLink(): RouterLink {
        return this.routerLink_;
    }
    set routerLink(routerLink: RouterLink) {
        this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
        this.segments = this.getSegments(this.routerLink_);
    }

    getSegments(routerLink: RouteComponent[]): RouteSegment[] {
        // console.log('RouterLinkDirective.getSegments', routerLink);
        const segments: RouteSegment[] = [];
        routerLink.forEach(item => {
            if (typeof item === 'string') {
                const regExp: RegExp = /([^:]+)|\:([^\/]+)/g;
                const matches = item.matchAll(regExp);
                const components = [];
                for (let match of matches) {
                    const g1 = match[1];
                    const g2 = match[2];
                    if (g1) {
                        components.push(g1);
                    } else if (g2) {
                        const param: { [key: string]: any } = {};
                        param[g2] = null;
                        components.push(param);
                    }
                }
            } else {
                segments.push(new RouteSegment('', {}));
            }
        });
        return segments;
    }

    /*
    get urlTree(): UrlTree {
        return RouterService.createUrlTree(this.routerLink, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: this.preserve,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
        });
    }
    */

    onInit() {
        const { node } = getContext(this);
        const event$: Observable<Event> = fromEvent<Event>(node, 'click').pipe(shareReplay(1));
        event$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(event => {
            // console.log('RouterLinkDirective', event, this.routerLink);
            // !!! skipLocationChange
            const navigationExtras: INavigationExtras = {
                skipLocationChange: this.skipLocationChange,
                replaceUrl: this.replaceUrl,
                state: this.state,
            };
            RouterService.setRouterLink(this.routerLink, navigationExtras);
            event.preventDefault();
            return false;
        });
    }

    onChanges() {
        const { node } = getContext(this);
        const routePath: RoutePath = RouterService.getPath(this.routerLink_);
        node.setAttribute('href', routePath.url);
    }

    static meta: IFactoryMeta = {
        selector: '[routerLink],[[routerLink]]',
        inputs: ['routerLink'],
    };
}
