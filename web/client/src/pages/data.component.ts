import { Component, IFactoryMeta } from 'rxcomp';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterKeyValue, RouterOutletStructure } from '../../../../src/rxcomp-router';

export default class DataComponent extends Component {
	host!: RouterOutletStructure;
	onInit() {
		const route = this.host.route;
		if (route) {
			combineLatest([route.data$, route.params$]).pipe(
				takeUntil(this.unsubscribe$)
			).subscribe((datas: RouterKeyValue[]) => {
				const title = this.title = datas[0].title as string;
				document.title = title;
				this.params = datas[1];
				// this.pushChanges(); // !!not needed;
				// console.log('DataComponent', datas);
			});
		}
        /*
        this.host.route?.data$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((data) => this.title = data.title);
        this.host.route?.params$.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe((params) => this.params = params);
        */
	}
	static meta: IFactoryMeta = {
		selector: '[data-component]',
		hosts: { host: RouterOutletStructure },
		template: /* html */`
        <div class="page-data">
            <div class="title">{{title}}</div>
            <div class="params">{{params | json}}</div>
        </div>
        `,
	};
}
