import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html'
})
export class BookingDetailsComponent implements OnInit {
  rooms_info_form!: FormGroup;
  room_category_list: any[] = [];
  guest_id: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.guest_id = this.route.snapshot.queryParamMap.get('guest_id') || localStorage.getItem('guest_id');
    if (!this.guest_id) {
      this.router.navigate(['/reservation/guest']);
    }

    this.initForm();
    this.getRoomCategories();
  }

  initForm() {
    this.rooms_info_form = this.fb.group({
      rooms: this.fb.array([])
    });
    this.addRoom();
  }

  get rooms() {
    return this.rooms_info_form.get('rooms') as FormArray;
  }

  addRoom() {
    this.rooms.push(this.fb.group({
      checkin_date: ['', Validators.required],
      no_of_nights: ['', Validators.required],
      checkout_date: ['', Validators.required],
      type: ['', Validators.required],
      plan: ['', Validators.required],
      price: ['', Validators.required],
      room_no: ['', Validators.required],
      male: ['', Validators.required],
      female: ['', Validators.required],
      children: ['', Validators.required],
      booking_status: ['', Validators.required],
      planOptions: [[]],
      roomOptions: [[]]
    }));
  }

  getRoomCategories() {
    this._reservationService.room_category(2).subscribe((res: any) => {
      this.room_category_list = res.data || [];
    });
  }

  onTypeSelected(room: FormGroup, index: number) {
    const type = room.get('type')?.value;
    this._reservationService.rooms_plan(type).subscribe((res: any) => {
      room.patchValue({ plan: '', price: '', room_no: '' });
      room.get('planOptions')?.setValue(res.plans);
    });

    this._reservationService.room_category(2).subscribe((res: any) => {
      room.get('roomOptions')?.setValue(res.rooms);
    });
  }

  onPlanSelected(room: FormGroup, index: number) {
    const plan = room.get('plan')?.value;
    this._reservationService.room_category(plan).subscribe((res: any) => {
      room.patchValue({ price: res.tariff });
    });
  }

  updateCheckoutDate(index: number) {
    const room = this.rooms.at(index);
    const checkin = new Date(room.get('checkin_date')?.value);
    const nights = Number(room.get('no_of_nights')?.value);
    if (checkin && nights) {
      const checkout = new Date(checkin);
      checkout.setDate(checkout.getDate() + nights);
      room.patchValue({ checkout_date: checkout.toISOString().slice(0, 16) });
    }
  }

  submitBooking() {
    if (this.rooms_info_form.valid) {
      const payload = {
        guest_id: this.guest_id,
        rooms: this.rooms_info_form.value.rooms
      };
      this._reservationService.room_category(payload).subscribe(() => {
        this.router.navigate(['/reservation/identification'], { queryParams: { guest_id: this.guest_id } });
      });
    }
  }
}
