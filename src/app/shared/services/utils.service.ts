import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { SweetAlertService } from './sweet-alert.service';
import { DataChart } from '../models/dataChart.model';
import { ContentToChart } from '../models/contentToChart.model';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	paginatorWasChanged = new EventEmitter<any>();

	constructor(
	private _sweetAlertService: SweetAlertService
	) { }

	markFormTouched(form: FormGroup): void {
		const keys = Object.keys(form.getRawValue());

		for (const key of keys) {
			form.get(key).markAsTouched();
		}
	}

	formIsValid(form: FormGroup): boolean {
		if (form.valid) {
			return true;
		} else {
			this.markFormTouched(form);
			this._sweetAlertService.error('Ops', 'Existem campos que não foram preenchidos adequadamente!');
			return false;
		}
	}

	hasRequiredField(abstractControl: AbstractControl): boolean {
		if (abstractControl.validator) {
			const validator = abstractControl.validator({} as AbstractControl);
			if (validator && validator.required) {
			return true;
			}
		}
		return false;
	}

	UploadValidator(headerString): boolean {
		const acceptedMimeCodes = ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', '89504e47'];
		return acceptedMimeCodes.includes(headerString);
	}

	upload(files, callback): any {
		const reader = new FileReader();
		reader.readAsArrayBuffer(files);
		reader.onload = e => {
			if (reader.result instanceof ArrayBuffer) {
				const arrFile = (new Uint8Array(reader.result)).subarray(0, 4);
				let header = '';

				arrFile.forEach(item => {
					header += item.toString(16);
				});

				if (!this.UploadValidator(header)) {
					return callback({ error: 'Formato do arquivo incorreto! Escolha uma imagem jpg, jpeg ou png.' });
				}
				reader.readAsDataURL(files);
				reader.onload = (_event) => {
					return callback({ result: reader.result });
				};
			} else {
				return callback({ error: 'Falha ao verificar o arquivo. Por favor, tente novamente.' });
			}
		};
	}

	convertContentToDataChart(content: ContentToChart[]): DataChart {
		const data = { labels: [], data: [] };

		content.map(item => {
			data.labels.push(item.label);
			data.data.push(item.value);
		});

		return data;
	}
}
