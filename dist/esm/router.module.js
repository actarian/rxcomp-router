import { Module } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import { NavigationCancel, NavigationEnd, NavigationError } from './router/router-events';
import RouterLinkActiveDirective from './router/router-link-active.directive';
import RouterLinkDirective from './router/router-link.directive';
import RouterOutletStructure from './router/router-outlet.structure';
import RouterService from './router/router.service';
const factories = [
    RouterOutletStructure,
    RouterLinkDirective,
    RouterLinkActiveDirective,
];
const pipes = [];
/**
 *  RouterModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *   RouterModule.forRoot([
 *    { path: '', redirectTo: '/index', pathMatch: 'full' },
 *    { path: 'index', component: IndexComponent, data: { title: 'Index' } }
 *   ])
 *  ],
 *  declarations: [
 *   IndexComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */
export default class RouterModule extends Module {
    constructor() {
        super();
        // console.log('RouterModule');
        RouterService.observe$.pipe(tap((event) => {
            var _a;
            if (event instanceof NavigationEnd
                || event instanceof NavigationCancel
                || event instanceof NavigationError) {
                if ((_a = this.instances) === null || _a === void 0 ? void 0 : _a.length) {
                    const root = this.instances[0];
                    root.pushChanges();
                }
            }
        }), takeUntil(this.unsubscribe$)).subscribe();
        RouterService.navigate(`${location.pathname === '' ? '/' : location.pathname}${location.search}${location.hash}`);
    }
    static forRoot(routes) {
        RouterService.setRoutes(routes);
        return this;
    }
    static useStrategy(locationStrategyType) {
        RouterService.useLocationStrategy(locationStrategyType);
        return this;
    }
}
RouterModule.meta = {
    declarations: [
        ...factories,
        ...pipes,
    ],
    exports: [
        ...factories,
        ...pipes,
    ]
};
