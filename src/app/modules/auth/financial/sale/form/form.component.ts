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
import { SaleService } from 'app/shared/services/sale.service';
import { ClientService } from 'app/shared/services/client.service';
import { Product } from 'app/shared/models/product.model';
import * as moment from 'moment';
import { CommentService } from 'app/shared/services/comment.service';

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
	formComment: FormGroup;
	subscription: Subscription;

	products = [];
	clients = [];
	comments = [];
	idProduct: number;
	productSelected: Product;

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: UtilsService,
		private _productService: ProductService,
		private _clientService: ClientService,
		private _saleService: SaleService,
		private _commentService: CommentService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.setOperation();
		this.createForm();
		this.getProducts();
		this.getClients();
		this.fillForm();
	}

	setOperation(): void {
		this.id = this._activatedRoute.snapshot.params.id as number;
		this.idProduct = parseInt(this._activatedRoute.snapshot.params.idProduct, 10) as number;
		if (this.id && !(this._activatedRoute.snapshot.url[1].path.indexOf('new') > -1)) {
			this.operation = this._activatedRoute.snapshot.url[1].path.indexOf('edit') > -1 ? Operation.EDIT : Operation.VIEW;
			this.title = this.operation === Operation.EDIT ? 'Alterar Venda' : 'Visualizando Venda';
		} else {
			this.operation = Operation.NEW;
			this.title = 'Incluir Venda';
		}
	}

	createForm(): void {
		this.form = new FormGroup({
			idProduct: new FormControl(null, Validators.required),
			dateSale: new FormControl(null, Validators.required),
			quantity: new FormControl(null, Validators.required),
			totalUnitPrice: new FormControl({ value: null, disabled: true }),
			totalSalePrice: new FormControl({ value: null, disabled: true }),
			plots: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]),
			discount: new FormControl(null, Validators.required),
			idClient: new FormControl(null, Validators.required),
			description: new FormControl(null, Validators.required),
			dropSale: new FormControl(false),
		});
		this.formComment = new FormGroup({
			description: new FormControl(null, Validators.required),
		});
	}

	getProducts(): void {
		this.subscription = this._productService.loadAll().subscribe((result: any) => {
			this.products = result.data;

			if (this.operation !== Operation.NEW) {
				this.products.map(item => item.leftQuantity !== 0);
			}
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getClients(): void {
		this.subscription = this._clientService.loadAll().subscribe((result: any) => {
			this.clients = result.data;
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onChangeProduct(event): void {
		this.subscription = this._productService.loadOne(Number(event.value)).subscribe((data: any) => {
			this.productSelected = data;
			this.onChangeSaleValue(this.productSelected);
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onChangeSaleValue(productSelected): void {
		if (productSelected) {
			const percent = productSelected.percent ? parseFloat(productSelected.percent) / 100 : 0;
			const discount = this.form.controls.discount.value ? parseFloat(this.form.controls.discount.value) / 100 : 0;
			const interest = parseInt(this.form.controls.plots.value, 10) > 1 ? productSelected.interestPrice : 0;
			const unit = productSelected.unitPrice ? parseFloat(productSelected.unitPrice) : 0;
			const quantity = this.form.controls.quantity.value ? parseInt(this.form.controls.quantity.value, 10) : 1;

			const totalUnitPrice =	unit + (percent * unit) + interest - (discount * (unit + (percent * unit) + interest));
			
			this.form.controls.totalUnitPrice.setValue((totalUnitPrice).toFixed(2));
			this.form.controls.totalSalePrice.setValue((totalUnitPrice * quantity).toFixed(2));
		}

		this.form.controls.totalUnitPrice.disable();
		this.form.controls.totalSalePrice.disable();
	}

	fillForm(): void {
		if (this.operation !== Operation.NEW) {
			this.subscription = this._saleService.loadOne(Number(this.id)).subscribe((data: any) => {
				data.idProduct = data.product.idProduct;
				data.idClient = data.client.idClient;
				data.dateSale = moment(data.dateSale).format('YYYY-MM-DD');
				this.comments = data.comments;

				this.onChangeProduct({ value: data.idProduct });
				this.form.patchValue(data);
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		} else if (this.idProduct) {
			this.onChangeProduct({ value: this.idProduct });
			this.form.controls.idProduct.setValue(this.idProduct);
			this.form.controls.idProduct.disable();
		}

		if (this.operation === Operation.VIEW) {
			this.form.disable();
		}
		this._loadingService.hide();
	}

	onSave(): void {
		if (this._utilsService.formIsValid(this.form)) {
			this._loadingService.show();

			let { plots, discount, quantity } = this.form.value;

			discount = parseFloat(discount);
			plots = parseInt(plots, 10);
			quantity = parseInt(quantity, 10);

			const obj = {
				...this.form.value,
				plots,
				discount,
				quantity
			};

			if (this.operation === Operation.NEW) {
				this.subscription = this._saleService.create(obj).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro cadastrado com sucesso.').then(res => this.navigate());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			} else{
				this.subscription = this._saleService.update(this.id, obj).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro atualizado com sucesso.').then(res => this.navigate());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		} 
	}

	onSaveComment(): void {
		if (this._utilsService.formIsValid(this.formComment)) {
			this._loadingService.show();
			const { description } = this.formComment.value;

			const obj = {
				idSale: this.id,
				description,
			};

			this.subscription = this._commentService.create(obj).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Comentário cadastrado com sucesso.').then(res => {
					this._loadingService.show();
					this.fillForm();
				});
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		}
	}

	onDeleteComment(idComment: number): void {
		const msg = `Deseja realmente excluir esse comentário? Não será possível recuperá-lo!`;
		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 
				this._loadingService.show();

				this.subscription = this._commentService.delete(idComment).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Comentário excluído com sucesso.').then(res => {
						this._loadingService.show();
						this.fillForm();
					});
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		});
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
