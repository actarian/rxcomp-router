import { Component } from 'rxcomp';
import { ICanActivate, ICanActivateChild, ICanDeactivate, ICanLoad, RouterActivatorResult, RouteSegment, RouteSnapshot } from '../../../../src/rxcomp-router';

export class CustomActivator implements ICanActivate, ICanDeactivate<Component>, ICanActivateChild, ICanLoad {
	canDeactivate<T>(component: T, currentRoute: RouteSnapshot): RouterActivatorResult {
		// console.log('canDeactivate', component, currentRoute);
		return true;
	}
	canLoad(route: RouteSnapshot, segments: RouteSegment[]): RouterActivatorResult {
		// console.log('canLoad', route, segments);
		return true;
	}
	canActivate(route: RouteSnapshot): RouterActivatorResult {
		// console.log('canActivate', route);
		return ['/dashboard'];
	}
	canActivateChild(childRoute: RouteSnapshot): RouterActivatorResult {
		// console.log('canActivateChild', childRoute);
		return childRoute.path === 'media' ? ['files'] : true;
	}
}

export const customActivator: CustomActivator = new CustomActivator();
