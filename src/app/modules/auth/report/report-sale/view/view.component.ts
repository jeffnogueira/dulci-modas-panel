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

	dataSourceLastSales: DataChart = null;
	dataSourceBiggestDeptors: DataChart = null;
	dataSourceLastSalesNotDropped: DataChart = null;
	dataSourceLastSalesDropped: DataChart = null;

	constructor(
		private _reportService: ReportService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService,
		private _utilsService: UtilsService,
	) { }

	ngOnInit(): void {
		this.getLastSales();
		this.getBiggestDeptors();
		this.getLastSalesNotDropped();
		this.getLastSalesDropped();
	}

	getLastSales(): void {
		this.subscription = this._reportService.loadLastSales().subscribe((result: any) => {
			const lastSales: ContentToChart[] = result.data;
			this.dataSourceLastSales = this._utilsService.convertContentToDataChart(lastSales);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getBiggestDeptors(): void {
		this.subscription = this._reportService.loadBiggestDeptors().subscribe((result: any) => {
			const biggestDeptors: ContentToChart[] = result.data;
			this.dataSourceBiggestDeptors = this._utilsService.convertContentToDataChart(biggestDeptors);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getLastSalesNotDropped(): void {
		this.subscription = this._reportService.loadLastSalesNotDropped().subscribe((result: any) => {
			const lastSalesNotDropped: ContentToChart[] = result.data;
			this.dataSourceLastSalesNotDropped = this._utilsService.convertContentToDataChart(lastSalesNotDropped);

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getLastSalesDropped(): void {
		this.subscription = this._reportService.loadLastSalesDropped().subscribe((result: any) => {
			const lastSalesDropped: ContentToChart[] = result.data;
			this.dataSourceLastSalesDropped = this._utilsService.convertContentToDataChart(lastSalesDropped);

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
