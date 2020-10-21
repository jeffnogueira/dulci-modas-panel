import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportCard } from 'app/shared/models/reportCard.model';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { ContentToChart } from '../models/contentToChart.model';

@Injectable({
	providedIn: 'root'
})
export class ReportService {
	API_URL: string = environment.API;
	contentType = 'application/json';

	constructor(
		private _httpService: HttpService
	) { }

	loadCards(): Observable<ReportCard> {
		const url = `${this.API_URL}/reports`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadLastPurchases(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/lastPurchases`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadInvetoryFlow(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/invetoryFlow`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadGreaterProviders(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/greaterProviders`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadTopSellingProducts(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/topSellingProducts`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadLastSales(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/lastSales`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadBiggestDeptors(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/biggestDeptors`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadLastSalesNotDropped(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/lastSalesNotDropped`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

	loadLastSalesDropped(): Observable<ContentToChart[]> {
		const url = `${this.API_URL}/reports/lastSalesDropped`;

		return this._httpService.get(url, this.contentType).pipe(map((result: any) => result));
	}

}
