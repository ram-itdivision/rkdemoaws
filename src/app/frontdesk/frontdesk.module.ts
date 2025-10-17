import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontdeskRoutingModule } from './frontdesk-routing.module';
import { FrmenuComponent } from './frmenu/frmenu.component';
import { FrscreensComponent } from './frscreens/frscreens.component';
import { DashboardComponent } from './frscreens/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../shared/loader/loader.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FrmenuComponent,
    FrscreensComponent,
    DashboardComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FrontdeskRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FrontdeskModule { }
