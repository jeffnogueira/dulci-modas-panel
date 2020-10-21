import { Injectable } from '@angular/core';
import swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class SweetAlertService {

	constructor() { }

	success(title, underText?): Promise<SweetAlertResult> {
		return swal.fire({
			title: title,
			text: underText,
			type: 'success',
			confirmButtonColor: 'green',
			customClass: 'auto-width',
			heightAuto: false
		});
	}

	warning(title, underText?): Promise<SweetAlertResult> {
		return swal.fire({
			title: title,
			text: underText,
			type: 'info',
			confirmButtonColor: 'orange',
			customClass: 'auto-width warning-swal',
			heightAuto: false
		});
	}

	error(title, underText?): Promise<SweetAlertResult> {
		return swal.fire({
			title: title,
			text: underText,
			type: 'error',
			confirmButtonColor: 'green',
			customClass: 'auto-width',
			heightAuto: false
		});
	}

	confirm(title, text?): Promise<SweetAlertResult> {
		return swal.fire({
			title: title,
			text: text,
			type: 'warning',
			reverseButtons: true,
			showCancelButton: true,
			confirmButtonColor: 'green',
			cancelButtonColor: 'red',
			confirmButtonText: 'Sim',
			cancelButtonText: 'Não',
			customClass: 'auto-width',
			heightAuto: false
		});
	}
}
