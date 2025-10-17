import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';
 
interface RoomService {
  id?: number;
  location_id: number;
  service_name: string;
  service_price: string;
  gst_percent: string;
  fixed_price: 0 | 1;
}


@Component({
  selector: 'app-roomservices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roomservices.component.html',
  styleUrl: './roomservices.component.css'
})
export class RoomservicesComponent  implements OnInit {
  services: RoomService[] = [];
  logininfo: any = [];



  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    this.getServices();
  }


  service: RoomService = {
    location_id: this.logininfo.location_id,
    service_name: '',
    service_price: '',
    gst_percent: '',
    fixed_price: 1
  };

  locations = [
    { id: 1, name: 'Hyderabad' },
    { id: 2, name: 'Bangalore' }
  ];

  editing = false;
  apiPost = apiurl+'/add_room_service';
  apiGet = apiurl+'/list_room_service/'+this.logininfo.location_id;

  constructor(private http: HttpClient) {}


  getServices() {
    this.http.get<RoomService[]>(this.apiGet).subscribe(res => {
      this.services = res;
    });
  }

  save() {
    this.http.post(this.apiPost, this.service).subscribe(() => {
      this.getServices();
      this.reset();
    });
  }

  edit(item: RoomService) {
    this.service = { ...item };
    this.editing = true;
  }

  reset() {
    this.service = {
      location_id: this.logininfo.location_id,
      service_name: '',
      service_price: '',
      gst_percent: '',
      fixed_price: 1
    };
    this.editing = false;
  }
}
