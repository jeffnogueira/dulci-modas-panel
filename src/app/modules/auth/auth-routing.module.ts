import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
	},
	{
		path: 'financial',
		loadChildren: () => import('./financial/financial.module').then(m => m.FinancialModule)
	},
	{
		path: 'report',
		loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
	},
	{
		path: '**',
		redirectTo: 'report'
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
