import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';
import { LazyLoadImageModule } from 'ng-lazyload-image';

// Header Element
import { CartMenuComponent } from './components/headers/shared/cart-menu/cart-menu.component';
import { HeaderSearchComponent } from './components/headers/shared/header-search/header-search.component';
import { MobileButtonComponent } from './components/headers/shared/mobile-button/mobile-button.component';
import { MobileMenuComponent } from './components/headers/shared/mobile-menu/mobile-menu.component';

// Header Component
import { HeaderComponent } from './components/headers/header/header.component';

// // Product Component
import { ProductOneComponent } from './components/product/product-one/product-one.component';

// // Page Element
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';

// Product Element
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';

// // single use component
import { QuickViewComponent } from './components/modals/quick-view/quick-view.component';
import { ImageComponent } from './components/image/image.component';

@NgModule({
	declarations: [
		// header
		CartMenuComponent,
		HeaderSearchComponent,
		MobileButtonComponent,
		MobileMenuComponent,

		HeaderComponent,

		// product
		ProductOneComponent,

		// single-use components
		BreadcrumbComponent,
		PageHeaderComponent,
		QuickViewComponent,
		QuantityInputComponent,
		PaginationComponent,
		ImageComponent,
	],

	imports: [
		CommonModule,
		RouterModule,
		NgbModule,
		TranslateModule,
		OwlModule,
		LazyLoadImageModule,
	],

	exports: [
		// header
		HeaderComponent,

		// mobile-menu
		MobileMenuComponent,

		// product
		ProductOneComponent,

		// // single-use components
		BreadcrumbComponent,
		PageHeaderComponent,
		PaginationComponent,
		QuantityInputComponent,
		ImageComponent,
	],

	entryComponents: [
		QuickViewComponent,
	]
})

export class SharedModule { }