import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare var $: any;

@Injectable({
	providedIn: 'root'
})

export class UtilsService {

	constructor(@Inject(DOCUMENT) private document) {
	}

	/**
	 * Scrolling to Page content section
	 */
	scrollToPageContent(target = '.page-content') {
		let to = (document.querySelector(target) as HTMLElement).offsetTop - 74;
		window.scrollTo({
			top: to,
			behavior: 'smooth'
		});		
	}

	/**
	 * Scroll Top Button
	 * @param e 
	 */
	scrollTop(e: Event) {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
		
		e.preventDefault();
	}
}