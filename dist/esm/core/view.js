import { Component } from 'rxcomp';
import { of } from 'rxjs';
export default class View extends Component {
    onEnter(node) { return of(true); }
    onExit(node) { return of(true); }
}
