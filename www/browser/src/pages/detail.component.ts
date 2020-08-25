import 'gsap';
import { IElement, IFactoryMeta } from 'rxcomp';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterKeyValue, transition$, View } from '../../../../src/rxcomp-router';

export default class DetailComponent extends View {
    onInit() {
        console.log('DetailComponent.onInit', this.route);
        combineLatest(this.route.data$, this.route.params$).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe((datas: RouterKeyValue[]) => {
            this.title = datas[0].title;
            this.detailId = datas[1].detailId;
            // this.pushChanges(); // !!not needed;
            // console.log('DetailComponent', datas);
        });
    }
    onEnter(node: IElement) {
        return transition$(complete => {
            gsap.set(node, { opacity: 0 });
            gsap.to(node, {
                opacity: 1,
                duration: 1,
                ease: Power3.easeInOut,
                onComplete: () => {
                    complete(true);
                }
            });
        });
    }
    onExit(node: IElement) {
        return transition$(complete => {
            gsap.set(node, { opacity: 1 });
            gsap.to(node, {
                opacity: 0,
                duration: 1,
                ease: Power3.easeInOut,
                onComplete: () => {
                    complete(true);
                }
            });
        });
    }
    static meta: IFactoryMeta = {
        selector: '[detail-component]',
        template: /* html */`
        <div class="page-detail">
            <div class="title">Detail {{detailId}}</div>
            <ul class="nav--menu">
                <li><a routerLink="media" routerLinkActive="active">Media</a></li>
                <li><a routerLink="files" routerLinkActive="active">Files</a></li>
            </ul>
            <router-outlet></router-outlet>
        </div>
        `,
    };
}
