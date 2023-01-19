import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';

import { StoreService } from './core/store/store.service';
import { UtilsService } from './shared/services/utils.service';

import { RefreshStoreAction } from 'src/app/core/actions/actions';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
	selector: 'myshop-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {

	constructor(
		public store: Store<any>,
		public router: Router,
		public viewPort: ViewportScroller,
		public storeService: StoreService,
		public utilsService: UtilsService,
		public modalService: NgbModal
	) {
		const navigationEnd = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		);

		navigationEnd.pipe(first()).subscribe(() => {
			document.querySelector('body')?.classList.add('loaded');
			var timer = setInterval(() => {
				if( window.getComputedStyle( document.querySelector('body') ).visibility == 'visible') {
					clearInterval(timer);
					$('.owl-carousel').trigger('refresh.owl.carousel');
				}
			}, 300);
		});

		navigationEnd.subscribe((event: any) => {
			this.modalService.dismissAll();
		})
	}

	hideMobileMenu() {
		document.querySelector('body').classList.remove('mmenu-active');
		document.querySelector('html').style.overflowX = 'unset';
	}
}