import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartComponent } from './cart/cart.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/'
	},
	{
		path: 'cart',
		component: CartComponent
	}
];

@NgModule( {
	imports: [ RouterModule.forChild( routes ) ],
	exports: [ RouterModule ]
} )



export class ShopRoutingModule { };