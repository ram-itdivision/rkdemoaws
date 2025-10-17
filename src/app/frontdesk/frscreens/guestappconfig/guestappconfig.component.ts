// src/app/frontdesk/frscreens/guestappconfig/guestappconfig.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-guestappconfig',
  templateUrl: './guestappconfig.component.html',
  styleUrls: ['./guestappconfig.component.css']
})
export class GuestappconfigComponent {
  config: any = {
    enable_online_booking: 1,
    allow_late_checkin: 0,
    enable_notifications: 1,
    max_occupancy_limit: 100,
    checkin_time: '14:00',
    checkout_time: '12:00'
  };

  constructor() {}

  saveConfig() {
    console.log('Configuration saved:', this.config);
    // 👉 Here you can call a service to POST/PUT data to your backend
  }
}
