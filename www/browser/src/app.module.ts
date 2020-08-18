import { Component, CoreModule, IModuleMeta, Module } from 'rxcomp';
import { Route } from '../../../src/route/route';
import { ICanActivate, ICanActivateChild, ICanDeactivate, ICanLoad } from '../../../src/route/route-activators';
import { RouteSegment } from '../../../src/route/route-segment';
import { RouteSnapshot } from '../../../src/route/route-snapshot';
import { RouterActivatorResult } from '../../../src/router.types';
import { RouterModule } from '../../../src/rxcomp-router';
import AppComponent from './app.component';
import ContactsComponent from './pages/contacts.component';
import DetailComponent from './pages/detail.component';
import IndexComponent from './pages/index.component';
import NotFoundComponent from './pages/not-found.component';
import SubComponent from './pages/sub.component';

export class CustomActivator implements ICanActivate, ICanDeactivate<Component>, ICanActivateChild, ICanLoad {
	canDeactivate<T>(component: T, currentRoute: RouteSnapshot): RouterActivatorResult {
		return true;
	}
	canLoad(route: Route, segments: RouteSegment[]): RouterActivatorResult {
		return true;
	}
	canActivate(route: RouteSnapshot): RouterActivatorResult {
		console.log('canActivate', route);
		return false;
	}
	canActivateChild(childRoute: RouteSnapshot): RouterActivatorResult {
		return true;
	}
}

export default class AppModule extends Module {

	static meta: IModuleMeta = {
		imports: [
			CoreModule,
			RouterModule.forRoot([
				{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
				{ path: 'dashboard', component: IndexComponent, data: { title: 'Dashboard' } },
				{
					path: 'detail/:detailId', component: DetailComponent, data: { title: 'Detail' },
					children: [
						{ path: 'media', component: SubComponent, data: { title: 'Media' } },
						{ path: 'files', component: SubComponent, data: { title: 'Files' } }
					]
				},
				{ path: 'contacts', component: ContactsComponent, data: { title: 'Contacts' }, canActivate: [new CustomActivator()] },
				{ path: '**', component: NotFoundComponent },
			]),
		],
		declarations: [
			IndexComponent,
			DetailComponent,
			ContactsComponent,
		],
		bootstrap: AppComponent,
	};

}
