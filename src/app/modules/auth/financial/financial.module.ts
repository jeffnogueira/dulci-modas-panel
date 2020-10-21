import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialRoutingModule } from './financial-routing.module';
import { LayoutModule } from 'app/layout/layout.module';

@NgModule({
	imports: [
		CommonModule,
		FinancialRoutingModule,
		LayoutModule
	],
})
export class FinancialModule { }
