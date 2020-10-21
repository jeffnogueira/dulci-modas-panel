import { FormGroup } from '@angular/forms';

import { Operation } from '../enums/operation.enum';
import { Subscription } from 'rxjs';

export interface FormInterface {
	title: string;
	id: number;
	item: any;
	operation: Operation;
	form: FormGroup;
	subscription: Subscription;

	setOperation(): void;
	createForm(): void;
	fillForm(): void;
	onSave(): void;
	onCancel(): void;
}
