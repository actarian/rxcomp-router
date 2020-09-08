import { Component, errors$, getContext, IFactoryMeta } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';

export default class AppComponent extends Component {
	error: any = null;
	onInit() {
		// console.log('AppComponent.onInit', this);
		const { node } = getContext(this);
		node.classList.add('init');
		errors$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(error => {
			this.error = error;
			this.pushChanges();
		});
	}
	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};
}
