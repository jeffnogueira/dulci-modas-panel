import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-input-number',
	templateUrl: './input-number.component.html',
	styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent implements OnInit {

	@Input() formGroup: FormGroup;
	@Input() formcontrolname: string;
	@Input() placeholder: string;
	@Input() label: string;
	@Input() iconName: string;
	@Input() min: number;
	@Input() max: number;

	@Output() changedValue = new EventEmitter();

	constructor(
	) { }

	ngOnInit(): void {
		if (this.min || this.max) {
			this.onChange();
		}
	}

	onChange(): void{
		this.formGroup.get(this.formcontrolname).valueChanges.subscribe(data => {
			if (data === null) {
				this.formGroup.get(this.formcontrolname).setValue('');
			} else if (data > this.max) {
				this.formGroup.get(this.formcontrolname).setValue(this.max);
			} else if (data < this.min) {
				this.formGroup.get(this.formcontrolname).setValue(this.min);
			}
			this.onValueChange(data);
		});
	}

	onValueChange(value): void {
		this.changedValue.emit(value);
	}

}
