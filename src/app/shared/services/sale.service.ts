import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { ServiceInterface } from 'app/shared/interfaces/service.interface';
import { Observable } from 'rxjs';
import { Sale } from 'app/shared/models/sale.model';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class SaleService implements ServiceInterface {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	loadAll(payload?: any): Observable<Sale[]> {
		const url = `${this.API_URL}/sales`;

		return this._httpService.get(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	loadOne(id: number): Observable<Sale> {
		const url = `${this.API_URL}/sales/${id}`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	create(payload: any): Observable<Sale> {
		const url = `${this.API_URL}/sales`;

		return this._httpService.post(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	update(id: number, payload: any): Observable<Sale> {
		const url = `${this.API_URL}/sales/${id}`;

		return this._httpService.put(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	delete(id: number): Observable<Sale> {
		const url = `${this.API_URL}/sales/${id}`;

		return this._httpService.delete(url, this.contentType).pipe(map((result: any) => result));
	}

}
