import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { LayoutModule } from 'app/layout/layout.module';

@NgModule({
	imports: [
		CommonModule,
		ReportRoutingModule,
		LayoutModule
	],
})
export class ReportModule { }
