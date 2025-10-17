import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { apiurl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class RoomsettingService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_floorlist(location: number): Observable<any> {
    return this._http.get<any>(apiurl+`/getfloordetails/`+location)
  }
  cleaning_status_chg(obj: any): Observable<any> {
    return this._http.post<any>(apiurl+`/checkoutstatus`, obj)
  }
  cleaning_finished(obj: FormData): Observable<any> {
    return this._http.post<any>(apiurl+`/clean_room_with_image`, obj)
  }

}