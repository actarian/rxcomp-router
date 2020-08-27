
import { Component, IElement } from 'rxcomp';
import { Observable, of } from 'rxjs';
import { RouteSnapshot } from '../route/route-snapshot';

export default class View extends Component {
	route!: RouteSnapshot;
	onEnter(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }
	onExit(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }
}
