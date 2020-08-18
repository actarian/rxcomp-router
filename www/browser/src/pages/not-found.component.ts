import { Component, IFactoryMeta } from 'rxcomp';

export default class NotFoundComponent extends Component {
    onInit() {
        // console.log('NotFoundComponent.onInit');
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
