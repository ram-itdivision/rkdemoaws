import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  exports:[
    HeaderComponent
    ]
})
export class SharedModule { }
