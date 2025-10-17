import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { apiurl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
  
  departmentlist(): Observable<any> {
    return this._http.get<any>(apiurl+`/getdepartmentslist`)
  }

  get_request(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/requests`, obj)
  }  

  view_orders(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/vieworder`, obj)
  }

  req_accept(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/request_action_change`, obj)
  }

  req_cls_or_reject(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/request_status_change`, obj)
  }

  req_rejected(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/request_rejected`, obj)
  }

  transfer_dep(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/transfer_department`, obj)
  }

}