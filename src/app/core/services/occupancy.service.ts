import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import {  apiurl } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class OccupancyService {
 
  constructor(private readonly _http: HttpClient, private readonly _router: Router) { } 
  
  add_occupancy(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/add_occupancy_category`, obj)
  }  

  get_occupancylist(location_id:number): Observable<any> {
    return this._http.get<any>(apiurl+`/occupancy_category_list/`+location_id)
  }  

  update_occupancy(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/occupancy_category_update/`+obj.id, obj)
  }  

  del_occupancy(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/occupancy_category_delete/`+obj.id, obj)
  }  
}
