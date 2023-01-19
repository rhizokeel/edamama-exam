import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'src/app/shared/services/api.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { environment } from 'src/environments/environment';

@Component({
	selector: 'myshop-header-search',
	templateUrl: './header-search.component.html',
	styleUrls: ['./header-search.component.scss']
})

export class HeaderSearchComponent implements OnInit, OnDestroy {

	products = [];
	searchTerm = "";
	cat = null;
	suggestions = [];
	timer: any;
	SERVER_URL = environment.SERVER_URL;

	constructor(public activeRoute: ActivatedRoute, public router: Router, public utilsService: UtilsService, public apiService: ApiService) {
	}

	ngOnInit(): void {
		document.querySelector('body').addEventListener('click', this.closeSearchForm);
	}

	ngOnDestroy(): void {
		document.querySelector('body').removeEventListener('click', this.closeSearchForm);
	}

	searchProducts(event: any) {
		this.searchTerm = event.target.value;
		if (this.searchTerm.length > 2) {
			if (this.timer) {
				window.clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				this.apiService.fetchHeaderSearchData(this.searchTerm).subscribe(result => {
					this.suggestions = result.products
				})
			}, 500)
		} else {
			window.clearTimeout(this.timer);
			this.suggestions = [];
		}
	}

	showSearchForm(e: Event) {
		document
			.querySelector('.header .header-search')
			.classList.add('show');
		e.stopPropagation();
	}

	closeSearchForm() {
		document
			.querySelector('.header .header-search')
			.classList.remove('show');
	}

	submitSearchForm(e: Event) {
		e.preventDefault();
		this.router.navigate(['/'], { queryParams: { searchTerm: this.searchTerm } });
	}
}