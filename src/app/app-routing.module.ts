import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FrontdeskModule } from './frontdesk/frontdesk.module';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
    canActivate : [AuthGuard]
  },
  {
    path:'frontdesk',
    loadChildren: () => import('./frontdesk/frontdesk.module').then(module => module.FrontdeskModule),
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ AdminModule,FrontdeskModule ]
