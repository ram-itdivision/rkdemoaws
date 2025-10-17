import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frmenu',
  templateUrl: './frmenu.component.html',
  styleUrl: './frmenu.component.css'
})
export class FrmenuComponent {

    public logininfo: any = [];

    ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // console.log(this.logininfo)
    // if (!this.logininfo.validation || this.logininfo.validation == 0) {
    //   this._authenticationService.logout(this.logininfo);
    // }

  }
}
