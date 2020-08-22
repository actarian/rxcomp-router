import { Directive, getContext, IFactoryMeta } from 'rxcomp';
import { RoutePath } from '../route/route-path';
import RouterLinkDirective from './router-link.directive';
import RouterService from './router.service';

export default class RouterLinkActiveDirective extends Directive {
    routerLinkActive!: { [key: string]: string } | string;
    keys: string[] = [];
    onChanges() {
        // console.log('RouterLinkActive.onChanges');
        const { node } = getContext(this);
        node.classList.remove.apply(node.classList, this.keys);
        let keys: string[] = [];
        const active = this.isActive();
        if (active) {
            const object = this.routerLinkActive;
            if (typeof object === 'object') {
                for (let key in object) {
                    if (object[key]) {
                        keys.push(key);
                    }
                }
            } else if (typeof object === 'string') {
                keys = object.split(' ').filter(x => x.length);
            }
        }
        node.classList.add.apply(node.classList, keys);
        this.keys = keys;
        // console.log('RouterLinkActive.onChanges', active, keys);
    }
    isActive(): boolean {
        const path: RoutePath = RouterService.getPath(this.host.routerLink);
        const isActive: boolean = path.route?.snapshot != null;
        // console.log('RouterLinkActive.isActive', isActive);
        return isActive;
    }
    static meta: IFactoryMeta = {
        selector: '[routerLinkActive],[[routerLinkActive]]',
        hosts: { host: RouterLinkDirective },
        inputs: ['routerLinkActive'],
    };
}
