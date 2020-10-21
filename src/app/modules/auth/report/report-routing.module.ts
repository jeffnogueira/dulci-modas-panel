import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
	},
	{
		path: 'report-purchases',
		loadChildren: () => import('./report-purchase/report-purchase.module').then(m => m.ReportPurchaseModule)
	},
	{
		path: 'report-sales',
		loadChildren: () => import('./report-sale/report-sale.module').then(m => m.ReportSaleModule)
	},
	{
		path: 'suggestions',
		loadChildren: () => import('./suggestion/suggestion.module').then(m => m.SuggestionModule)
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportRoutingModule { }
