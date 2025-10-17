import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';

@Component({
  selector: 'app-locationconfig',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locationconfig.component.html',
  styleUrl: './locationconfig.component.css',
})
export class LocationconfigComponent implements OnInit {

  logininfo: any = [];
  
  config: any = {};

  configOptions: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);


    this.config = {
    location_id: this.logininfo.location_id,
    max_occupancy_limit: 4,
    checkin_time: '12:00:00',
    checkout_time: '11:00:00',
  };

  this.configOptions = [
    { key: 'coupon_system', label: 'Coupon System' },
    { key: 'loyalty_points', label: 'Loyalty Points' },
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'parking_available', label: 'Parking Available' },
    { key: 'shuttle_service', label: 'Shuttle Service' },
    { key: 'room_service_available', label: 'Room Service Available' },
    { key: 'late_checkout_allowed', label: 'Late Checkout Allowed' },
    { key: 'event_booking_allowed', label: 'Event Booking Allowed' },
    { key: 'pets_allowed', label: 'Pets Allowed' },
  ];

    this.loadConfig();
  }

loadConfig() {
  this.http.post<any>(apiurl+'/get_location_config', {
    location_id: this.config.location_id
  }).subscribe((res) => {
    if (res.status && res.data) {
      this.config = res.data;

      // Convert string "0"/"1" to boolean true/false for switches
      this.configOptions.forEach((opt: { key: string | number; }) => {
        this.config[opt.key] = this.config[opt.key] === "1" || this.config[opt.key] === 1;
      });

      // Max occupancy, check-in, check-out don't need conversion
    }
  });
}


saveConfig() {
  const payload = { ...this.config };

  this.configOptions.forEach((opt: { key: string | number; }) => {
    payload[opt.key] = this.config[opt.key] ? 1 : 0;
  });

  this.http.post<any>(apiurl+'/save_location_config', payload)
    .subscribe(res => {
      if (res.status) {
        alert('Configuration saved successfully.');
      } else {
        alert('Failed to save configuration.');
      }
    });
}

}
