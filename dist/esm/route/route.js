import { mapCanActivate$_, mapCanActivateChild$_, mapCanDeactivate$_, mapCanLoad$_ } from './route-activators';
import { RouteSegment } from './route-segment';
export class Route {
    constructor(options) {
        this.pathMatch = 'prefix';
        this.relative = true;
        this.canDeactivate = [];
        this.canLoad = [];
        this.canActivate = [];
        this.canActivateChild = [];
        if (options) {
            Object.assign(this, options);
            this.canDeactivate = options.canDeactivate ? options.canDeactivate.map(x => mapCanDeactivate$_(x)) : [];
            this.canLoad = options.canLoad ? options.canLoad.map(x => mapCanLoad$_(x)) : [];
            this.canActivate = options.canActivate ? options.canActivate.map(x => mapCanActivate$_(x)) : [];
            this.canActivateChild = options.canActivateChild ? options.canActivateChild.map(x => mapCanActivateChild$_(x)) : [];
        }
        if (this.children) {
            this.children = this.children.map((iRoute) => {
                const route = new Route(iRoute);
                route.parent = this;
                return route;
            });
        }
        const segments = [];
        if (this.path === '**') {
            segments.push(new RouteSegment(this.path));
            this.matcher = new RegExp('^.*$');
        }
        else {
            const matchers = [`^(\.\.\/|\.\/|\/\/|\/)?`];
            const regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
            const matches = this.path.matchAll(regExp);
            for (let match of matches) {
                const g1 = match[1];
                const g2 = match[2];
                const g3 = match[3];
                if (g1) {
                    this.relative = !(g1 === '//' || g1 === '/');
                }
                else if (g2) {
                    matchers.push(g2);
                    segments.push(new RouteSegment(g2));
                }
                else if (g3) {
                    matchers.push('(\/[^\/]+)');
                    const param = {};
                    param[g3] = null;
                    segments.push(new RouteSegment('', param));
                }
            }
            if (this.pathMatch === 'full') {
                matchers.push('$');
            }
            const regexp = matchers.join('');
            this.matcher = new RegExp(regexp);
        }
        this.segments = segments;
    }
}
