import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/shared/classes/product';

import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
	selector: 'product-detail-one',
	templateUrl: './detail-one.component.html',
	styleUrls: ['./detail-one.component.scss']
})

export class DetailOneComponent implements OnInit {

	@Input() product: Product;

	qty = 1;

	SERVER_URL = environment.SERVER_URL;

	constructor(
		public cartService: CartService,
		public router: Router) {
	}

	ngOnInit(): void { }

	addCart(event: Event, index = 0) {
		event.preventDefault();

		this.cartService.addToCart(
			this.product, this.qty
		);
	}

	onChangeQty(current: number) {
		this.qty = current;
	}
}