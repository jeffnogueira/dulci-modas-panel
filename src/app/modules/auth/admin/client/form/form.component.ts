import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormInterface } from 'app/shared/interfaces/form.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { ClientService } from 'app/shared/services/client.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, FormInterface, OnDestroy {
	title: string;
	id: number;
	item: any;
	operation: Operation = Operation.NEW;
	form: FormGroup;
	subscription: Subscription;

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: UtilsService,
		private _clientService: ClientService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.setOperation();
		this.createForm();
		this.fillForm();
	}

	setOperation(): void {
		this.id = this._activatedRoute.snapshot.params.id as number;
		if (this.id) {
			this.operation = this._activatedRoute.snapshot.url[1].path.indexOf('edit') > -1 ? Operation.EDIT : Operation.VIEW;
			this.title = this.operation === Operation.EDIT ? 'Alterar Cliente' : 'Visualizando Cliente';
		} else {
			this.operation = Operation.NEW;
			this.title = 'Incluir Cliente';
		}
	}

	createForm(): void {
		this.form = new FormGroup({
			name: new FormControl(null, Validators.required),
			cpf: new FormControl(null, Validators.required),
			address: new FormControl(null, Validators.required),
			phone: new FormControl(null, Validators.required),
		});
	}

	fillForm(): void {
		if (this.operation !== Operation.NEW) {
			this.subscription = this._clientService.loadOne(Number(this.id)).subscribe((data: any) => {
				this.form.patchValue(data);
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		}

		if (this.operation === Operation.VIEW) {
			this.form.disable();
		}
		this._loadingService.hide();
	}

	onSave(): void {
		if (this._utilsService.formIsValid(this.form)) {
		this._loadingService.show();
		if (this.operation === Operation.NEW) {
			this.subscription = this._clientService.create(this.form.value).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Registro cadastrado com sucesso.').then(res => this.navigate());
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		} else{
			this.subscription = this._clientService.update(this.id, this.form.value).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Registro atualizado com sucesso.').then(res => this.navigate());
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		}
		} 
	}

	navigate(): void {
		let destiny = '../../';

		if (this.operation === Operation.NEW) {
			destiny = '../';
		}

		this._router.navigate([destiny], {
			relativeTo: this._activatedRoute
		});
	}

	onCancel(): void {
		this.navigate();
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
