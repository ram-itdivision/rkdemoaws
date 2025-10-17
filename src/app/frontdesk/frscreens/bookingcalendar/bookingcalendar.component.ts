import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookingcalendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookingcalendar.component.html'
})
export class BookingcalendarComponent {
  public currentYear = 2025;
  public currentMonth = 7; // August (0-based index)
  public monthDays: number[] = [];
  public monthName = '';
  public selectedBooking: any = null;

  rooms = [
    { id: 101, type: '1 bed', status: 'Ready' },
    { id: 102, type: '1 bed', status: 'Clean up' },
    { id: 103, type: '1 bed', status: 'Dirty' },
    { id: 104, type: '1 bed', status: 'Ready' },
    { id: 105, type: '2 beds', status: 'Ready' }
  ];

  bookings = [
    {
      id: 1,
      roomId: 101,
      checkIn: new Date(2025, 7, 2, 10, 0),
      checkOut: new Date(2025, 7, 2, 15, 0),
      guest: "John Doe",
      payment: "Paid - ₹5000"
    },
    {
      id: 2,
      roomId: 101,
      checkIn: new Date(2025, 7, 20, 16, 0),
      checkOut: new Date(2025, 7, 21, 11, 0),
      guest: "Krish",
      payment: "Paid - ₹15000"
    },
    {
      id: 3,
      roomId: 101,
      checkIn: new Date(2025, 7, 20, 2, 0),
      checkOut: new Date(2025, 7, 24, 4, 0),
      guest: "Ram",
      payment: "Pending - ₹10000"
    },
    {
      id: 4,
      roomId: 102,
      checkIn: new Date(2025, 7, 22, 2, 0),
      checkOut: new Date(2025, 7, 26, 4, 0),
      guest: "Rayudu",
      payment: "Paid - ₹10000"
    },
    {
      id: 5,
      roomId: 103,
      checkIn: new Date(2025, 7, 5, 12, 0),
      checkOut: new Date(2025, 7, 8, 10, 0),
      guest: "Jane Smith",
      payment: "Pending - ₹3000"
    },
    {
      id: 6,
      roomId: 104,
      checkIn: new Date(2025, 7, 10, 9, 0),
      checkOut: new Date(2025, 7, 12, 18, 0),
      guest: "Family",
      payment: "Paid - ₹8000"
    },
    {
      id: 7,
      roomId: 105,
      checkIn: new Date(2025, 7, 15, 14, 0),
      checkOut: new Date(2025, 7, 19, 10, 0),
      guest: "Corporate",
      payment: "Paid - ₹12000"
    }
  ];

  ngOnInit(): void {
    this.updateMonth();
  }

  updateMonth() {
    this.generateMonthDays(this.currentYear, this.currentMonth);
    this.monthName = new Date(this.currentYear, this.currentMonth)
      .toLocaleString('default', { month: 'long' });
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.updateMonth();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateMonth();
  }

  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.updateMonth();
  }

  generateMonthDays(year: number, month: number): void {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getBookingBars(roomId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to start of day

    return this.bookings
      .filter(b =>
        b.roomId === roomId &&
        b.checkOut >= today &&
        (
          // booking overlaps with current month
          (b.checkIn.getFullYear() === this.currentYear && b.checkIn.getMonth() === this.currentMonth) ||
          (b.checkOut.getFullYear() === this.currentYear && b.checkOut.getMonth() === this.currentMonth)
        )
      )
      .map(b => {
        const startDay = b.checkIn.getMonth() === this.currentMonth ? b.checkIn.getDate() : 1;
        const endDay = b.checkOut.getMonth() === this.currentMonth
          ? b.checkOut.getDate()
          : new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        return {
          ...b,
          gridColumn: `${startDay} / ${endDay + 1}`
        };
      });
  }


  openBooking(booking: any) {
    this.selectedBooking = booking;
  }

}
