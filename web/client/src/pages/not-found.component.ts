import { Component, IFactoryMeta } from 'rxcomp';
import { RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class NotFoundComponent extends Component {
	host!: RouterOutletStructure;
	onInit() {
		// console.log('NotFoundComponent.onInit');
		document.title = 'Page Not Found';
	}
	static meta: IFactoryMeta = {
		selector: '[not-found-component]',
		template: /* html */`
        <div class="page-not-found">
            <div class="title">Not Found</div>
        </div>
        `,
	};
}
