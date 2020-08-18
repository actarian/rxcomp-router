import { RouterKeyValue } from '../router.types';

export class RouteSegment {
    path: string;
    params: any;
    constructor(path: string, params: RouterKeyValue = {}) {
        this.path = path;
        this.params = params;
    }
    toString(): string {
        return `${encodeSegment_(this.path)}${encodeParams_(this.params)}`;
    }
}

export function encodeParams_(params: RouterKeyValue): string {
    return Object.keys(params).map(key => `;${encodeSegment_(key)}=${encodeSegment_(params[key])}`).join('');
}

export function encodeSegment_(s: string): string {
    return encodeString_(s).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}

export function encodeString_(s: string): string {
    return encodeURIComponent(s).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
