import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Auth } from 'app/shared/models/auth.model';

@Injectable({
	providedIn: 'root'
	})
export class HttpService {

	authData: Observable<Auth>;
	token: string;

	constructor(
		private _httpClient: HttpClient,
		private _store: Store<{ auth: Auth }>
	) {
		this.authData = this._store.pipe(select('auth'));

		this.authData.subscribe(data => {
			this.token = data.token;
		});
	}

	getHeaders(contentType): HttpHeaders {
		let headers = new HttpHeaders({});
		if (contentType) {
			headers = new HttpHeaders({
				'Content-Type': contentType,
				'Authorization': `Bearer ${this.token ? this.token : null}`
			});
		} else {
			headers = new HttpHeaders({
				Authorization: `Bearer ${this.token ? this.token : null}`
			});
		}
		
		return headers;
	}

	get(url, contentType, payload?): Observable<object> {
		return this._httpClient.get(url, { headers: this.getHeaders(contentType), params: payload });
	}

	post(url, contentType, payload): Observable<object> {
		return this._httpClient.post(url, payload, { headers: this.getHeaders(contentType) });
	}

	put(url, contentType, payload): Observable<object> {
		return this._httpClient.put(url, payload, { headers: this.getHeaders(contentType) });
	}

	delete(url, contentType): Observable<object> {
		return this._httpClient.delete(url, { headers: this.getHeaders(contentType) });
	}

}
