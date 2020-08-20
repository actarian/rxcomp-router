import { Factory, IModuleMeta, Module, Pipe } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import { IRoute } from './route/route';
import { NavigationCancel, NavigationEnd, NavigationError, RouterEvent } from './router/router-events';
import RouterLinkActiveDirective from './router/router-link-active.directive';
import RouterLinkDirective from './router/router-link.directive';
import RouterOutletStructure from './router/router-outlet.structure';
import RouterService from './router/router.service';

const factories: typeof Factory[] = [
	RouterOutletStructure,
	RouterLinkDirective,
	RouterLinkActiveDirective,
];

const pipes: typeof Pipe[] = [
];

/**
 *  RouterModule Class.
 * @example
 * export default class AppModule extends Module {}
 *
 * AppModule.meta = {
 *  imports: [
 *   CoreModule,
 *    RouterModule
 *  ],
 *  declarations: [
 *   ErrorsComponent
 *  ],
 *  bootstrap: AppComponent,
 * };
 * @extends Module
 */
export default class RouterModule extends Module {
	constructor() {
		super();
		// console.log('RouterModule');
		RouterService.observe$.pipe(
			tap((event: RouterEvent) => {
				if (event instanceof NavigationEnd
					|| event instanceof NavigationCancel
					|| event instanceof NavigationError) {
					if (this.instances?.length) {
						const root = this.instances[0];
						root.pushChanges();
					}
				}
			}),
			takeUntil(this.unsubscribe$),
		).subscribe();
		RouterService.navigate(window.location.pathname + window.location.search + window.location.hash);
	}

	static meta: IModuleMeta = {
		declarations: [
			...factories,
			...pipes,
		],
		exports: [
			...factories,
			...pipes,
		]
	};

	static forRoot(routes: IRoute[]): typeof RouterModule {
		RouterService.setRoutes(routes);
		return RouterModule;
	}
}
