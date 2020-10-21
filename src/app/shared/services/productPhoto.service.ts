import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { ServiceInterface } from 'app/shared/interfaces/service.interface';
import { Observable } from 'rxjs';
import { ProductPhoto } from 'app/shared/models/productPhoto.model';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class ProductPhotoService implements ServiceInterface {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	loadAll(payload?: any): Observable<ProductPhoto[]> {
		const url = `${this.API_URL}/productPhotos`;

		return this._httpService.get(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	loadOne(idPhoto: number): Observable<ProductPhoto> {
		const url = `${this.API_URL}/productPhotos/${idPhoto}`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	create(payload: any): Observable<ProductPhoto> {
		const url = `${this.API_URL}/productPhotos`;

		return this._httpService.post(url, '', payload).pipe(map((result: any) => result));
	}

	update(idPhoto: number, payload: any): Observable<ProductPhoto> {
		const url = `${this.API_URL}/productPhotos/${idPhoto}`;

		return this._httpService.put(url, this.contentType, payload).pipe(map((result: any) => result));
	}

	delete(idPhoto: number): Observable<ProductPhoto> {
		const url = `${this.API_URL}/productPhotos/${idPhoto}`;

		return this._httpService.delete(url, this.contentType).pipe(map((result: any) => result));
	}

}
