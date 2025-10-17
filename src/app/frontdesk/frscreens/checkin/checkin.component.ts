
import { NgIf, NgFor, NgForOf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { CheckService } from 'src/app/core/services/checkin.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent {
  public logininfo: any = [];
  public checkin_info: any = [];
  public room_proplist: any = [];
  public show_form = 1;
  public totalMale = 0;
  public totalFemale = 0;
  public totalChildren = 0;
  public totalGuests = 0;

  reservation_form!: FormGroup;
  document_form!: FormGroup;

  constructor(private fb: FormBuilder, private _reservationService: ReservationService, private _checkService: CheckService) {

    this.reservation_form = this.fb.group({
      segment: [''],
      guest_honer: ['',],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', Validators.required],
      companyname: [''],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      billinginfo: ['', Validators.required],
      nationality: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      checkin_date: ['', Validators.required],
      no_of_nights: ['', Validators.required],
      checkout_date: ['', Validators.required],
      booking_status: ['confirmed', Validators.required]
    });

    this.document_form = this.fb.group({
      documents: this.fb.array([])
    });
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo);

    this.checkin_info = localStorage.getItem('user_checkin_info');
    this.checkin_info = JSON.parse(this.checkin_info)
    console.log(this.checkin_info);

    this.reservation_form.patchValue(this.checkin_info.checkininfo);
    this.reservation_form.patchValue({
      booking_status: ['confirmed']
    })
    this.guests_count()

    var location_id = this.logininfo.location_id
    this._reservationService.room_properties(location_id).subscribe({
      next: (data) => {
        // console.log(data)
        if (data.status) {
          this.room_proplist = data.content;
          // console.log(this.room_proplist)
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        this.room_proplist = [];
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    const docs = this.document_form?.get('documents')?.value;

    if (docs) {
      docs.forEach((file: string | Blob, i: number) => {
        if (file) {
          formData.append(`document_${i + 1}`, file);
        }
      });
    }

    // Save FormData to the service
    this._checkService.setDocuments(formData);

    // Save rest of data to localStorage
    const obj = {
      checkininfo: this.reservation_form.value,
      room_info: this.checkin_info.room_info
    };

    localStorage.setItem('user_checkin_info', JSON.stringify(obj));
    // this._router.navigate(['#/frontdesk/payment']);  // Use Angular router instead of window.location
    window.location.href = "#/frontdesk/payment"
  }

  onNext() {
    console.log(this.checkin_info.room_info)
    this.show_form = 2
  }

  guests_count() {
    this.totalMale = 0;
    this.totalFemale = 0;
    this.totalChildren = 0;

    this.checkin_info.room_info.rooms.forEach((room: { male: any; female: any; children: any; }) => {
      this.totalMale += parseInt(room.male || '0', 10);
      this.totalFemale += parseInt(room.female || '0', 10);
      this.totalChildren += parseInt(room.children || '0', 10);
    });
    this.totalGuests = this.totalMale + this.totalFemale + this.totalChildren
    // Clear and rebuild file input controls
    const documentsArray = this.document_form.get('documents') as FormArray;
    documentsArray.clear();
    for (let i = 0; i < this.totalGuests; i++) {
      documentsArray.push(this.fb.control(null, Validators.required));
    }
  }

  get documentsControls() {
    return (this.document_form.get('documents') as FormArray).controls;
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    const documentsArray = this.document_form.get('documents') as FormArray;
    documentsArray.at(index).setValue(file);
  }
  

  getValidationClass(controlName: string): string {
    const control = this.reservation_form.get(controlName);
    if (!control) return '';
    if (control.touched && control.invalid) return 'is-invalid';
    if (control.touched && control.valid) return 'is-valid';
    return '';
  }
}
