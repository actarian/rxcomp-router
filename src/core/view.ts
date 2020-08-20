
import { Component, IElement } from 'rxcomp';
import { Observable, of } from 'rxjs';

export default class View extends Component {

    onEnter(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }
    onExit(node: IElement): Observable<boolean> | Promise<boolean> | (() => boolean) | boolean { return of(true); }

}
