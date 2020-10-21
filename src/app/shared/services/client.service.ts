import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { ServiceInterface } from 'app/shared/interfaces/service.interface';
import { Observable } from 'rxjs';
import { Client } from 'app/shared/models/client.model';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class ClientService implements ServiceInterface {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	loadAll(payload?: any): Observable<Client[]> {
		const url = `${this.API_URL}/clients`;

		return this._httpService.get(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	loadOne(id: number): Observable<Client> {
		const url = `${this.API_URL}/clients/${id}`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	create(payload: any): Observable<Client> {
		const url = `${this.API_URL}/clients`;

		return this._httpService.post(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	update(id: number, payload: any): Observable<Client> {
		const url = `${this.API_URL}/clients/${id}`;

		return this._httpService.put(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	delete(id: number): Observable<Client> {
		const url = `${this.API_URL}/clients/${id}`;

		return this._httpService.delete(url, this.contentType).pipe(map((result: any) => result));
	}

}
