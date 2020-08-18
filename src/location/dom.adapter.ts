let _DOM: DomAdapter = null!;

export function getDOM(): DomAdapter {
    return _DOM;
}

export function setDOM(adapter: DomAdapter) {
    _DOM = adapter;
}

export function setRootDomAdapter(adapter: DomAdapter) {
    if (!_DOM) {
        _DOM = adapter;
    }
}

export abstract class DomAdapter {
    abstract getProperty(el: Element, name: string): any;
    abstract dispatchEvent(el: any, evt: any): any;
    abstract log(error: any): any;
    abstract logGroup(error: any): any;
    abstract logGroupEnd(): any;
    abstract remove(el: any): Node;
    abstract createElement(tagName: any, doc?: any): HTMLElement;
    abstract createHtmlDocument(): HTMLDocument;
    abstract getDefaultDocument(): Document;
    abstract isElementNode(node: any): boolean;
    abstract isShadowRoot(node: any): boolean;
    abstract onAndCancel(el: any, evt: any, listener: any): Function;
    abstract supportsDOMEvents(): boolean;
    abstract getGlobalEventTarget(doc: Document, target: string): any;
    abstract getHistory(): History;
    abstract getLocation(): any;
    abstract getBaseHref(doc: Document): string | null;
    abstract resetBaseElement(): void;
    abstract getUserAgent(): string;
    abstract performanceNow(): number;
    abstract supportsCookies(): boolean;
    abstract getCookie(name: string): string | null;
}
