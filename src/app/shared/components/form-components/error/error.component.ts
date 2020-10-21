import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	@Input() formGroup;
	@Input() formcontrolname;
	
	constructor() { }

	ngOnInit(): void {
		this.formGroup.get(this.formcontrolname);
	}

	getErrorMessage(): string {
		const control = this.formGroup.get(this.formcontrolname);

		return control.hasError('required') ? 'Dado obrigatório não informado' : '';
	}

}
