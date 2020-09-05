export class RouteSegment {
    constructor(path, params = {}) {
        this.path = path;
        this.params = params;
    }
}
