// guest-reservation.component.ts
import { NgIf, NgFor,  NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckService } from 'src/app/core/services/checkin.service';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-guest-information',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgClass],
  templateUrl: './guest-information.component.html',
  styleUrl: './guest-information.component.css'
})
export class GuestInformationComponent implements OnInit {
  guest_form: FormGroup;
  guest_id: any;
  public logininfo: any = [];

  constructor(
    private fb: FormBuilder,
    private _reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.initializeForm();

    this.route.queryParams.subscribe((params) => {
      this.guest_id = params['guest_id'];

      console.log(this.guest_id)

      if (this.guest_id && localStorage.getItem('formstep') === '2') {
        this.getGuestInfo(this.guest_id);
      }
    });
  }

  initializeForm() {
    this.guest_form = this.fb.group({
      guest_details_location_id: [this.logininfo.location_id, Validators.required],
      booking_from: ['', Validators.required],
      guest_honor: ['', Validators.required],
      guest_name: ['', Validators.required],
      guest_lastname: ['', Validators.required],
      companyname: ['', Validators.required],
      guest_mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      guest_email: ['', [Validators.required, Validators.email]],
      billing_to: ['', Validators.required],
      nationality: ['', Validators.required],
      guest_country: ['', Validators.required],
      guest_state: ['', Validators.required],
      guest_city: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  getGuestInfo(guest_id: any) {
    this._reservationService.get_guest_info(guest_id).subscribe(
      (res: any) => {
        if (res.status && res.content.length > 0) {
          const guestData = res.content[0];
          console.log(guestData.guest_honor)
          
          this.guest_form.patchValue({
            guest_details_location_id: guestData.guest_details_location_id,
            booking_from: guestData.booking_from,
            guest_honor: guestData.guest_honor,
            guest_name: guestData.guest_name,
            guest_lastname: guestData.guest_lastname,
            companyname: guestData.companyname,
            guest_mobile: guestData.guest_mobile,
            guest_email: guestData.guest_email,
            billing_to: guestData.billing_to,
            nationality: guestData.nationality,
            guest_country: guestData.guest_country,
            guest_state: guestData.guest_state,
            guest_city: guestData.guest_city,
            address: guestData.address,
          });
        }
      },
      (err) => {
        console.error('Failed to fetch guest info', err);
      }
    );
  }

  getValidationClass(controlName: string) {
    const control = this.guest_form.get(controlName);
    if (control?.touched) {
      return control.invalid ? 'is-invalid' : 'is-valid';
    }
    return '';
  }

  addGuest() {
    if (this.guest_form.valid) {
      this._reservationService.book_reservation(this.guest_form.value).subscribe(
        (res: any) => {
          localStorage.setItem('formstep', '2');
          localStorage.setItem('guest_id', res.guest_id);
          this.router.navigate(['/addreservation'], {
            queryParams: { guest_id: res.guest_id },
          });
        },
        (err) => {
          console.error(err);
          alert('Failed to save guest information.');
        }
      );
    } else {
      this.guest_form.markAllAsTouched();
    }
  }
}