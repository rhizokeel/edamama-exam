import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import imagesLoaded from 'imagesloaded';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';

import { ApiService } from 'src/app/shared/services/api.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { sliderOpt } from 'src/app/shared/data';

declare var $: any;

@Component({
	selector: 'myshop-quick-view',
	templateUrl: './quick-view.component.html',
	styleUrls: ['./quick-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class QuickViewComponent implements OnInit {

	@Input() slug = '';
	product: Product;
	loaded = false;
	options = {
		...sliderOpt,
		dots: false,
		nav: false,
		loop: false,
		onTranslate: (e: any) => this.itemChange(e, this)
	}
	selectableGroup = [];
	paddingTop = '100%';
	currentIndex = 0;
	qty = 1;

	SERVER_URL = environment.SERVER_URL;

	@ViewChild('singleSlider') singleSlider: any;

	constructor(
		public apiService: ApiService,
		public cartService: CartService,
		public utilsService: UtilsService,
		public router: Router,
		public el: ElementRef) {
	}

	public trackByFn(index, item) {
		if (!item) return null;
		return item.id;
	}

	ngOnInit(): void {
		this.apiService.getSingleProduct(this.slug, true).subscribe(result => {
			this.product = result.product;

			this.paddingTop = Math.floor((parseFloat(this.product.pictures[0].height.toString()) / parseFloat(this.product.pictures[0].width.toString()) * 1000)) / 10 + '%';

			let self = this;
			imagesLoaded(".quickView-modal").on("done", function () {
				self.loaded = true;
			})
		})
	}

	itemChange(e: any, self: any) {
		document.querySelector('#product-image-gallery').querySelector('.product-gallery-item.active').classList.remove('active');
		document.querySelector('#product-image-gallery').querySelectorAll('.product-gallery-item')[e.item.index].classList.add('active');

		self.currentIndex = e.item.index;
	}

	addCart(event: Event) {
		event.preventDefault();

		this.cartService.addToCart(
			this.product, this.qty
		);
	}

	onChangeQty(current: number) {
		this.qty = current;
	}

	closeQuickView() {
		let modal = document.querySelector('.quickView-modal') as HTMLElement;
		if (modal)
			modal.click();
	}

	changeImage($event: Event, i = 0) {
		this.currentIndex = i;
		this.singleSlider.to(i);
		$event.preventDefault();
	}
}