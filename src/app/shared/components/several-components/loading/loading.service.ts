import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	constructor( ) { }

	private isShow = false;

	show(): void{
		this.isShow = true;
	}

	hide(): void{
		setTimeout(() => this.isShow = false, 1000);
	}

	getStatus(): boolean{
		return this.isShow;
	}
}
