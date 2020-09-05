import { IModuleMeta, Module } from 'rxcomp';
import { LocationStrategy } from './location/location.strategy';
import { IRoute } from './route/route';
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
    constructor();
    static meta: IModuleMeta;
    static forRoot(routes: IRoute[]): typeof RouterModule;
    static useStrategy(locationStrategyType: typeof LocationStrategy): typeof RouterModule;
}
