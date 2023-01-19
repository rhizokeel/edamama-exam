import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ApiService {

	constructor(private http: HttpClient) {
	}

	/**
	 * Get Products
	 */
	public fetchShopData(params: any, perPage: number, initial = 'shop'): Observable<any> {
		let temp = initial;
		if (!initial.includes('?')) {
			temp += '?';
		}

		for (let key in params) {
			temp += key + '=' + params[key] + '&';
		}

		if (!params.page) {
			temp += 'page=1';
		}

		if (!params.perPage) {
			temp += '&perPage=' + perPage;
		}

		return this.http.get(`${environment.SERVER_URL}/${temp}`);
	}

	/**
	 * Get Products
	 */
	public fetchBlogData(params: any, initial = 'blogs/classic', perPage: number,): Observable<any> {
		let temp = initial;
		if (!initial.includes('?')) {
			temp += '?';
		}

		for (let key in params) {
			temp += key + '=' + params[key] + '&';
		}

		if (!params.page) {
			temp += 'page=1';
		}

		if (!params.perPage) {
			temp += '&perPage=' + perPage;
		}

		return this.http.get(`${environment.SERVER_URL}/${temp}`);
	}

	/**
	 * Get products by slug
	 */
	public getSingleProduct(slug: string, isQuickView = false): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/products/${slug}?&isQuickView=${isQuickView}`);
	}

	/**
	 * Get Products
	 */
	public fetchHeaderSearchData(searchTerm: string, cat = null): Observable<any> {
		return this.http.get(`${environment.SERVER_URL}/shop?perPage=5&searchTerm=${searchTerm}&category=${cat}`);
	}
}