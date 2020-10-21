import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Product } from '../models/product.model';

@Injectable({
	providedIn: 'root'
})
export class SuggestionService {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	findProductsSuggestion(payload?: any): Observable<Product[]> {
		const url = `${this.API_URL}/suggestions/productsSuggestion`;

		return this._httpService.get(url, this.contentType, payload).pipe(map((result: any) => result));
	}

}
