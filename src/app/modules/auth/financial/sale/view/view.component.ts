import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Column } from 'app/shared/components/several-components/data-table/column';
import { Config } from 'app/shared/components/several-components/data-table/config';
import { ViewInterface } from 'app/shared/interfaces/view.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { SaleService } from 'app/shared/services/sale.service';
import { Sale } from 'app/shared/models/sale.model';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { UtilsService } from 'app/shared/services/utils.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import * as moment from 'moment';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	animations: fuseAnimations,
})
export class ViewComponent implements OnInit, ViewInterface, OnDestroy {
	title = 'Vendas';
	operation: Operation = Operation.INDEX;
	subscription: Subscription;
	iconName = 'add_shopping_cart';
	dataSource = [];

	paginationInitial = { pageIndex: 0, pageSize: 10 };
	options = {};

	configuration = new Config([
		{
			displayedColumn: 'productName',
			columnRef: 'idProduct',
			nameColumn: 'Produto',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'dateSale',
			columnRef: 'dateSale',
			nameColumn: 'Data da Venda',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'quantity',
			columnRef: 'quantity',
			nameColumn: 'Quantidade',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'totalUnitPrice',
			columnRef: 'unitPrice',
			nameColumn: 'Preço Unitário (R$)',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'totalSalePrice',
			columnRef: 'totalPrice',
			nameColumn: 'Preço Total da Venda (R$)',
			type: Column.TYPE_COMMOM,
			sorted: false
		},
		{
			displayedColumn: 'plots',
			columnRef: 'plots',
			nameColumn: 'Parcelas',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'discount',
			columnRef: 'discount',
			nameColumn: 'Desconto (%)',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'clientName',
			columnRef: 'idClient',
			nameColumn: 'Nome do Comprador(a)',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'dropSale',
			columnRef: 'dropSale',
			nameColumn: 'Baixa na Venda?',
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
		private _saleService: SaleService,
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
		this.subscription = this._saleService.loadAll(this.options).subscribe((result: any) => {
			const sales: Sale[] = result.data;
			this.configuration.total = result.size;
			this.dataSource = sales.map(res => {
				const unit = res.product.unitPrice;
				const percent = (100 + res.product.percent) / 100;
				const discount = (100 - res.discount) / 100;
				const interest = res.product.interestPrice;

				const totalUnitPrice =	(unit * percent * discount);

				const obj = {
					...res,
					clientName: res.client.name,
					productName: res.product.name,
					dateSale: moment(res.dateSale).format('DD/MM/YYYY'),
					dropSale: res.dropSale ? 'Sim' : 'Não',
					totalUnitPrice: totalUnitPrice.toFixed(2),
					totalSalePrice: (totalUnitPrice * res.quantity).toFixed(2),
				};

				if (res.plots > 1) {
					obj.totalSalePrice =  (Number(obj.totalSalePrice) + interest).toFixed(2);
				}

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

	onUpdate(item: Sale): void {
		this._router.navigate([`../${item.idSale}/edit`], {relativeTo: this._activatedRoute});
	}

	onView(item: Sale): void {
		this._router.navigate([`../${item.idSale}/view`], {relativeTo: this._activatedRoute});
	}

	onDelete(item: Sale): void {
		const msg = `Deseja realmente excluir a venda? Não será possível recuperá-la!`;

		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 
				this.subscription = this._saleService.delete(item.idSale).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro deletado com sucesso.').then(() => this.onRefresh());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
