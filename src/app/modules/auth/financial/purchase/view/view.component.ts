import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Column } from 'app/shared/components/several-components/data-table/column';
import { Config } from 'app/shared/components/several-components/data-table/config';
import { ViewInterface } from 'app/shared/interfaces/view.interface';
import { Operation } from 'app/shared/enums/operation.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseService } from 'app/shared/services/purchase.service';
import { Purchase } from 'app/shared/models/purchase.model';
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
	title = 'Compras';
	operation: Operation = Operation.INDEX;
	subscription: Subscription;
	iconName = 'shopping_cart';
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
			displayedColumn: 'providerName',
			columnRef: 'idProvider',
			nameColumn: 'Fornecedor',
			type: Column.TYPE_COMMOM,
			sorted: true
		},
		{
			displayedColumn: 'datePurchase',
			columnRef: 'datePurchase',
			nameColumn: 'Data Compra',
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
			displayedColumn: 'unitPrice',
			columnRef: 'unitPrice',
			nameColumn: 'Preço Unitário (R$)',
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
		private _purchaseService: PurchaseService,
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
		this.subscription = this._purchaseService.loadAll(this.options).subscribe((result: any) => {
			const purchases: Purchase[] = result.data;
			this.configuration.total = result.size;
			this.dataSource = purchases.map(res => {
				const obj = {
					...res,
					productName: res.product.name,
					providerName: res.provider.name,
					datePurchase: moment(res.datePurchase).format('DD/MM/YYYY')
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

	onUpdate(item: Purchase): void {
		this._router.navigate([`../${item.idPurchase}/edit`], {relativeTo: this._activatedRoute});
	}

	onView(item: Purchase): void {
		this._router.navigate([`../${item.idPurchase}/view`], {relativeTo: this._activatedRoute});
	}

	onDelete(item: Purchase): void {
		const msg = `Deseja realmente excluir a compra? Não será possível recuperá-la!`;

		this._sweetAlertService.confirm(msg).then(response => {

			if (!response.dismiss) { 
				this.subscription = this._purchaseService.delete(item.idPurchase).subscribe(data => {
					this._loadingService.hide();
					this._sweetAlertService.success('Registro deletado com sucesso.').then(() => this.onRefresh());
				}, (error) => {
					this._loadingService.hide();
					this._sweetAlertService.error('Ocorreu um erro', error.error.message);
				});
			}
		});
	}

	onCustom(event: {item: Purchase, button: {icon: string, title: string}}): void {
		this._router.navigate([`../../sales/${event.item.idPurchase}/new`], {relativeTo: this._activatedRoute});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
