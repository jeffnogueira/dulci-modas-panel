import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Column } from 'app/shared/components/several-components/data-table/column';
import { Config } from 'app/shared/components/several-components/data-table/config';
import { ViewInterface } from 'app/shared/interfaces/view.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/shared/services/product.service';
import { Product } from 'app/shared/models/product.model';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	animations: fuseAnimations,
})
export class ViewComponent implements OnInit, ViewInterface, OnDestroy {
	title = 'Produtos';
	operation: Operation = Operation.INDEX;
	subscription: Subscription;
	iconName = 'shopping_cart';
	dataSource = [];

	paginationInitial = { pageIndex: 0, pageSize: 10 };
	options = {};

	configuration = new Config([
		{
			displayedColumn: 'categoryName',
			columnRef: 'idCategory',
			nameColumn: 'Categoria',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'name',
			columnRef: 'name',
			nameColumn: 'Nome',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'leftQuantity',
			columnRef: 'leftQuantity',
			nameColumn: 'Quantidade Restante',
			type: Column.TYPE_COMMOM,
			sorted: false
		},
		{
			displayedColumn: 'unitPrice',
			columnRef: 'unitPrice',
			nameColumn: 'Preço Unitário',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'interestPrice',
			columnRef: 'interestPrice',
			nameColumn: 'Valor Juros',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'percent',
			columnRef: 'percent',
			nameColumn: 'Porcentagem',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: '',
			columnRef: 'actions',
			nameColumn: 'Ações',
			type: Column.TYPE_ACTIONS,
			sorted: false
		},
	], 0);

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _productService: ProductService,
		private _loadingService: LoadingService,
		private _utilsService: UtilsService,
		private _sweetAlertService: SweetAlertService
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.onRefresh(this.paginationInitial);
	}

	onRefresh(params?): void {
		this.options = { ...this.options, ...params };
		this.subscription = this._productService.loadAll(this.options).subscribe((result: any) => {
			const products: Product[] = result.data;
			this.configuration.total = result.size;
			this.dataSource = products.map(res => {
				const obj = {
					...res,
					categoryName: res.category.description,
					buttons: res.leftQuantity > 0 ? [{ icon: 'edit', title: 'Registrar Venda' }] : null
				};

				return obj;
			});
			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	onSearch(search): void {
		this._utilsService.paginatorWasChanged.emit();
		this.options = { ...this.options, ...this.paginationInitial, search };
		this.onRefresh(this.options);
	}

	onUpdate(item: Product): void {
		this._router.navigate([`../${item.idProduct}/edit`], {relativeTo: this._activatedRoute});
	}

	onView(item: Product): void {
		this._router.navigate([`../${item.idProduct}/view`], {relativeTo: this._activatedRoute});
	}

	onDelete(item: Product): void {
		const msg = `Deseja realmente excluir o produto ${item.name}? Não será possível recuperá-lo!`;

		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 

				this.subscription = this._productService.delete(item.idProduct).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro deletado com sucesso.').then(() => this.onRefresh());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		});
	}

	onCustom(event: {item: Product, button: {icon: string, title: string}}): void {
		this._router.navigate([`../../../financial/sales/${event.item.idProduct}/new`], {relativeTo: this._activatedRoute});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
