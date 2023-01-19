import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
@NgModule( {
	declarations: [
		PageNotFoundComponent,
	],

	imports: [
		PagesRoutingModule,
	]
} )

export class PagesModule { }
