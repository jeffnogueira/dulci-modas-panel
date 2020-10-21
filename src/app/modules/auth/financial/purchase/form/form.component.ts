import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormInterface } from 'app/shared/interfaces/form.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { ProductService } from 'app/shared/services/product.service';
import { PurchaseService } from 'app/shared/services/purchase.service';
import { ProviderService } from 'app/shared/services/provider.service';

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

	products = [];
	providers = [];

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: UtilsService,
		private _purchaseService: PurchaseService,
		private _productService: ProductService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService,
		private _providerService: ProviderService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.setOperation();
		this.createForm();
		this.getProducts();
		this.getProviders();
		this.fillForm();
	}

	setOperation(): void {
		this.id = this._activatedRoute.snapshot.params.id as number;
		if (this.id) {
			this.operation = this._activatedRoute.snapshot.url[1].path.indexOf('edit') > -1 ? Operation.EDIT : Operation.VIEW;
			this.title = this.operation === Operation.EDIT ? 'Alterar Compra' : 'Visualizando Compra';
		} else {
			this.operation = Operation.NEW;
			this.title = 'Incluir Compra';
		}
	}

	createForm(): void {
		this.form = new FormGroup({
			idProduct: new FormControl(null, Validators.required),
			idProvider: new FormControl(null, Validators.required),
			unitPrice: new FormControl(null, Validators.required),
			quantity: new FormControl(null, Validators.required),
			datePurchase: new FormControl(null, Validators.required),
		});
	}

	getProducts(): void {
		this.subscription = this._productService.loadAll().subscribe((result: any) => {
			this.products = result.data;
		}, (error) => {
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getProviders(): void {
		this.subscription = this._providerService.loadAll().subscribe((result: any) => {
			this.providers = result.data;
		}, (error) => {
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}
		
	fillForm(): void {
		if (this.operation !== Operation.NEW) {
			this.subscription = this._purchaseService.loadOne(Number(this.id)).subscribe((data: any) => {
				data.idProvider = data.provider.idProvider;
				data.idProduct = data.product.idProduct;

				this.form.patchValue(data);
			}, (error) => {
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

		let { unitPrice, quantity } = this.form.value;

		unitPrice = parseFloat(unitPrice);
		quantity = parseFloat(quantity);

		const obj = {
			...this.form.value,
			unitPrice,
			quantity,
		};

		if (this.operation === Operation.NEW) {
			this.subscription = this._purchaseService.create(obj).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Registro cadastrado com sucesso.').then(res => this.navigate());
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		} else{
			this.subscription = this._purchaseService.update(this.id, obj).subscribe(data => {
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
