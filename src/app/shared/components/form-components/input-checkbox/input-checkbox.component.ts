import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss']
})
export class InputCheckboxComponent implements OnInit {

	@Input() formGroup: FormGroup;
	@Input() formcontrolname: string;
	@Input() placeholder: string;
	@Input() label: string;
	@Input() disabled: boolean;

	@Output() changedValue = new EventEmitter();

	constructor(
	) { }

	ngOnInit(): void {

	}

	onValueChange(value): void {
		this.formGroup.controls[this.formcontrolname].setValue(value.checked);
		this.formGroup.markAsDirty();
		this.changedValue.emit(value);
	}

}
