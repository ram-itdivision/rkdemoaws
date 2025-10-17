import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendarreg',
  standalone: true,
  templateUrl: './calendarreg.component.html',
  styleUrls: ['./calendarreg.component.css'],
  imports: [CommonModule],
  providers: [DatePipe]
})
export class CalendarregComponent implements OnInit {
  selectedGuest: any = null;
  booking_list: any = [];
  isLoading = false;
  selected_bklist: any = [];
  viewMode: 'month' | 'week' = 'month';
  currentDate: Date = new Date();
  dtTrigger: Subject<boolean> = new Subject<boolean>();

  reservation_datatable: any;
  public logininfo: any = [];

  // FIXED: store array of bookings, not {count, type}
  bookingData: { [key: string]: any[] } = {};

  selectedDate: any;
  selectedDayBookings: any[] = [];

  constructor(
    private _reservationService: ReservationService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    console.log(this.logininfo.location_id)
    this.get_list();
    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  get_list(): void {
    this.booking_list = [];
    const obj = {
      location_id: this.logininfo.location_id,
      booking_status: "all",
      from_date: '2025-07-27',
      to_date: '2025-08-30'
    };

    this._reservationService.get_registration_list(obj).subscribe({
      next: (data) => {
        this.booking_list = data.guests;

        // group bookings by check-in date
        this.bookingData = {};
        this.booking_list.forEach((booking: any) => {
          const date = booking.checkin_date.split(" ")[0]; // yyyy-mm-dd
          if (!this.bookingData[date]) {
            this.bookingData[date] = [];
          }
          this.bookingData[date].push(booking);
        });

        console.log(this.booking_list)
        console.log(this.bookingData)
        setTimeout(() => {
          this.dtTrigger.next(true);
        }, 0);
      },
      error: () => {
        this.booking_list = [];
      }
    });
  }

  booking_info(dt: any) {
    const bkinfo = dt;
    this.isLoading = true;
    this.selected_bklist = []; // clear previous data

    this._reservationService.get_bookinginfo(bkinfo.booking_id).subscribe({
      next: (data) => {
        this.selected_bklist = data.content || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading booking info', err);
        this.selected_bklist = [];
        this.isLoading = false;
      }
    });
  }

  get_unique_roomtype(dt: any) {
    if (!dt) return "";

    const rooms = dt.split(",").map((r: string) => r.trim());
    const counts: { [key: string]: number } = {};

    rooms.forEach((room: string | number) => {
      counts[room] = (counts[room] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([room, count]) => `${room} - ${count}`)
      .join("<br>");  // use <br> for line break
  }

  openDayDetails(date: Date) {
    const formatted = this.getFormattedDate(date);
    const adjustedDate = this.adjustDateForTimezone(date);
    this.selectedDate = adjustedDate;
    this.selectedDayBookings = this.bookingData[formatted] || [];
  }

  getDaysInMonth(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null as any);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }

  getDaysInWeek(): Date[] {
    const start = new Date(this.currentDate);
    const day = start.getDay();
    const weekStart = new Date(start.setDate(start.getDate() - day));
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      days.push(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));
    }

    return days;
  }

  adjustDateForTimezone(date: Date): Date {
    const adjustedDate = new Date(date);
    const timezoneOffset = adjustedDate.getTimezoneOffset(); // Get the timezone offset
    adjustedDate.setMinutes(adjustedDate.getMinutes() - timezoneOffset); // Adjust for timezone
    return adjustedDate;
  }

  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  previous(): void {
    this.currentDate = this.viewMode === 'month'
      ? new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
      : new Date(this.currentDate.setDate(this.currentDate.getDate() - 7));
  }

  next(): void {
    this.currentDate = this.viewMode === 'month'
      ? new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
      : new Date(this.currentDate.setDate(this.currentDate.getDate() + 7));
  }
}

