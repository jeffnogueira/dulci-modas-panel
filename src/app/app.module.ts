import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { rootReducer } from './store/index.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { storageSyncMetaReducer } from 'ngrx-store-persist';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AppRoutingModule } from 'app/app-routing.module';
import { LoadingModule } from './shared/components/several-components/loading/loading.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,

		TranslateModule.forRoot(),

		// Material moment date module
		MatMomentDateModule,

		// Fuse modules
		FuseModule.forRoot(fuseConfig),
		FuseProgressBarModule,
		FuseSharedModule,
		FuseSidebarModule,

		// NgRx
		StoreModule.forRoot(rootReducer, { metaReducers: [storageSyncMetaReducer]}),
		StoreDevtoolsModule.instrument({maxAge: 25}),

		// App modules
		LayoutModule,
		LoadingModule,
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule
{
}
