import { Component, OnInit } from '@angular/core';
import { ImageCarousel } from 'app/shared/models/imageCarousel.model';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { LoadingService } from 'app/shared/components/several-components/loading/loading.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { SuggestionService } from 'app/shared/services/suggestion.service';
import { Product } from 'app/shared/models/product.model';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

	subscription: Subscription;

	productsToPurchase: ImageCarousel[];
	productsToPromotion: ImageCarousel[];

	paginationInitial = { pageIndex: 0, pageSize: 10, orderBy: 'quantitySaled' };

	constructor(
		private _suggestionService: SuggestionService,
		private _sweetAlertService: SweetAlertService,
		private _loadingService: LoadingService,
	) { }

	ngOnInit(): void {
		this.getToPurchase();
		this.getToPromotion();
	}

	getToPurchase(): void {
		const params = { ...this.paginationInitial, direction: 'DESC' };
		this.subscription = this._suggestionService.findProductsSuggestion(params).subscribe((result: any) => {
			const toPurchase: Product[] = result.data;
			this.productsToPurchase = toPurchase.map(item => {

				const obj = {
					title: item.name,
					image: item.productPhotos.length > 0 ? item.productPhotos[0].photo['name'] : '/productImage/image-base.jpg',
					link: `auth/admin/products/${item.idProduct}/view`,
				};

				return obj;
			});

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}

	getToPromotion(): void {
		const params = { ...this.paginationInitial, direction: 'ASC' };
		this.subscription = this._suggestionService.findProductsSuggestion(params).subscribe((result: any) => {
			const toPromotion: Product[] = result.data;
			this.productsToPromotion = toPromotion.map(item => {

				const obj = {
					title: item.name,
					image: item.productPhotos.length > 0 ? item.productPhotos[0].photo['name'] : '/productImage/image-base.jpg',
				};

				return obj;
			});

			this._loadingService.hide();
		}, (error) => {
			this._loadingService.hide();
			this._sweetAlertService.error('Ocorreu um erro', error.error.message);
		});
	}


}
