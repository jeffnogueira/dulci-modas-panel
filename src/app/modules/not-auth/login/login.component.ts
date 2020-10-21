import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/shared/services/auth.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth } from 'app/shared/models/auth.model';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';

// HERE
import { AddAuthData } from 'app/store/authentication/actions';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	animations: fuseAnimations
})
export class LoginComponent implements OnInit
{
	form: FormGroup;

	constructor(
		private _fuseConfigService: FuseConfigService,
		private _sweetAlertService: SweetAlertService,
		private _router: Router,
		private _store: Store<{ auth: Auth }>,
		private _authService: AuthService,
		private _loadingService: LoadingService
	) {
		this._fuseConfigService.config = {
			layout: {
			navbar: { hidden: true },
			toolbar: { hidden: true },
			footer: { hidden: true },
			sidepanel: { hidden: true }
			}
		};
	}

	ngOnInit(): void {
		this.createForm();
	}

	createForm(): void {
		this.form = new FormGroup({
			email: new FormControl(null, Validators.required),
			password: new FormControl(null, [Validators.required, Validators.minLength(8)])
		});
	}

	onLogin(): void {
		this._loadingService.show();
		this._authService.auth(this.form.value).subscribe(
			res => {
				this._store.dispatch(AddAuthData(res));
				this._loadingService.hide();
				this._router.navigate(['auth/']);
			}, error => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um Erro', error.error.message);
			}
		);
	}
}
