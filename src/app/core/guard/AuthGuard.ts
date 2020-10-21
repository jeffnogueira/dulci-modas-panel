import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Auth } from 'app/shared/models/auth.model';
import { HttpService } from 'app/shared/services/http.service';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	
	authData: Observable<Auth>;
	token: string;
	API_BASE_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _router: Router,
		private _store: Store<{ auth: Auth }>,
		private _activatedRoute: ActivatedRoute,
		private _httpService: HttpService
	) {
		this.API_BASE_URL = environment.API; 
		this.authData = this._store.pipe(select('auth'));

		this.authData.subscribe(data => {
			this.token = data.token;
		});
	}

	canActivate(): Promise<boolean>{
		return this.verifyAccess();
	}

	verifyAccess(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			if (this.token) {
				this._validateToken(this.token).then(res => 
					resolve(true)
				).catch(error =>
					this._router.navigate(['not-auth/'], {
						relativeTo: this._activatedRoute
					}).then(() => resolve(false))
				);
			} else {
				this._router.navigate(['not-auth/'], {
					relativeTo: this._activatedRoute
				}).then(() => resolve(false));
			}
		});
	}

	private _validateToken(token): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const item = this._validateTokenRequest(token).subscribe(
					data => {
					resolve(data);
					item.unsubscribe();
				}, error => {
					reject(error);
				}
			);
		});
	}

	private _validateTokenRequest(token?): Observable<any> {
		const url = `${this.API_BASE_URL}/auth/verify-token`;

		return this._httpService.post(url, this.contentType, { token });
	}

}
