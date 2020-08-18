import { Component, Factory, getContext, IComment, IElement, IFactoryMeta, Structure } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { RouteSnapshot } from '../route/route-snapshot';
import RouterService from './router.service';

export default class RouterOutletStructure extends Structure {
    static first: boolean = false;

    outlet!: IComment;
    element?: IElement;
    instance?: Component;
    private route_?: RouteSnapshot;
    get route(): RouteSnapshot | undefined {
        return this.route_;
    }
    set route(route: RouteSnapshot | undefined) {
        if (this.route_ && route && this.route_.component === route.component) {
            this.route_.next(route);
            // } else if (this.route_?.component !== route?.component) {
        } else {
            this.route_ = route;
            this.component = route?.component;
        }
    }

    private component_?: typeof Component;
    get component(): typeof Component | undefined {
        return this.component_;
    }
    set component(component: typeof Component | undefined) {
        const { module, node } = getContext(this);
        if (true || this.component_ !== component) { // !!! fix
            this.component_ = component;
            if (this.element) {
                this.element.parentNode!.removeChild(this.element);
                module.remove(this.element, this);
                this.element = undefined;
                this.instance = undefined;
            }
            if (component && component.meta.template) {
                let element: IElement = document.createElement('div');
                element.innerHTML = component.meta.template;
                if (element.children.length === 1) {
                    element = element.firstElementChild as IElement;
                }
                node.appendChild(element);
                const instance: Factory | undefined = module.makeInstance(element, component, component.meta.selector!, this);
                module.compile(element, instance);
                this.instance = instance;
                this.element = element;
                /*
                if (instance) {
                    // const forItemContext = getContext(instance);
                    // console.log('ForStructure', clonedNode, forItemContext.instance.constructor.name);
                    // module.compile(clonedNode, forItemContext.instance);
                    // node.appendChild(element);
                    // nextSibling = clonedNode.nextSibling;
                    // this.instance = instance;
                    // this.element = element;
                    // this.outlet.parentNode?.insertBefore(element, this.outlet);
                }
                */
            }
        }
    }

    onInit() {
        if (!this.host) {
            RouterService.route$.pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe(route => {
                this.route = route;
                this.pushChanges();
            });
        }
        /*
        const { node } = getContext(this);
        const outlet: IComment = this.outlet = document.createComment(`outlet`);
        outlet.rxcompId = node.rxcompId;
        node.parentNode!.replaceChild(outlet, node);
        */
    }

    onChanges() {
        if (this.host) {
            this.route = this.host.route.childRoute;
            // console.log('RouterOutletStructure.onChanges', this.route);
        }
    }

    static meta: IFactoryMeta = {
        selector: 'router-outlet,[router-outlet]',
        hosts: { host: RouterOutletStructure },
    };
}
