import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';

@Component({
  selector: 'app-floors',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './floors.component.html',
  styleUrl: './floors.component.css'
})
export class FloorsComponent implements OnInit, OnDestroy {

  reservation_datatable: any = {};
  dtTrigger: Subject<any> = new Subject();
  floorList: any[] = [];
  logininfo: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);

    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    // Call the API
    this.http.get<any>(apiurl+'/getfloordetails/'+this.logininfo.location_id)
      .subscribe((response: any) => {
        this.floorList = response.content; 
        setTimeout(() => {
        this.dtTrigger.next(true);
      });
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
