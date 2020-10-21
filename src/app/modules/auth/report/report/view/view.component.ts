import { Component, OnInit, OnDestroy } from '@angular/core';
import { configurationPurchase, configurationSale } from './configColumn';
import { PurchaseService } from 'app/shared/services/purchase.service';
import { SaleService } from 'app/shared/services/sale.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Purchase } from 'app/shared/models/purchase.model';
import * as moment from 'moment';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { Sale } from 'app/shared/models/sale.model';
import { ReportCard } from 'app/shared/models/reportCard.model';
import { ReportService } from 'app/shared/services/report.service';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

	subscription: Subscription;

	configPurchase = configurationPurchase;
	configSale = configurationSale;

	dataSourcePurchases = [];
	dataSourceSales = [];
	dataSourceCards = [];

	paginationInitial = { pageIndex: 0, pageSize: 10, direction: 'desc' };
	options = {};

	constructor(
		private _purchaseService: PurchaseService,
		private _saleService: SaleService,
		private _reportService: ReportService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService,
	) {
		this._loadingService.show();
	}

	ngOnInit(): void {
		this.getValueCards();
		this.getPurchases({ ...this.paginationInitial, orderBy: 'datePurchase' });
		this.getSales({ ...this.paginationInitial, orderBy: 'dateSale' });
	}

	getValueCards(): void {
		this.subscription = this._reportService.loadCards().subscribe((result: any) => {
			const report: ReportCard = result.data;
			this.dataSourceCards = [
				{ title: `R$ ${report.debtor.toFixed(2)}`, description: 'DEVEDOR', color: '#da0f0f' },
				{ title: `R$ ${report.totalPieces.toFixed(2)}`, description: 'TOTAL EM PEÇAS', color: '#0f3bda' },
				{ title: `${report.partsInvetory}`, description: 'PEÇAS EM ESTOQUE', color: '#0fda31' },
				{ title: `R$ ${report.salesLastMonth.toFixed(2)}`, description: 'VENDAS ÚLTIMO MÊS', color: '#dad40f' },
			];

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getPurchases(params?): void {
		this.options = { ...this.options, ...params };
		this.subscription = this._purchaseService.loadAll(this.options).subscribe((result: any) => {
			const purchases: Purchase[] = result.data;
			this.dataSourcePurchases = purchases.map(res => {
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

	getSales(params?): void {
		this.options = { ...this.options, ...params };
		this.subscription = this._saleService.loadAll(this.options).subscribe((result: any) => {
			const sales: Sale[] = result.data;
			this.dataSourceSales = sales.map(res => {
				const unit = res.product.unitPrice;
				const percent = res.product.percent / 100;
				const interest = res.product.interestPrice;
				const discount = res.discount / 100;

				const totalUnitPrice =	unit + (percent * unit) + interest - (discount * (unit + (percent * unit) + interest));
				
				const obj = {
					...res,
					clientName: res.client.name,
					productName: res.product.name,
					dateSale: moment(res.dateSale).format('DD/MM/YYYY'),
					dropSale: res.dropSale ? 'Sim' : 'Não',
					totalUnitPrice: totalUnitPrice.toFixed(2),
					totalSalePrice: (totalUnitPrice * res.quantity).toFixed(2),
				};

				return obj;
			});

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
