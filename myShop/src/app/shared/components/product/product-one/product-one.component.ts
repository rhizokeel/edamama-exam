import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/shared/classes/product';

import { ModalService } from 'src/app/shared/services/modal.service';
import { CartService } from 'src/app/shared/services/cart.service';

import { environment } from 'src/environments/environment';

@Component({
	selector: 'myshop-product-one',
	templateUrl: './product-one.component.html',
	styleUrls: ['./product-one.component.scss']
})

export class ProductOneComponent implements OnInit {

	@Input() product: Product;

	SERVER_URL = environment.SERVER_URL;

	constructor(
		private router: Router,
		private modalService: ModalService,
		private cartService: CartService,
	) { }

	ngOnInit(): void { }

	addToCart(event: Event) {
		event.preventDefault();
		this.cartService.addToCart(this.product);
	}


	quickView(event: Event) {
		event.preventDefault();
		this.modalService.showQuickView(this.product);
	}
}