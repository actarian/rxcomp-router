import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { RouteSegment } from '../route/route-segment';
import RouterService from './router.service';
export default class RouterLinkDirective extends Directive {
    get routerLink() {
        return this.routerLink_;
    }
    set routerLink(routerLink) {
        this.routerLink_ = Array.isArray(routerLink) ? routerLink : [routerLink];
        this.segments = this.getSegments(this.routerLink_);
    }
    getSegments(routerLink) {
        // console.log('RouterLinkDirective.getSegments', routerLink);
        const segments = [];
        routerLink.forEach(item => {
            if (typeof item === 'string') {
                const regExp = /([^:]+)|\:([^\/]+)/g;
                const matches = item.matchAll(regExp);
                const components = [];
                for (let match of matches) {
                    const g1 = match[1];
                    const g2 = match[2];
                    if (g1) {
                        components.push(g1);
                    }
                    else if (g2) {
                        const param = {};
                        param[g2] = null;
                        components.push(param);
                    }
                }
            }
            else {
                segments.push(new RouteSegment('', {}));
            }
        });
        return segments;
    }
    onInit() {
        const { node } = getContext(this);
        const event$ = fromEvent(node, 'click').pipe(shareReplay(1));
        event$.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
            // console.log('RouterLinkDirective', event, this.routerLink);
            // !!! skipLocationChange
            const navigationExtras = {
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
        const routePath = RouterService.getPath(this.routerLink_);
        // console.log('RouterLinkDirective.routePath', routePath);
        node.setAttribute('href', routePath.url);
    }
}
RouterLinkDirective.meta = {
    selector: '[routerLink],[[routerLink]]',
    inputs: ['routerLink'],
};
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
