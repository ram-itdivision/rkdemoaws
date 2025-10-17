// guest-reservation.component.ts
import { NgIf, NgFor, NgForOf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { CheckService } from 'src/app/core/services/checkin.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { FloorsComponent } from "../floors/floors.component";
import { RoomcategoryComponent } from "../roomcategory/roomcategory.component";
import { RoomconfigComponent } from "../roomconfig/roomconfig.component";
import { RoomfeaturesComponent } from "../roomfeatures/roomfeatures.component";
import { RoomplannerComponent } from "../roomplanner/roomplanner.component";

@Component({
  selector: 'app-roomsettings',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass, FloorsComponent, RoomcategoryComponent, RoomconfigComponent, RoomfeaturesComponent, RoomplannerComponent],
  templateUrl: './roomsettings.component.html',
  styleUrl: './roomsettings.component.css'
})
export class RoomsettingsComponent {

  guest_form!: FormGroup;
  rooms_info_form!: FormGroup;

  public logininfo: any = []
  public room_proplist: any = [];
  public rooms_list: any = [];
  public user_mobile_no: any = '';
  // public booking_status: any;
  uniqueRoomProperties: string[] = [];
  selectedProperty: string = '';
  allRoomData: any[] = []; // full original data
  showGuestInfo: boolean = true;
  showRoomInfo: boolean = false;
  showProofInfo: boolean = false;
  showPaymentInfo: boolean = false;
  document_form!: FormGroup;

  webcamActive = false;
  capturedImage: string | null = null;
  idProofFile: File | null = null;
  guestPhotoFile: File | null = null;


  constructor(private fb: FormBuilder, private _reservationService: ReservationService, private _checkService: CheckService) {

    this.guest_form = this.fb.group({
      segment: ['', Validators.required],
      guest_honer: ['', Validators.required],
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
      booking_status: ['pending', Validators.required]
    });

    this.rooms_info_form = this.fb.group({
      rooms: this.fb.array([this.createRoomGroup()])
    });


    
        this.guest_form = this.fb.group({
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
        });  }


  toggleSection(section: 'guest' | 'room' | 'proof'  | 'payment') {
    if (section === 'guest') {
      this.showGuestInfo = !this.showGuestInfo;
      if (this.showGuestInfo) this.showRoomInfo = false;
      if (this.showGuestInfo) this.showProofInfo = false;
      if (this.showPaymentInfo) this.showPaymentInfo = false;
    } else if(section === 'room') {
      this.showRoomInfo = !this.showRoomInfo;
      if (this.showRoomInfo) this.showGuestInfo = false;
      if (this.showGuestInfo) this.showProofInfo = false;
      if (this.showPaymentInfo) this.showPaymentInfo = false;
    } else if(section === 'proof') {
      this.showProofInfo = !this.showProofInfo;
      if (this.showGuestInfo) this.showGuestInfo = false;
      if (this.showRoomInfo) this.showRoomInfo = false;
      if (this.showPaymentInfo) this.showPaymentInfo = false;
    } else if(section === 'payment') {
      this.showPaymentInfo = !this.showPaymentInfo;
      if (this.showGuestInfo) this.showGuestInfo = false;
      if (this.showRoomInfo) this.showRoomInfo = false;
      if (this.showProofInfo) this.showProofInfo = false;
    }
  }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo);

    var location_id = this.logininfo.location_id
    this._reservationService.room_properties(location_id).subscribe({
      next: (data) => {
        // console.log(data)
        if (data.status) {
          // console.log("entered")
          this.room_proplist = data.content;
          console.log(this.room_proplist)
        } else {

          // console.log("entered2")
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        this.room_proplist = [];
      }
    });

    var obj = {
      "location_id": this.logininfo.location_id,
      "user_id": 140,
      "status": "vacant"
    }
    this._checkService.get_roomlist(obj).subscribe({
      next: (data) => {
        console.log(data)
        if (data.status && Array.isArray(data.content)) {
          this.allRoomData = data.content; // Save original data
        }
      },
      error: () => {
        this.rooms_list = [];
      }
    });
  }

  addGuest(){
    console.log(this.guest_form.value)
    this.toggleSection('room');
  }
  addBooking(){
    //console.log(this.guest_form.value)
    this.toggleSection('proof');
  }
  addIdentification(){
    //console.log(this.guest_form.value)
    this.toggleSection('payment');
  }

  filterRoomsByProperty(property: any) {
    this.selectedProperty = property.target.value;
    // console.log(this.selectedProperty)
    // console.log(this.allRoomData)

    this.rooms_list = this.allRoomData.flatMap((floor: any) =>
      (floor.rooms || [])
        .filter((room: any) =>
          room.room_status?.toLowerCase() === 'vacant' &&
          (!property || room.properties?.some((p: any) => p.properties_name === this.selectedProperty))
        )
        .map((room: any) => ({
          room_id: room.room_id,
          room_name: room.room_name,
          room_status: room.room_status,
          floor_id: floor.floor_id,
          floor_name: floor.floor_name
        }))
    );
    console.log(this.rooms_list)
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.guestPhotoFile = file;
    }
  }

  onIdUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.idProofFile = file;
    }
  }

  startWebcam(): void {
    this.webcamActive = true;
    setTimeout(() => {
      const video = document.getElementById('webcam') as HTMLVideoElement;
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          video.srcObject = stream;
          video.play();
        }).catch(err => console.error('Webcam error:', err));
      }
    }, 200);
  }

  capturePhoto(): void {
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      this.capturedImage = canvas.toDataURL('image/png');
    }
  }

  get_guest_details() {
    this._reservationService.guest_details(this.user_mobile_no).subscribe({
      next: (data) => {
        console.log(data)
        if (data.status && Array.isArray(data.content)) {
          var user_details = data.content[0]
          this.guest_form.patchValue({
            guest_honer: user_details.guest_honor,
            firstname: user_details.guest_name,
            lastname: user_details.guest_lastname,
            companyname: user_details.companyname,
            mobile: user_details.guest_mobile,
            email: user_details.guest_email,
            nationality: user_details.nationality,
            country: user_details.guest_country,
            state: user_details.guest_state,
            city: user_details.guest_city,
            address: user_details.address,
            billinginfo: user_details.billing_to,
            booking_status: 'pending'
          });
        } else {
          alert("No data found with this number")
        }
      },
      error: () => {
        alert("No data found with this number")
        // this.rooms_list = [];
      }
    });
  }

  onSubmit() {
    console.log(this.guest_form.value)
    if (this.guest_form.invalid) {
      const missingFields: string[] = [];

      Object.keys(this.guest_form.controls).forEach((key) => {
        const control = this.guest_form.get(key);
        if (control && control.invalid) {
          control.markAsTouched(); // trigger red border + error text

          // Push human-readable field names (customize as needed)
          const fieldNames: any = {
            guest_honer: 'Guest Honor',
            segment: 'Segment',
            firstname: 'First Name',
            lastname: 'Last Name',
            // companyname: 'Company Name',
            email: 'Email',
            mobile: 'Mobile No',
            billinginfo: 'Billing Info',
            // checkin_date: 'Arrival Date',
            // no_of_nights: 'No. of Nights',
            // checkout_date: 'Departure Date',
            address: 'Address',
            nationality: 'Nationality',
            country: 'Country',
            state: 'State',
            city: 'City'
          };

          if (fieldNames[key]) {
            missingFields.push(fieldNames[key]);
          } else {
            missingFields.push(key); // fallback
          }
        }
      });
      return;
    } else {

      let men_total = 0;
      let women_total = 0;
      let child_total = 0;

      const roomData = this.rooms_info_form.value.rooms;

      roomData.forEach((room: any) => {
        men_total += Number(room.male || 0);
        women_total += Number(room.female || 0);
        child_total += Number(room.children || 0);
      });

      // console.log(this.guest_form.value)
      // console.log(this.rooms_info_form.value)
      var obj = {
        "guest_honor": this.guest_form.value.guest_honer,
        "guest_name": this.guest_form.value.firstname,
        "guest_lastname": this.guest_form.value.lastname,
        "companyname": this.guest_form.value.companyname,
        "guest_email": this.guest_form.value.email,
        "guest_mobile": this.guest_form.value.mobile,
        "billing_to": this.guest_form.value.billinginfo,
        // "checkin_date": this.guest_form.value.checkin_date,
        // "checkout_nights": this.guest_form.value.no_of_nights,
        // "checkout_date": this.guest_form.value.checkout_date,
        "booking_status": this.guest_form.value.booking_status,
        "address": this.guest_form.value.address,
        "booking_from": this.guest_form.value.segment,
        "nationality": this.guest_form.value.nationality,
        "guest_country": this.guest_form.value.country,
        "guest_state": this.guest_form.value.state,
        "guest_city": this.guest_form.value.city,
        "guest_details_location_id": this.logininfo.location_id,
        "booking_info": [],
        "men": men_total,
        "women": women_total,
        "child": child_total,
        "guest_details_status": 1,
        // "guest_room_id": 101,
      }
      console.log(obj)
      // return false
      this._reservationService.book_reservation(obj).subscribe({
        next: (data) => {
          // console.log(data)
          if (data.status) {
            alert(data.message)
            // location.reload()
            window.location.href = '#/frontdesk/reservation'
          }
        },
        error: (err) => {
          console.error("Request failed", err);
          alert("Erro occured, please try again")
          // location.reload()
        }
      });
    }
  }

  onCheckIn() {
    console.log("checkin")
    if (this.guest_form.invalid) {
      const missingFields: string[] = [];

      Object.keys(this.guest_form.controls).forEach((key) => {
        const control = this.guest_form.get(key);
        if (control && control.invalid) {
          control.markAsTouched(); // trigger red border + error text

          // Push human-readable field names (customize as needed)
          const fieldNames: any = {
            guest_honer: 'Guest Honor',
            segment: 'Segment',
            firstname: 'First Name',
            lastname: 'Last Name',
            // companyname: 'Company Name',
            email: 'Email',
            mobile: 'Mobile No',
            billinginfo: 'Billing Info',
            // checkin_date: 'Arrival Date',
            // no_of_nights: 'No. of Nights',
            // checkout_date: 'Departure Date',
            address: 'Address',
            nationality: 'Nationality',
            country: 'Country',
            state: 'State',
            city: 'City'
          };

          if (fieldNames[key]) {
            missingFields.push(fieldNames[key]);
          } else {
            missingFields.push(key); // fallback
          }
        }
      });
      return;
    } else {

      var obj = {
        "checkininfo": this.guest_form.value,
        "room_info": this.rooms_info_form.value
      }

      localStorage.setItem('user_checkin_info', JSON.stringify(obj));
      window.location.href = "#/frontdesk/checkin"
    }

  }
  updateCheckoutDate(i: number) {
    const roomFormArray = this.rooms_info_form.get('rooms') as FormArray;
    const roomGroup = roomFormArray.at(i) as FormGroup;

    const checkin = roomGroup.get('checkin_date')?.value;
    const nights = Number(roomGroup.get('no_of_nights')?.value);

    // console.log(roomGroup)

    if (checkin && nights > 0) {
      const checkinDate = new Date(checkin);

      // 👇 Add nights to the check-in date
      checkinDate.setDate(checkinDate.getDate() + nights);

      // 👇 Format to datetime-local format (yyyy-MM-ddTHH:mm)
      const yyyy = checkinDate.getFullYear();
      const mm = ('0' + (checkinDate.getMonth() + 1)).slice(-2);
      const dd = ('0' + checkinDate.getDate()).slice(-2);
      const hh = ('0' + checkinDate.getHours()).slice(-2);
      const min = ('0' + checkinDate.getMinutes()).slice(-2);
      const formattedCheckout = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

      // console.log(formattedCheckout)
      // 👇 Set checkout_date
      roomGroup.get('checkout_date')?.setValue(formattedCheckout);
    }
  }


  getValidationClass(controlName: string): string {
    const control = this.guest_form.get(controlName);
    if (!control) return '';
    if (control.touched && control.invalid) return 'is-invalid';
    if (control.touched && control.valid) return 'is-valid';
    return '';
  }


  get rooms(): FormArray {
    return this.rooms_info_form.get('rooms') as FormArray;
  }

  createRoomGroup(): FormGroup {

    return this.fb.group({
      type: [''],
      room_no: [''],
      price: ['2000'],
      male: ['0'],
      female: ['0'],
      children: ['0'],
      checkin_date: '',
      no_of_nights: '',
      checkout_date: '',
      booking_status: 'confirmed'
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoomGroup());
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
  }

    get documentsControls() {
    return (this.document_form.get('documents') as FormArray).controls;
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    const documentsArray = this.document_form.get('documents') as FormArray;
    documentsArray.at(index).setValue(file);
  }

}