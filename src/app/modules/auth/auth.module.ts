import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LayoutModule } from 'app/layout/layout.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	imports: [
		AuthRoutingModule,
		CommonModule,
		FuseDirectivesModule,
		FlexLayoutModule,
		FusePipesModule,
		LayoutModule,
		MatIconModule,
		SharedModule,
	],
})
export class AuthModule { }
