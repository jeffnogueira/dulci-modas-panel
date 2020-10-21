import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/modules/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxMaskModule } from 'ngx-mask';

import { InputComponent } from './input/input.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { InputFileComponent } from './input-file/input-file.component';
import { InputSelectComponent } from './input-select/input-select.component';
import { InputSelectMultipleComponent } from './input-select-multiple/input-select-multiple.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { ErrorComponent } from './error/error.component';
import { InputCheckboxComponent } from './input-checkbox/input-checkbox.component';

@NgModule({
	declarations: [
		ErrorComponent,
		InputComponent,
		InputNumberComponent,
		InputSelectComponent,
		InputSelectMultipleComponent,
		TextAreaComponent,
		InputFileComponent,
		InputCheckboxComponent,
	],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		ReactiveFormsModule,
		NgxMatSelectSearchModule,
		FormsModule,
		MaterialFileInputModule,
		NgxMaskModule.forRoot(),
	],
	exports: [
		ErrorComponent,
		InputComponent,
		InputCheckboxComponent,
		InputNumberComponent,
		InputFileComponent,
		InputSelectComponent,
		InputSelectMultipleComponent,
		TextAreaComponent,
	]
})
export class FormComponentsModule { }
