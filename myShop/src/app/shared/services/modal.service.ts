import Cookie from 'js-cookie';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Product } from 'src/app/shared/classes/product';

import { QuickViewComponent } from 'src/app/shared/components/modals/quick-view/quick-view.component';

@Injectable({
	providedIn: 'root'
})

export class ModalService {
	products = [];
	timer: any;

	private modalOption4: NgbModalOptions = {
		centered: true,
		size: 'xl',
		beforeDismiss: async () => {
			document.querySelector('body')?.classList.remove('modal-open');

			await new Promise((resolve) => {
				setTimeout(() => {
					resolve('success');
				}, 300)
			});


			(document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });

			return true;
		}
	};

	constructor(private modalService: NgbModal, private router: Router, private http: HttpClient) {	}

	/**
	 * Show Product in QuickView
	 */
	public showQuickView(product: Product) {
		(document.querySelector('.logo') as HTMLElement).focus({ preventScroll: true });

		const modalRef = this.modalService.open(
			QuickViewComponent,
			{
				...this.modalOption4,
				windowClass: 'quickView-modal'
			}
		);

		modalRef.componentInstance.slug = product.slug;
	}
}