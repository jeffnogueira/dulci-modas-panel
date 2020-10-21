import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'categories',
		loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
	},
	{
		path: 'clients',
		loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
	},
	{
		path: 'products',
		loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
	},
	{
		path: 'providers',
		loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule)
	},
	{
		path: 'users',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule)
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
