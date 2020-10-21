import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'purchases',
		loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule)
	},
	{
		path: 'sales',
		loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule)
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FinancialRoutingModule { }
