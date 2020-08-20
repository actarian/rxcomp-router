import { CoreModule, IModuleMeta, Module } from 'rxcomp';
import { RouterModule } from '../../../src/rxcomp-router';
import AppComponent from './app.component';
import { customActivator } from './custom-activator/custom-activator';
import ContactsComponent from './pages/contacts.component';
import DataComponent from './pages/data.component';
import DetailComponent from './pages/detail.component';
import IndexComponent from './pages/index.component';
import NotFoundComponent from './pages/not-found.component';
import SubComponent from './pages/sub.component';

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
					],
					canActivateChild: [customActivator],
				},
				{ path: 'data/:data', component: DataComponent, data: { title: 'Data' } },
				{ path: 'contacts', component: ContactsComponent, data: { title: 'Contacts' }, canActivate: [customActivator] },
				{ path: '**', component: NotFoundComponent },
			]),
		],
		declarations: [
			IndexComponent,
			DataComponent,
			DetailComponent,
			ContactsComponent,
		],
		bootstrap: AppComponent,
	};

}
