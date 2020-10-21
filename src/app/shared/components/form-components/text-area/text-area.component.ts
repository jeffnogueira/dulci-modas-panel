import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilsService } from 'app/shared/services/utils.service';

@Component({
	selector: 'app-text-area',
	templateUrl: './text-area.component.html',
	styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

	@Input() formGroup: FormGroup;
	@Input() formcontrolname: string;
	@Input() placeholder: string;
	@Input() label: string;
	@Input() iconName: string;
	@Input() maxLength: number;
	@Input() minRows = 5;
	@Input() maxRows = 5;
	@Input() type = 'text';

	constructor(
		private _utilsService: UtilsService
	) { }

	ngOnInit(): void {

	}

	onChange(value): void{
		if (value.length >= this.maxLength) {
			value = value.substring(0, (this.maxLength));
		}
		return value;
	}

	checkRequired(): boolean {
		return this._utilsService.hasRequiredField(this.formGroup.get(this.formcontrolname));
	}
}
