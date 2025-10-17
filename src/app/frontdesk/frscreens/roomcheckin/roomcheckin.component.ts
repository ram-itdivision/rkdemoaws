// guest-reservation.component.ts
import { NgIf, NgFor, NgForOf, NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckService } from 'src/app/core/services/checkin.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { HttpClient } from '@angular/common/http'
import { apiurl } from 'src/environments/environment.development';
import { forkJoin } from 'rxjs';


interface ServiceEntry {
  selectedService: any;
  amount: number;
  gst_percent: number;
}

@Component({
  selector: 'app-roomcheckin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './roomcheckin.component.html',
  styleUrl: './roomcheckin.component.css'
})


export class RoomcheckinComponent implements OnInit {

  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('fileInputPhoto') fileInputPhoto!: ElementRef;

  guest_form!: FormGroup;
  guest_id: any;
   room_id:any;
  rooms_info_form!: FormGroup;
  document_form!: FormGroup;
  payment_form!: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  tomorrow: string = (() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split('T')[0];
  })();

  public logininfo: any = [];
  public room_proplist: any = [];
  public rooms_list: any = [];
  public user_mobile_no: any = '';
  public room_category_list: any = [];
  public room_plan_list: any = [];
  uniqueRoomProperties: string[] = [];
  selectedProperty: string = '';
  selected_guest_id: any = '';
  selected_guest_info: any = [];
  allRoomData: any[] = []; // full original data
  showGuestInfo: boolean = true;
  showRoomInfo: boolean = false;
  showProofInfo: boolean = false;
  showPaymentInfo: boolean = false;
  roomBillingSummary: any = [];
  rooms_booking: any = false
  imagePreviews: string[] = [];

  documentFiles: File[] = [];
  photoFile: File | null = null;

  showCamera = false;
  photoCaptured = false;
  capturedImage: string | null = null;
  videoStream: MediaStream | null = null;


  webcamActive = false;
  idProofFile: File | null = null;
  guestPhotoFile: File | null = null;


  serviceList: any = []; // Populate this from API
  serviceEntries: ServiceEntry[] = [];
  storedGuestData: any;
  pdfFileNames: any;
  selectedplanname: any;
  selected_doc_info:any;
  hasExistingDocument : any;

  constructor(
    private fb: FormBuilder,
    private _reservationService: ReservationService,
    private _checkService: CheckService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly http: HttpClient,
  ) {

    this.guest_form = this.fb.group({
      guest_details_location_id: [this.logininfo.location_id],
      booking_from: ['Walk In'],
      guest_honor: ['Mr.'],
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
      address: ['', Validators.required]
    });

    //this.guest_form.get('booking_from')?.setValue('Walk In');

    this.rooms_info_form = this.fb.group({
      rooms: this.fb.array([this.createRoomGroup()])
    });

    this.document_form = this.fb.group({
      documents: this.fb.array([])
    });

    this.payment_form = this.fb.group({
      payment_type: [''],
      currency_type: ['INR'],
      amount: ['0'],
      payment_details: [''],
      payment_reference: ['']
    });

  }

  ngOnInit() {
    this.logininfo = JSON.parse(localStorage.getItem('logindata') || '{}');
    // console.log(this.logininfo)

  this.route.queryParams.subscribe(params => {
      this.selected_guest_id = params['gid'];
      this.room_id = params['rid']; 


      if (this.selected_guest_id) {
        this._reservationService.get_guest_info(this.selected_guest_id).subscribe((res: any) => {
          if (res.status && res.content.length > 0) {
            this.selected_guest_info = res.content[0];
            console.log(this.selected_guest_info);
            this.patchGuestForm(this.selected_guest_info);
           // this.toggleSection('room');
          }

          var docobj={
            "location_id":this.logininfo.location_id,
            "guest_id": this.selected_guest_id
          }
           this._reservationService.get_guest_documents(docobj).subscribe((res: any) => {
            console.log(res.content)
          if (res.content.length > 0) {
            console.log(res.content)
            this.selected_doc_info = res.content[0];
            this.hasExistingDocument = true;
          } else {
            this.hasExistingDocument = false;
          }
      
           });

     if (this.room_id) {
        this._reservationService.get_room_info(this.room_id).subscribe((res: any) => {
          if (res.status && res.content.length > 0) {
            this.patchRoomForm(res.content[0],this.selected_guest_info);
          }


          this.get_rooms_plan_async(res.content[0].room_category)
        });
      }

        });


        
      }

    });

    var location_id = this.logininfo.location_id
    this._reservationService.room_category(location_id).subscribe({
      next: (data) => {
        // console.log(data)
        if (data.status && Array.isArray(data.content)) {
          this.room_category_list = data.content; // Save original data
        } else {
          this.room_category_list = [];
        }
      },
      error: () => {
        this.room_category_list = [];
      }
    });

    this._reservationService.get_addservice(location_id).subscribe(data => {
      // console.log(data)
      this.serviceList = data
    })

    this.rooms.valueChanges.subscribe(() => {
      this.generateDocumentControls();
    });
  }

  patchRoomForm(roomData: any, guestData: any) {
  const roomArray = this.rooms_info_form.get('rooms') as FormArray;
  roomArray.clear();

  const roomsToPatch = Array.isArray(roomData) ? roomData : [roomData];

  console.log(roomData)
  console.log(guestData)

  roomsToPatch.forEach((room: any) => {
    roomArray.push(this.fb.group({
      main_guest:[guestData?.guest_name || '', Validators.required],
      type: [room.room_category || '', Validators.required],
      plan: [room.plan || '', Validators.required],
      room_no: [room.room_name || '', Validators.required],
      price: [room.price || '', Validators.required],
      gst: [room.gst_price, [Validators.required]],
      pricetotal: [room.price, [Validators.required]],
      male: [guestData?.men ?? '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      female: [guestData?.women ?? '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      children: [guestData?.child ?? '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      checkin_date: [guestData?.checkin_date || '', Validators.required],
      no_of_nights: [guestData?.checkout_nights || 1, [Validators.required, Validators.min(1)]],
      checkout_date: [guestData?.checkout_date || '', Validators.required],
      booking_status: ['confirmed', Validators.required]
    }));
  });
}

  get_rooms_plan_async(room_type_id: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const category = this.room_category_list.find((e: { location_category_id: any; }) => e.location_category_id == room_type_id);

      if (!category) {
        resolve();
        return;
      }

      const plan$ = this._reservationService.rooms_plan(category.location_category_id);
      const room$ = this._reservationService.room_by_category(category.category_location_id, category.location_category_id);

      forkJoin([plan$, room$]).subscribe({
        next: ([planRes, roomRes]) => {
          this.room_plan_list = (planRes.status && Array.isArray(planRes.content)) ? planRes.content : [];
          this.rooms_list = (roomRes.status && Array.isArray(roomRes.content)) ? roomRes.content : [];
          resolve();
        },
        error: () => {
          this.room_plan_list = [];
          this.rooms_list = [];
          resolve(); // continue even on failure
        }
      });
    });
  }


  getRoomTypeById(catid: string): string {
    const room = this.room_category_list.find((r: { location_category_id: string; }) => r.location_category_id === catid);
    return room ? room.location_category_id : '';
  }

  getPlanNameById(planId: string): string {
    console.log(this.room_plan_list)
    const plan = this.room_plan_list.find((p: { planid: string; }) => p.planid === planId); // Adjust `id` key accordingly
    return plan ? plan.id : '';
  }

  getRoomById(roomid: string): string {
    console.log(this.rooms_list)
    const room = this.rooms_list.find((r: { roomid: string; }) => r.roomid === roomid);
    return room ? room.roomid : '';
  }

  patchGuestForm(guestData: any) {
    this.guest_form.patchValue({
      location_id: guestData.guest_details_location_id || '',
      booking_from: guestData.booking_from || '',
      guest_honor: guestData.guest_honor || '',
      guest_name: guestData.guest_name || '',
      guest_lastname: guestData.guest_lastname || '',
      companyname: guestData.companyname || '',
      guest_mobile: guestData.guest_mobile || '',
      guest_email: guestData.guest_email || '',
      billing_to: guestData.billing_to || '',
      nationality: guestData.nationality || '',
      guest_country: guestData.guest_country || '',
      guest_state: guestData.guest_state || '',
      guest_city: guestData.guest_city || '',
      address: guestData.address || ''
    });
  }

  getValidationClass(controlName: string): string {
    const control = this.guest_form.get(controlName);
    if (control?.touched || control?.dirty) {
      return control.invalid ? 'is-invalid' : 'is-valid';
    }
    return '';
  }

  addGuest() {


      this._reservationService.update_guest_info(this.selected_guest_id,this.guest_form.value).subscribe({
        next: (data) => {
            console.log(data);

        if (this.guest_form.valid) {
   
      
          localStorage.setItem('formstep', '2');
         this.storedGuestData = this.guest_form.value;

          this.toggleSection('room');
       
        } else {
          this.guest_form.markAllAsTouched();
        }
      }

      });
  }

  addBooking() {
    let formValid = true;

    this.rooms.controls.forEach((room: AbstractControl) => {
      if (room.invalid) {
        room.markAllAsTouched();
        formValid = false;
      }
    });

    if (formValid) {
      console.log(this.rooms_info_form.value)
      // console.log(this.selected_guest_info)
      const formattedRooms = this.rooms_info_form.value.rooms.map((room: any) => {
        const plan = this.room_plan_list.find((p: any) => p.planid === room.plan);
        const type = this.room_category_list.find((t: any) => t.location_category_id === room.type);
        const roomDetails = this.rooms_list.find((r: any) => r.room_name === room.room_no);



        return {
          location_id: this.logininfo.location_id,
          loged_user:1,
          booking_id: this.storedGuestData.booking_id ? this.storedGuestData.booking_id : "-",
          room_id: roomDetails.roomid,
          guest_honor: this.storedGuestData.guest_honor,
          guest_name: this.storedGuestData.guest_name,
          guest_lastname:this.storedGuestData.guest_lastname,
          guest_mobile: this.storedGuestData.guest_mobile,
          companyname: this.storedGuestData.companyname,
          guest_email: this.storedGuestData.guest_email,
          guest_city: this.storedGuestData.guest_city,
          address: this.storedGuestData.address,
          check_in: room.checkin_date,
          check_out: room.checkout_date,
          amount: room.price,
          booking_from: this.storedGuestData.booking_from,
          gci_room_stage: "checkin",
          gci_room_comment: "Early Checkin",
          number_of_nights: room.no_of_nights,
          men: Number(room.male),
          women: Number(room.female),
          child: Number(room.children),
          room_plan_id : room.plan,
          room_type : room.type,
          plan_name: plan?.plan_name || '',
          room_type_name: type?.location_category_name || '',
          room_display_no: roomDetails?.room_name || ''
        };
      });


      console.log(formattedRooms[0])

      this._reservationService.add_checkin(formattedRooms[0]).subscribe({
        next: (data) => {
            console.log(data);
          if (data.status) {
            console.log('working...');
            this.selected_guest_id = data.guestid;
            this.selected_guest_info.checkin_id = data.checkin;
            this.roomBillingSummary = this.rooms.value.map((room: { plan: string; no_of_nights: string | number; room_no: any; }) => {
              const plan = this.getPlanDetails(room.plan);
              
              const roomDetails = this.rooms_list.find((r: any) => r.roomid === room.room_no);
              // console.log(roomDetails)

              const nights = +room.no_of_nights;
              const basePrice = +(plan?.plan_price || 0);
              const gstPercentage = +(plan?.gst_percentage || 0);
              const gstAmount = ((basePrice * gstPercentage) / 100) * nights;

              return {
                roomNo: this.room_id,
                planName: plan.plan_name,
                nights,
                basePrice,
                gstPercentage,
                gstAmount,
                total: (basePrice * nights) + gstAmount
              };
            });
            this.generateDocumentControls();
            this.toggleSection('proof');
          } else {
            alert("Error Occured, Please try Again")
          }
        },
        error(err) {
          console.log("Error", +err)
          alert("Error Occured, Please try Again")
        }
      })

    } else {
      console.warn("Some room fields are invalid. Please check the form.");
    }
  }

  addIdentification() {
    const formData = new FormData();
    formData.append('guest_master_id', this.selected_guest_id);
    formData.append('guest_location_id', '2');
    formData.append('guest_room_id', this.rooms_info_form.value.rooms[0].room_no);
    formData.append('booking_id', this.selected_guest_info.booking_id ? this.selected_guest_info.booking_id :'-');
    formData.append('checkin_id', this.selected_guest_info.checkin_id);

  this.documentFiles.forEach(file => {
    if (file) {
      formData.append('guest_documents[]', file);
    }
  });
  

    if (this.photoFile) {
      formData.append('guest_photo', this.photoFile);
    }

    console.log(formData)
    console.log(this.selected_guest_id)
    // this.toggleSection('payment');

    this.http.post(apiurl + '/upload_documents', formData).subscribe(data => {
    })
    this.toggleSection('payment')
  }

   nextIdentification() {
    
    this.toggleSection('payment')
  }

  onSubmit() {
    const obj = {
      guest_master_id: parseInt(this.selected_guest_id),
      checkin_id: this.selected_guest_info.checkin_id,
      guest_room_id: 0,
      location_id: this.logininfo.location_id,
      payment_mode: this.payment_form.value.payment_type,
      amount_paid: this.payment_form.value.amount,
      payment_status: "Success",
      payment_reference: this.payment_form.value.payment_reference,
      remarks: this.payment_form.value.payment_details,
      created_by: 1,
      rooms_info: this.roomBillingSummary,
      services_info: this.serviceEntries
    };

    console.log("Submitting payment object:", obj);

    this._checkService.post_payment(obj).subscribe({
      next: (data) => {
        console.log("API Response:", data);

        if (data?.status) {
          alert("Data Submitted Successfully..!");

          const receiptNo = data.receipt_no || '';
          this.router.navigate(['receipt'], {
            queryParams: {
              guest_id: this.selected_guest_id,
              rec_id: receiptNo
            }
          });

        } else {
          alert("Error Occurred: Invalid response status");
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        alert("Error Occurred, Please try again");
      }
    });
  }

  add_service() {
    this.serviceEntries.push({
      selectedService: '',
      amount: 0,
      gst_percent: 0,
    });
  }

  onServiceChange(index: number) {
    const entry = this.serviceEntries[index];
    const selected = entry.selectedService;

    if (selected) {
      const baseAmount = parseFloat(selected.service_price || '0');
      const gst = parseFloat(selected.gst_percent || '0');
      const gstAmount = (baseAmount * gst) / 100;
      const total = baseAmount + gstAmount;

      entry.amount = +total.toFixed(2);
      entry.gst_percent = gst;
    } else {
      entry.amount = 0;
      entry.gst_percent = 0;
    }
  }

  removeService(index: number) {
    this.serviceEntries.splice(index, 1);
  }


  getRoomChargesTotal(): number {
    return this.roomBillingSummary.reduce((acc: any, x: { total: any; }) => acc + x.total, 0);
  }

  getServiceChargesTotal(): number {
    return this.serviceEntries.reduce((acc, s) => acc + (+s.amount || 0), 0);
  }
  getTotalRoomBilling(): number {
    this.payment_form.patchValue({
      amount : this.getRoomChargesTotal() + this.getServiceChargesTotal()
    })
    return this.getRoomChargesTotal() + this.getServiceChargesTotal();
  }

  get_rooms_plan(dt: any) {
    // // console.log(dt.target.value)
    var plan_id = this.room_category_list.filter((e: { location_category_id: any; }) => e.location_category_id == dt.target.value)
    // console.log(plan_id)
    // return false
    this._reservationService.rooms_plan(plan_id[0].location_category_id).subscribe({
      next: (data) => {
        if (data.status && Array.isArray(data.content)) {
          this.room_plan_list = data.content;
        } else {
          this.room_plan_list = [];
        }
      },
      error: () => {
        this.room_plan_list = [];
      }
    });

    this._reservationService.room_by_category(plan_id[0].category_location_id, plan_id[0].location_category_id).subscribe({
      next: (data) => {
        // // console.log(data)
        if (data.status && Array.isArray(data.content)) {
          this.rooms_list = data.content
        } else {
          this.rooms_list = []
        }
        // return false
      }
    })
  }

  getPlanDetails(planName: string) {
    // console.log(this.room_plan_list)
    return this.room_plan_list.find((plan: { planid: any; }) => plan.planid === planName);
  }

  onPlanSelected(event: any, index: number) {
  const selectedPlanId = event.target.value;
  const selectedPlan = this.room_plan_list.find((room: { planid: any }) => room.planid === selectedPlanId);
  this.selectedplanname = selectedPlan.plan_name


  if (selectedPlan) {
    this.rooms.at(index).patchValue({
      price: selectedPlan.plan_price,
      gst: selectedPlan.gst_amount,
      pricetotal: (selectedPlan.plan_price*1) + (selectedPlan.gst_amount*1)
    });
  } else {
    this.rooms.at(index).patchValue({
      price: '',
      gst: '',
      pricetotal: ''
    });
  }
}


  updateCheckoutDate(index: number) {
    const room = this.rooms.at(index);

    const checkinDateValue = room.get('checkin_date')?.value;
    const noOfNights = +room.get('no_of_nights')?.value || 0;

    if (checkinDateValue && noOfNights > 0) {
      const checkinDate = new Date(checkinDateValue);
      checkinDate.setHours(12, 0, 0); // Set check-in to 12 PM

      const checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + noOfNights);
      checkoutDate.setHours(11, 0, 0); // Set check-out to 11 AM

      room.get('checkout_date')?.setValue(this.formatDateTime(checkoutDate), { emitEvent: false });
    }
  }

  updateNoOfNights(index: number) {
    const room = this.rooms.at(index);

    const checkinDateValue = room.get('checkin_date')?.value;
    const checkoutDateValue = room.get('checkout_date')?.value;

    if (checkinDateValue && checkoutDateValue) {
      const checkin = new Date(checkinDateValue);
      const checkout = new Date(checkoutDateValue);

      // Calculate difference in milliseconds and convert to days
      const diffTime = checkout.getTime() - checkin.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      room.get('no_of_nights')?.setValue(diffDays, { emitEvent: false });
    }
  }

  getRoomValidationClass(room: AbstractControl, controlName: string): string {
    const control = room.get(controlName);
    if (!control) return '';
    if (control.touched && control.invalid) return 'is-invalid';
    if (control.touched && control.valid) return 'is-valid';
    return '';
  }

onFileSelected(event: Event, index: number) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];

    // Save to file array
    this.documentFiles[index] = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviews[index] = '';
    }
  }
}



removePreview(index: number): void {
  this.imagePreviews[index] = '';
  this.pdfFileNames[index] = '';
  this.documentFiles[index] = undefined!; // or use splice if you want to shift

  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs[index]) {
    (fileInputs[index] as HTMLInputElement).value = '';
  }
}


  get documentsControls() {
    return (this.document_form.get('documents') as FormArray).controls;
  }

  get rooms(): FormArray {
    return this.rooms_info_form.get('rooms') as FormArray;
  }

  createRoomGroup(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      plan: ['', Validators.required],
      room_no: ['', Validators.required],
      price: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      pricetotal: ['', [Validators.required]],
      male: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      female: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      children: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      checkin_date: ['', Validators.required],
      no_of_nights: ['', [Validators.required, Validators.min(1)]],
      checkout_date: ['', Validators.required],
      booking_status: ['confirmed', Validators.required]
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoomGroup());
    this.generateDocumentControls(); // update document fields
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
    this.generateDocumentControls(); // update document fields
  }

  generateDocumentControls() {
    const documentsArray = this.fb.array([]);
    let totalGuests = 0;

    this.rooms.controls.forEach((room) => {
      const male = parseInt(room.get('male')?.value || '0', 10);
      const female = parseInt(room.get('female')?.value || '0', 10);
      const children = parseInt(room.get('children')?.value || '0', 10);
      totalGuests += male + female + children;
    });

    for (let i = 0; i < totalGuests; i++) {
      documentsArray.push(this.fb.control(null));
    }

    this.document_form.setControl('documents', documentsArray);
    // console.log(this.document_form.value)
  }

  toggleSection(section: 'guest' | 'room' | 'proof' | 'payment') {
    this.showGuestInfo = section === 'guest' ? !this.showGuestInfo : false;
    this.showRoomInfo = section === 'room' ? !this.showRoomInfo : false;
    this.showProofInfo = section === 'proof' ? !this.showProofInfo : false;
    this.showPaymentInfo = section === 'payment' ? !this.showPaymentInfo : false;
  }

  triggerWebcam() {
    this.showCamera = true;
    this.startCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.videoStream = stream;
      this.videoElement.nativeElement.srcObject = stream;
    }).catch((err) => {
      alert("Camera access denied.");
      this.showCamera = false;
    });
  }

  capturePhoto() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      this.capturedImage = dataUrl;
      this.photoCaptured = true;
      this.stopCamera();

      // 🔥 Convert base64 to File and assign to photoFile
      this.photoFile = this.dataURLtoFile(dataUrl, 'guest_photo.png');
    }
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }


  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCamera = false;
  }

  handlePhotoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.capturedImage = reader.result as string;
        this.photoCaptured = true;
      };
      reader.readAsDataURL(file);
    }
  }

  resetPhoto() {
    this.capturedImage = null;
    this.photoCaptured = false;
    this.fileInputPhoto.nativeElement.value = ''; // reset file input
  }

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
