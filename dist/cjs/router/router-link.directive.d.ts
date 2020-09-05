import { Directive, IFactoryMeta } from 'rxcomp';
import { RoutePath } from '../route/route-path';
import { RouteSegment } from '../route/route-segment';
import { RouteComponent, RouterLink } from '../router.types';
export default class RouterLinkDirective extends Directive {
    path: RoutePath;
    segments: RouteSegment[];
    private routerLink_;
    get routerLink(): RouterLink;
    set routerLink(routerLink: RouterLink);
    getSegments(routerLink: RouteComponent[]): RouteSegment[];
    onInit(): void;
    onChanges(): void;
    static meta: IFactoryMeta;
}
