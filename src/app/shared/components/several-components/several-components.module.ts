import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/modules/material.module';

import { DataTableComponent } from './data-table/data-table.component';
import { getPtPaginatorIntl } from './data-table/pt-paginator-intl';
import { HeaderComponent } from './header/header.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CardComponent } from './card/card.component';
import { ChartComponent } from './chart/chart.component';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
	declarations: [
		CardComponent,
		ChartComponent,
		DataTableComponent,
		HeaderComponent,
		CarouselComponent,
	],
	imports: [
		DragDropModule,
		CommonModule,
		FlexLayoutModule,
		MaterialModule,
		RouterModule,
		ReactiveFormsModule,
		FormsModule,
		NgxMatSelectSearchModule,
	],
	exports: [
		CardComponent,
		CarouselComponent,
		ChartComponent,
		DataTableComponent,
		HeaderComponent,
	],
	providers: [
		{ provide: MatPaginatorIntl, useValue: getPtPaginatorIntl() }
	]
})
export class SeveralComponentsModule { }
