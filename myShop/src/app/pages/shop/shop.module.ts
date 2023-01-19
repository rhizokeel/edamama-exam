import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';
import { NouisliderModule } from 'ng2-nouislider';

import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ShopMainPageComponent } from './main/main.component';
import { CartComponent } from './cart/cart.component';
import { ShopListOneComponent } from './shared/list/shop-list-one/shop-list-one.component';

@NgModule( {
	declarations: [
		ShopMainPageComponent,
		CartComponent,
		ShopListOneComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		ShopRoutingModule,
		RouterModule,
		NgbModule,
		OwlModule,
		NouisliderModule
	]
} )

export class ShopModule { }
