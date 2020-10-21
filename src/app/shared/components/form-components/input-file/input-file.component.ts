import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-input-file',
	templateUrl: './input-file.component.html',
	styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnInit {

	@Input() formGroup: FormGroup;
	@Input() formcontrolname: string;

	@Input() label = 'Selecionar arquivo';
	@Input() placeholder: string;
	@Input() accept: string;
	
	@Output() insertedFile = new EventEmitter();

	filename: string;
	image: string | ArrayBuffer;

	constructor(
	) { }

	ngOnInit(): void {

	}

	@HostListener('change', ['$event.target.files'])
	emitFiles(event: FileList): void {
		const file = event && event.item(0);
		this.filename = file ? file.name : null;

		if (file && file.type.match(/image\//)) {
			const reader = new FileReader();
			reader.onload = e => this.image = reader.result;
			reader.readAsDataURL(file);
		} else {
			this.image = null;
		}

		this.insertedFile.emit(file);
		
	}

	removeFile(): void {
		this.filename = null;
	}

}
