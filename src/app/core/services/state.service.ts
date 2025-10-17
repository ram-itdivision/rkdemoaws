import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiurl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private http: HttpClient) {}

  getStates(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${apiurl}/state_list`);
  }

  addState(data: any): Observable<any> {
    return this.http.post(`${apiurl}/add_state`, data);
  }

  updateState(data: any): Observable<any> {
    return this.http.post(`${apiurl}/state_update/${data.id}`, data);
  }

  deleteState(id: number): Observable<any> {
    return this.http.delete(`${apiurl}/state_delete/${id}`);
  }
}
