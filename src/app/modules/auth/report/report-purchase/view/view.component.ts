import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ReportService } from 'app/shared/services/report.service';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { DataChart } from 'app/shared/models/dataChart.model';
import { ContentToChart } from 'app/shared/models/contentToChart.model';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

	subscription: Subscription;

	dataSourceLastPurchases: DataChart = null;
	dataSourceInvetoryFlow: DataChart = null;
	dataSourceGreaterProviders: DataChart = null;
	dataSourceTopSellingProducts: DataChart = null;

	constructor(
		private _reportService: ReportService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService,
		private _utilsService: UtilsService,
	) { }

	ngOnInit(): void {
		this.getLastPurchases();
		this.getInvetoryFlow();
		this.getGreaterProviders();
		this.getTopSellingProducts();
	}

	getLastPurchases(): void {
		this.subscription = this._reportService.loadLastPurchases().subscribe((result: any) => {
			const lastPurchases: ContentToChart[] = result.data;
			this.dataSourceLastPurchases = this._utilsService.convertContentToDataChart(lastPurchases);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getInvetoryFlow(): void {
		this.subscription = this._reportService.loadInvetoryFlow().subscribe((result: any) => {
			const invetoryFlow: ContentToChart[] = result.data;
			this.dataSourceInvetoryFlow = this._utilsService.convertContentToDataChart(invetoryFlow);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getGreaterProviders(): void {
		this.subscription = this._reportService.loadGreaterProviders().subscribe((result: any) => {
			const greaterProviders: ContentToChart[] = result.data;
			this.dataSourceGreaterProviders = this._utilsService.convertContentToDataChart(greaterProviders);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getTopSellingProducts(): void {
		this.subscription = this._reportService.loadTopSellingProducts().subscribe((result: any) => {
			const topSellingProducts: ContentToChart[] = result.data;
			this.dataSourceTopSellingProducts = this._utilsService.convertContentToDataChart(topSellingProducts);

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
