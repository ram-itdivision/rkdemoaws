import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { apiurl, smartapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_request(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/guest_reservations_report`, obj)
  }

  book_reservation(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/add_reservation_booking`, obj)
  }

  update_reservation(bk_id: any, obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/guest_booking_update/` + bk_id, obj)
  }

  add_checkin(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/checkin_angular`, obj)
  }
  add_reservation_checkin(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/reservation_checkin_angular`, obj)
  }

   add_contactless_checkin(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/contactless_checkin_angular`, obj)
  }

  get_booking_list(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/get_booking_list`, obj)
  }

   get_checkin_list(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/get_checkin_list`, obj)
  }

  get_registration_list(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/get_registration_list`, obj)
  }

  get_bookinginfo(id: any): Observable<any> {
    return this._http.get<any>(smartapi + `/guest_reservation_booking/` + id)
  }

  get_checkin_bookinginfo(id: any): Observable<any> {
    return this._http.get<any>(smartapi + `/guest_reservation_contactless/` + id)
  }


  get_guest_info(obj: any): Observable<any> {
    return this._http.get<any>(apiurl + `/get_guest_info/` + obj)
  }

  get_guest_booking_info(obj: any): Observable<any> {
    return this._http.get<any>(apiurl + `/get_booking_information/` + obj)
  }

  get_checkin_gusestinfo(obj: any): Observable<any> {
    return this._http.get<any>(apiurl + `/contactless_checkin_guest_info/` + obj)
  }

  get_checkin_gusestdocs(obj: any): Observable<any> {
    return this._http.get<any>(apiurl + `/contactless_checkin_guest_documents/` + obj)
  }
  checkoutroom(obj: any): Observable<any> {
    return this._http.post<any>(apiurl + `/checkout`, obj)
  }


  room_properties(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/hotelpropertyrooms/` + id)
  }

  guest_details(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/guestdetailsbymobile/` + id)
  }

  room_category(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/getroomcategory/` + id)
  }

  rooms_plan(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/get_rooms_plan_category/` + id)
  }

  room_by_category(loc: any, id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/room_by_category/` + loc + `/` + id)
  }

  guest_info_byid(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/get_guest_info/` + id)
  }

  view_reservation_info(gid: any): Observable<any> {
    return this._http.get<any>(apiurl + `/view_reservation_info/` + gid)
  }


  view_guest_booking_info(gid: any): Observable<any> {
    return this._http.get<any>(apiurl + `/view_guest_booking_info/` + gid)
  }

  upload_guest_documents(formdata: any) {
    return this._http.post<any>(apiurl + '/upload_guest_documents/', formdata);
  }

  get_addservice(loc_id: any) {
    return this._http.get<any>(apiurl + '/list_room_service/' + loc_id);
  }

  get_room_booking(guest_id: any) {
    return this._http.get<any>(apiurl + '/get_booking_details/' + guest_id);
  }

  search_guest(searchText: string) {
    return this._http.get<any>(apiurl + '/search_checkin_guest/' + searchText);
  }

  get_room_info(room_name: string) {
    return this._http.get<any>(apiurl + '/get_room_info/' + room_name);
  }

  get_guest_documents(obj: any) {
    return this._http.post<any>(apiurl + '/guest_documents_list', obj);
  }
  update_guest_info(gid: any, obj: any) {
    return this._http.post<any>(apiurl + '/guest_details_update/' + gid, obj);
  }
  post_selected_services(obj: any) {
    return this._http.post<any>(apiurl + '/add_guest_service_payment', obj);
  }

   get_checkout_payment_due(checkinid: any) {
    return this._http.get<any>(apiurl + '/get_checkout_payment_due/'+checkinid);
  }
 get_guest_complaints(location_id:any,guest_id:any) {
    return this._http.get<any>(apiurl + '/view_guest_complaints/'+location_id+'/'+guest_id );
  }

  get_guest_feedbacks(location_id:any,guest_id:any) {
    return this._http.get<any>(apiurl + '/view_guest_feedbacks/'+location_id+'/'+guest_id );
  }
 checkout_due_pay_now(duepaymentlist:any) {
    return this._http.post<any>(apiurl + '/checkout_due_pay_now',duepaymentlist);
  }

   get_restaurant_order(location_id:any,guests_id:any) {
    return this._http.get<any>(apiurl + '/view_guest_orders/'+location_id+'/'+guests_id);
  }

    get_restaurant_order_by_id(order_id:any) {
    return this._http.post<any>(apiurl + '/vieworder',order_id);
  }


   get_checkininfo(id: any): Observable<any> {
    return this._http.get<any>(apiurl + `/guest_checkin_info/` + id)
  }

}