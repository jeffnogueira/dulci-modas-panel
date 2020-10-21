import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/AuthGuard';

const routes: Routes = [
	{
	path: '',
	children: [
		{
		path: 'not-auth',
		loadChildren: () => import('./modules/not-auth/not-auth.module').then(m => m.NotAuthModule),
		},
		{
		path: 'auth',
		loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
		canActivate: [AuthGuard],
		},
		{
		path: '**',
		redirectTo: 'auth'
		}
	]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
