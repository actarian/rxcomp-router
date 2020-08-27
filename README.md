# 💎 RxComp RouterModule

[![Licence](https://img.shields.io/github/license/actarian/rxcomp-router.svg)](https://github.com/actarian/rxcomp-router)

[RxComp Router](https://github.com/actarian/rxcomp-router) module for [RxComp](https://github.com/actarian/rxcomp), developed with [RxJs](https://github.com/ReactiveX/rxjs).

 lib & dependancy    | size
:--------------------|:----------------------------------------------------------------------------------------------|
rxcomp-router.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-router@1.0.0-beta.11/dist/umd/rxcomp-router.min.js.svg?compression=gzip)
rxcomp-router.min.js   | ![](https://img.badgesize.io/https://unpkg.com/rxcomp-router@1.0.0-beta.11/dist/umd/rxcomp-router.min.js.svg)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.13/dist/umd/rxcomp.min.js.svg?compression=gzip)
rxcomp.min.js        | ![](https://img.badgesize.io/https://unpkg.com/rxcomp@1.0.0-beta.13/dist/umd/rxcomp.min.js.svg)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg?compression=gzip)
rxjs.min.js          | ![](https://img.badgesize.io/https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js.svg)
 
> [RxComp Router Demo](https://actarian.github.io/rxcomp-router/)  
> [RxComp Router Api](https://actarian.github.io/rxcomp-router/api/)  

![](https://rawcdn.githack.com/actarian/rxcomp-router/master/docs/img/rxcomp-router-demo.jpg?token=AAOBSISYZJXZNFFWAPGOLYC7DQKIO)  

___
## Installation and Usage

### ES6 via npm
This library depend on [RxComp](https://github.com/actarian/rxcomp) and [RxJs](https://github.com/ReactiveX/rxjs)  
install via npm or include via script   

```
npm install rxjs rxcomp rxcomp-router --save
```
___
### CDN

For CDN, you can use unpkg

```html
<script src="https://unpkg.com/rxjs@6.6.2/bundles/rxjs.umd.min.js" crossorigin="anonymous" SameSite="none Secure"></script>
<script src="https://unpkg.com/rxcomp@1.0.0-beta.13/dist/umd/rxcomp.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
<script src="https://unpkg.com/rxcomp-router@1.0.0-beta.11/dist/umd/rxcomp-router.min.js" crossorigin="anonymous" SameSite="none Secure"></script>  
```

The global namespace for RxComp is `rxcomp`

```javascript
import { CoreModule, Module } from 'rxcomp';
```

The global namespace for RxComp RouterModule is `rxcomp.router`


### Bootstrapping Module

```javascript
import { Browser, CoreModule, Module } from 'rxcomp';
import { RouterModule } from 'rxcomp-router';
import AppComponent from './app.component';

export default class AppModule extends Module {}

AppModule.meta = {
  imports: [
    CoreModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: IndexComponent, data: { title: 'Dashboard' } },
      {
        path: 'detail/:detailId', component: DetailComponent, data: { title: 'Detail' },
        children: [
          { path: 'media', component: SubComponent, data: { title: 'Media' } },
          { path: 'files', component: SubComponent, data: { title: 'Files' } }
        ], canActivateChild: [customActivator],
      },
      { path: 'data/:data', component: DataComponent, data: { title: 'Data' } },
      { path: 'contacts', component: ContactsComponent, data: { title: 'Contacts' }, canActivate: [customActivator] },
      { path: '**', component: NotFoundComponent },
    ]),
  ],
  declarations: [
    IndexComponent,
    DataComponent,
    DetailComponent,
    ContactsComponent,
  ],
  bootstrap: AppComponent,
};

Browser.bootstrap(AppModule);
```
___
### Location Strategy
You can change the default location strategy using the `LocationStrategyHash` class.  

```js
RouterModule.forRoot([
  { path: '', redirectTo: '/index', pathMatch: 'full' },
]).useStrategy(LocationStrategyHash),
```
___
### Router events
You can subscribe to router events.
```js
RouterService.observe$.pipe(
  tap((event: RouterEvent) => {
    if (event instanceof NavigationEnd
      || event instanceof NavigationCancel
      || event instanceof NavigationError) {
      console.log(event);
    }
  }),
  takeUntil(this.unsubscribe$),
).subscribe();

```

 event name          | description
:--------------------|:----------------------------------------------------------------------------------------------|
 NavigationStart     | An event triggered when navigation starts.
 RoutesRecognized    | An event triggered when the Router parses the URL and the routes are recognized.
 GuardsCheckStart    | An event triggered at the start of the Guard phase of routing.
 ChildActivationStart| An event triggered at the start of the child-activation part of the Resolve phase of routing.
 ActivationStart     | An event triggered at the start of the activation part of the Resolve phase of routing.
 GuardsCheckEnd      | An event triggered at the end of the Guard phase of routing.
 ResolveStart        | An event triggered at the the start of the Resolve phase of routing.
 ResolveEnd          | An event triggered at the end of the Resolve phase of routing.
 ActivationEnd       | An event triggered at the end of the activation part of the Resolve phase of routing.
 ChildActivationEnd  | An event triggered at the end of the child-activation part of the Resolve phase of routing.
 RouteConfigLoadStart| An event triggered before the Router lazy loads a route configuration.
 RouteConfigLoadEnd  | An event triggered after a route has been lazy loaded.
 NavigationEnd       | An event triggered when navigation ends successfully.
 NavigationCancel    | An event triggered when navigation is canceled. This is due to a Route Guard returning false during navigation.
 NavigationError     | An event triggered when navigation fails due to an unexpected error.

___
### Inspecting route
You can inspect the current activated route `data$` or `params$` from the host `RouterOutlet`.  
```ts
export default class DetailComponent extends Component {
    host!: RouterOutletStructure;
    onInit() {
        this.host.route.data$.subscribe(data => {
          this.detailId = data.detailId;
        });
    }
    static meta: IFactoryMeta = {
        selector: '[detail-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
          <div class="title">Detail {{detailId}}</div>
        `,
    };
}
```
___
### Route Guards
You can implement your custom route guards. There are four type of guards:  
`canDeactivate`, `canLoad`, `canActivate` and `canActivateChild`.  
```ts
export class UserLogged implements ICanActivate {
    canActivate(route: RouteSnapshot): RouterActivatorResult {
        return isLogged ? true : ['/login'];
    }
}

RouterModule.forRoot([
  { path: 'me', component: UserComponent, canActivate: [UserLogged] },
]),
```
___
### View component
Extending the `View` component you obtain two new lifecycle methods: 
`onEnter` and `onExit`. Both methods have this return type and should return a boolean value.   
```ts
Observable<boolean> | Promise<boolean> | (() => boolean) | boolean;
```
```ts

export default class DetailComponent extends View {
    host!: RouterOutletStructure;
    onEnter(node: IElement) {
      return true;
    }
    onExit(node: IElement) {
      return true;
    }
    static meta: IFactoryMeta = {
        selector: '[detail-component]',
        hosts: { host: RouterOutletStructure },
        template: /* html */`
          <div class="title">Detail {{detailId}}</div>
        `,
    };
}
```
___
### Transitions
You can then use the `transition$` observable to implement custom animations.
```ts
import { transition$, View } from 'rxcomp-router';

export default class DetailComponent extends View {
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
}
```
___
### Browser Compatibility
RxComp supports all browsers that are [ES5-compliant](http://kangax.github.io/compat-table/es5/) (IE8 and below are not supported).
___
## Contributing

*Pull requests are welcome and please submit bugs 🐞*
___
### Install packages
```
npm install
```
___
### Build, Serve & Watch 
```
gulp
```
___
### Build Dist
```
gulp build --target dist
```
___
*Thank you for taking the time to provide feedback and review. This feedback is appreciated and very helpful 🌈*

[![GitHub forks](https://img.shields.io/github/forks/actarian/rxcomp.svg?style=social&label=Fork&maxAge=2592000)](https://gitHub.com/actarian/rxcomp/network/)  [![GitHub stars](https://img.shields.io/github/stars/actarian/rxcomp.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/actarian/rxcomp/stargazers/)  [![GitHub followers](https://img.shields.io/github/followers/actarian.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/actarian?tab=followers)

* [Github Project Page](https://github.com/actarian/rxcomp)  

*If you find it helpful, feel free to contribute in keeping this library up to date via [PayPal](https://www.paypal.me/circledev/5)*

[![PayPal](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.me/circledev/5)  

___
## Contact

* Luca Zampetti <lzampetti@gmail.com>
* Follow [@actarian](https://twitter.com/actarian) on Twitter

[![Twitter Follow](https://img.shields.io/twitter/follow/actarian.svg?style=social&label=Follow%20@actarian)](https://twitter.com/actarian)  

___
## Release Notes
Changelog [here](https://github.com/actarian/rxcomp-router/blob/master/CHANGELOG.md).
