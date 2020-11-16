import { Component, IComment, IElement, IFactoryMeta, Structure } from 'rxcomp';
import { Observable } from 'rxjs';
import { RouteSnapshot } from '../route/route-snapshot';
export default class RouterOutletStructure extends Structure {
    private route$_;
    private route_?;
    private factory_?;
    get route(): RouteSnapshot | undefined;
    host?: RouterOutletStructure;
    outlet: IComment;
    element?: IElement;
    instance?: Component;
    onInit(): void;
    onChanges(): void;
    route$(): Observable<RouteSnapshot | undefined>;
    factory$(snapshot: RouteSnapshot | undefined): Observable<void>;
    private onOnce$_;
    private onEnter$_;
    private onLeave$_;
    static meta: IFactoryMeta;
}
