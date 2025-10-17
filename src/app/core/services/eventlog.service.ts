import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import {  apiurl } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class EventService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
 
  post_event(obj: any): Observable<any> { 
    return this._http.post<any>(`${apiurl}/events/`, obj) 
  }
 

}
