import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiurl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class CheckService {
  private documentFormData: FormData | null = null;

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  setDocuments(formData: FormData) {
    this.documentFormData = formData;
  }

  post_guest_checkin(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/add_guest_checkin`, obj)
  }

  getDocuments(): FormData | null {
    return this.documentFormData;
  }

  get_roomlist(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/rooms_list_by_floor`, obj)
  }

  update_roomstatus(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/checkin`, obj)
  }

  contactless_checkin(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/get_checkin_request_list`, obj)
  }

  post_payment(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/add_guest_payment`, obj)
  }

  get_receipt(guest_id: any,rec_id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/payment_receipt_info/`+guest_id+`/`+rec_id)
  }


  getGuestDocuments(postobj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/guest_documents_list` , postobj)
  }

}