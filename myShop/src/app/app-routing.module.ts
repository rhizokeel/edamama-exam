import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './shared/layout/layout.component';
import { ShopMainPageComponent } from './pages/shop/main/main.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				component: ShopMainPageComponent
			},
			{
				path: 'shop',
				loadChildren: () => import( './pages/shop/shop.module' ).then( m => m.ShopModule )
			},
			{
				path: 'product',
				loadChildren: () => import( './pages/product/product.module' ).then( m => m.ProductModule )
			},
			{
				path: 'pages',
				loadChildren: () => import( './pages/others/pages.module' ).then( m => m.PagesModule )
			}
		]
	},
	{
		path: '**',
		redirectTo: '/pages/404'
	}
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes, { useHash: false, anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' } ) ],
	exports: [ RouterModule ]
} )

export class AppRoutingModule { }