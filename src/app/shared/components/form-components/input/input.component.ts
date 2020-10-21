import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

	@Input() formGroup: FormGroup;
	@Input() formcontrolname: string;
	@Input() placeholder: string;
	@Input() label: string;
	@Input() iconName: string;
	@Input() maxLength: number;
	@Input() mask = '';
	@Input() type = 'text';

	@Output() changedValue = new EventEmitter();

	constructor(
	) { }

	ngOnInit(): void {

	}

	onChange(value): void{
		if (this.maxLength) {
			if (value.length >= this.maxLength) {
				value = value.substring(0, (this.maxLength));
			}
			this.formGroup.get(this.formcontrolname).setValue(value);
		}
		this.onValueChange(value);
	}

	onValueChange(value): void {
		this.changedValue.emit(value);
	}

}
