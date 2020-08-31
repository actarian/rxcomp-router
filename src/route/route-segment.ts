import { RouterKeyValue } from '../router.types';

export class RouteSegment {
	path: string;
	params: any;
	constructor(path: string, params: RouterKeyValue = {}) {
		this.path = path;
		this.params = params;
	}
}
