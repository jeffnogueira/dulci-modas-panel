import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
	selector: 'loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

	constructor(
		public _loadingService: LoadingService
	) { }

	ngOnInit(): void {
	}

}
