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
import { ProductPhotoService } from 'app/shared/services/productPhoto.service';
import { CategoryService } from 'app/shared/services/category.service';
import { environment } from './../../../../../../environments/environment';

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
	formFile: FormGroup;
	subscription: Subscription;
	photos: Array<object>;
	urlS3 = environment.bucketS3;

	categories = [];

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: UtilsService,
		private _productService: ProductService,
		private _productPhotoService: ProductPhotoService,
		private _categoryService: CategoryService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.setOperation();
		this.createForm();
		this.getCategories();
		this.fillForm();
	}

	setOperation(): void {
		this.id = this._activatedRoute.snapshot.params.id as number;
		if (this.id) {
			this.operation = this._activatedRoute.snapshot.url[1].path.indexOf('edit') > -1 ? Operation.EDIT : Operation.VIEW;
			this.title = this.operation === Operation.EDIT ? 'Alterar Produto' : 'Visualizando Produto';
		} else {
			this.operation = Operation.NEW;
			this.title = 'Incluir Produto';
		}
	}

	createForm(): void {
		this.form = new FormGroup({
			idCategory: new FormControl(null, Validators.required),
			name: new FormControl(null, Validators.required),
			description: new FormControl(null, Validators.required),
			unitPrice: new FormControl(null, Validators.required),
			interestPrice: new FormControl(null, Validators.required),
			percent: new FormControl(null, Validators.required),
			totalUnitPrice: new FormControl({ value: null, disabled: true }),
			totalInterestPrice: new FormControl({ value: null, disabled: true }),
		});
	}

	createFormFile(): void {
		this.formFile = new FormGroup({
			idProduct: new FormControl(this.id, Validators.required),
			file: new FormControl(null, Validators.required),
		});
	}

	getCategories(): void {
		this.subscription = this._categoryService.loadAll().subscribe((result: any) => {
			this.categories = result.data;
		}, (error) => {
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onChangeTotalValue(value): void {
		const percent = parseFloat(this.form.controls.percent.value) / 100;
		const interest = parseFloat(this.form.controls.interestPrice.value);
		const unit = parseFloat(this.form.controls.unitPrice.value);

		this.form.controls.totalUnitPrice.setValue(((percent * unit) + unit).toFixed(2));
		this.form.controls.totalInterestPrice.setValue(((percent * unit) + interest + unit).toFixed(2));
	}
		
	fillForm(): void {
		if (this.operation !== Operation.NEW) {
			this.subscription = this._productService.loadOne(Number(this.id)).subscribe((data: any) => {
				data.idCategory = data.category.idCategory;
				data.totalUnitPrice = ((data.unitPrice * data.percent / 100) + data.unitPrice).toFixed(2);
				data.totalInterestPrice = ((data.unitPrice * data.percent / 100) + data.unitPrice + data.interestPrice).toFixed(2);
				this.photos = data.productPhotos;

				this.form.patchValue(data);
			}, (error) => {
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});

			this.createFormFile();
		}

		if (this.operation === Operation.VIEW) {
			this.form.disable();
		}
		this._loadingService.hide();
	}

	onSave(): void {
		if (this._utilsService.formIsValid(this.form)) {
		this._loadingService.show();

		let { unitPrice, interestPrice, percent } = this.form.value;

		unitPrice = parseFloat(unitPrice);
		interestPrice = parseFloat(interestPrice);
		percent = parseFloat(percent);

		const obj = {
			...this.form.value,
			unitPrice,
			interestPrice,
			percent,
		};

		if (this.operation === Operation.NEW) {
			this.subscription = this._productService.create(obj).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Registro cadastrado com sucesso.').then(res => this.navigate());
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		} else{
			this.subscription = this._productService.update(this.id, obj).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Registro atualizado com sucesso.').then(res => this.navigate());
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		}
		} 
	}

	insertedFile(file): void {
		this._utilsService.upload(file, (callback) => {
			if (callback.hasOwnProperty('result')){
				this.formFile.controls.file.setValue(file);
			}else{
				this._sweetAlertService.error('Ocorreu um erro', callback.error);
			}
		});
	}

	onSaveFile(): void {
		if (this._utilsService.formIsValid(this.formFile)) {
			this._loadingService.show();
			let { idProduct, file } = this.formFile.value;

			idProduct = parseInt(idProduct, 10);
			file = file;
			const obj = {
				...this.formFile.value,
				idProduct,
				file
			};
			const formData = new FormData();
			formData.append('idProduct', obj.idProduct);
			formData.append('file', obj.file);

			this.subscription = this._productPhotoService.create(formData).subscribe(data => {
				this._loadingService.hide();
				this._sweetAlertService.success('Foto cadastrada com sucesso.').then(res => {
					this._loadingService.show();
					this.fillForm();
				});
			}, (error) => {
				this._loadingService.hide();
				this._sweetAlertService.error('Ocorreu um erro', error.error.message);
			});
		}
	}

	onEditPosition(item, move): void {
		this._loadingService.show();

		const obj = {
			position: item.position,
			move
		};

		this.subscription = this._productPhotoService.update(item.idPhoto, obj).subscribe(data => {
			this._loadingService.hide();
			this._sweetAlertService.success('Posição editada com sucesso.').then(res => {
				this._loadingService.show();
				this.fillForm();
			});
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onRemoveFile(item): void {
		const msg = `Deseja realmente excluir a foto? Não será possível recuperá-la!`;

		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 
				this._loadingService.show();
				this.subscription = this._productPhotoService.delete(item.idPhoto).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Foto deletada com sucesso.').then(res => {
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
