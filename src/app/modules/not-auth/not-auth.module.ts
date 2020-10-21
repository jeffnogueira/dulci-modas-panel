import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotAuthRoutingModule } from './not-auth-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FusePipesModule } from '@fuse/pipes/pipes.module';

import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
	declarations: [LoginComponent, LogoutComponent],
	imports: [
	CommonModule,
	SharedModule,
	FuseDirectivesModule,
	FlexLayoutModule,
	FusePipesModule,
	NotAuthRoutingModule,

	FuseSharedModule
	]
})
export class NotAuthModule { }
