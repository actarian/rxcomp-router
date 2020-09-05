import { Directive, IFactoryMeta } from 'rxcomp';
export default class RouterLinkActiveDirective extends Directive {
    routerLinkActive: {
        [key: string]: string;
    } | string;
    keys: string[];
    onChanges(): void;
    isActive(): boolean;
    static meta: IFactoryMeta;
}
