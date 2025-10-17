import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiurl } from 'src/environments/environment.development';

// export interface Country {
//   country_id?: number;
//   country_name: string;
//   nationality: string;
//   status: 'active' | 'inactive';
// }

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient) { }

  getCountries(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${apiurl}/countries_list`);
  }

  addCountry(data: any): Observable<any> {
    return this.http.post(`${apiurl}/add_countries`, data);
  }

  updateCountry(data: any): Observable<any> {
    return this.http.post(`${apiurl}/countries_update/${data.id}`, data);
  }

  deleteCountry(id: number): Observable<any> {
    return this.http.delete(`${apiurl}/countries_delete/${id}`);
  }
}
