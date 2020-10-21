import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	auth(payload: any): Observable<any> {
		const url = `${this.API_URL}/auth`;

		return this._httpService.post(url, this.contentType, payload).pipe(map((result: any) => result));
	}

}
