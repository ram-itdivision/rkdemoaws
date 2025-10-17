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
  selector: 'app-addclcheckin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './addclcheckin.component.html',
  styleUrl: './addclcheckin.component.css'
})
export class AddclcheckinComponent {


  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('fileInputPhoto') fileInputPhoto!: ElementRef;

  guest_form!: FormGroup;
  guest_id: any;
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

  guest_documents: any[] = [];
  imagePreviews: string[] = [];

  documentFiles: File[] = [];
  photoFile: File | null = null;
  showAddAnotherDoc: any;

  showCamera = false;
  photoCaptured = false;
  capturedImage: string | null = null;
  videoStream: MediaStream | null = null;

  checkin_id : any


  webcamActive = false;
  idProofFile: File | null = null;
  guestPhotoFile: File | null = null;


  serviceList: any = []; // Populate this from API
  serviceEntries: ServiceEntry[] = [];
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
      booking_from: [''],
      guest_honor: [''],
      guest_name: ['', Validators.required],
      guest_lastname: ['', Validators.required],
      companyname: [''],
      guest_mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      guest_email: ['', [Validators.required, Validators.email]],
      billing_to: [''],
      nationality: ['INDIAN', Validators.required],
      guest_country: ['INDIA', Validators.required],
      guest_state: ['', Validators.required],
      guest_city: ['', Validators.required],
      address: ['', Validators.required],
      reservationid: [''],
      guestbooking_id: ['']
    });

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
      due_amount: ['0'],
      payment_details: [''],
      payment_reference: ['']
    });

  }

  ngOnInit() {
    this.logininfo = JSON.parse(localStorage.getItem('logindata') || '{}');
    // // console.log(this.logininfo)


    this.guest_form.get('resrvationid')?.disable();
    this.guest_form.get('guestbooking_id')?.disable();

    var location_id = this.logininfo.location_id
    this._reservationService.room_category(location_id).subscribe({
      next: (rm_data) => {
        // // console.log(rm_data)
        if (rm_data.status && Array.isArray(rm_data.content)) {
          this.room_category_list = rm_data.content; // Save original data


          this.route.queryParams.subscribe(params => {
            var bk_id = params['guest_id'];
            // // console.log(bk_id)
            if (bk_id) {
              this._reservationService.get_checkin_bookinginfo(bk_id).subscribe((res: any) => {

                this.selected_guest_info = res.content;
                // // console.log(this.selected_guest_info);
                this.guest_form.patchValue({
                  guestbooking_id: bk_id || '',
                  reservationid: this.selected_guest_info[0].reservationid || ''
                })

                this.patchGuestForm(this.selected_guest_info[0]);
                this.setRoomsFromGuestInfo(this.selected_guest_info);
                this.get_booking_docs(bk_id);
                if (this.guest_form.valid) {
                  this.toggleSection('room');
                }
                // this.toggleSection('room');

              })
            }
          });
        } else {
          this.room_category_list = [];
        }
      },
      error: () => {
        this.room_category_list = [];
      }
    });

    this._reservationService.get_addservice(location_id).subscribe(data => {
      // // console.log(data)
      this.serviceList = data
    })

    this.rooms.valueChanges.subscribe(() => {
      this.generateDocumentControls();
    });

  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';  // handle null or undefined

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateStr);
      return '';
    }

    return date.toISOString().substring(0, 10);
  }

  async setRoomsFromGuestInfo(guestList: any) {
    this.rooms.clear();

    // // console.log(guestList)
    for (let i = 0; i < guestList.length; i++) {
      const guest = guestList[i];

      // // console.log(this.room_category_list)
      // // console.log(guest.location_category_name)
      // Find category
      const category = this.room_category_list.find(
        (c: { location_category_name: any }) => c.location_category_name === guest.location_category_name
      );

      // // console.log(category)
      if (!category) {
        // automatically add a new room row
        this.addRoom();

        return;
      }

      // // console.log(category)
      // Fetch per-room plans/rooms
      await this.get_rooms_plan_async(category.location_category_id, i);

      // // console.log(this.room_plan_list )
      // // console.log(this.rooms_list )
      // Select plan
      const selectedPlan = this.room_plan_list[i].find(
        (p: { plan_name: any }) => p.plan_name === guest.plan_name
      );

      // Select room
      const selectedRoom = this.rooms_list[i].find(
        (r: { roomid: any }) => r.roomid == guest.guest_room_id
      );


      // // console.log(category + "777777777777777")
      // Build form group
      const roomGroup = this.fb.group({
        type: [category.location_category_id, Validators.required],
        plan: [selectedPlan?.planid || '', Validators.required],
        room_no: [selectedRoom?.roomid || '', Validators.required],
        price: [selectedPlan?.plan_price || guest.plan_price || '', Validators.required],
        gst: [selectedPlan?.gst_amount || guest.gst_amount || '', Validators.required],
        pricetotal: [
          selectedPlan
            ? (parseFloat(selectedPlan.plan_price) + parseFloat(selectedPlan.gst_amount)).toFixed(2)
            : guest.plan_price && guest.gst_amount
              ? (parseFloat(guest.plan_price) + parseFloat(guest.gst_amount)).toFixed(2)
              : '',
          Validators.required
        ],
        adults: [guest.adults || '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
        children: [guest.num_children || '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
        checkin_date: [guest.checkin_date?.split(' ')[0] || '', Validators.required],
        no_of_nights: [guest.checkout_nights || 1, [Validators.required, Validators.min(1)]],
        checkout_date: [guest.checkout_date?.split(' ')[0] || '', Validators.required],
        booking_status: [guest.booking_status || 'confirmed', Validators.required],
        main_guest: [`${guest.guest_name} ${guest.guest_lastname}`.trim(), Validators.required],
      });

      this.rooms.push(roomGroup);
    }
  }

  get_rooms_plan_async(room_type_id: any, index: number): Promise<void> {
    return new Promise((resolve) => {
      const category = this.room_category_list.find(
        (e: { location_category_id: any }) => e.location_category_id == room_type_id
      );

      if (!category) {
        this.room_plan_list[index] = [];
        this.rooms_list[index] = [];
        resolve();
        return;
      }

      // // console.log(category + "2222222222222")
      const plan$ = this._reservationService.rooms_plan(category.location_category_id);
      const room$ = this._reservationService.room_by_category(category.category_location_id, category.location_category_id);

      // // console.log(plan$)
      // // console.log(room$)
      forkJoin([plan$, room$]).subscribe({
        next: ([planRes, roomRes]) => {
          this.room_plan_list[index] = (planRes.status && Array.isArray(planRes.content)) ? planRes.content : [];
          this.rooms_list[index] = (roomRes.status && Array.isArray(roomRes.content)) ? roomRes.content : [];

          // // console.log(this.room_plan_list)
          // // console.log(this.rooms_list)
          resolve();
        },
        error: () => {
          this.room_plan_list[index] = [];
          this.rooms_list[index] = [];
          resolve();
        }
      });
      // // console.log(this.room_plan_list)
      // // console.log(this.rooms_list)
    });
  }

  get_booking_docs(dt_bk_id: any) {
    // Call API to get documents by booking_id
    const obj = { location_id: this.logininfo.location_id, booking_id: dt_bk_id };
    this._checkService.getGuestDocuments(obj).subscribe({
      next: (response) => {
        if (response.status && Array.isArray(response.content)) {
          // Assign the documents to guest_documents
          this.guest_documents = response.content;

          // Check if there are documents available
          if (this.guest_documents.length > 0) {
            this.showExistingDocuments(); // Show existing documents
          } else {
            this.generateDocumentControls();
            this.showDocumentUpload(); // Show document upload form
          }
        } else {
          this.guest_documents = []; // No documents found
          this.showDocumentUpload(); // Show document upload form
        }
      },
      error: (err) => {
        console.error("Failed to fetch documents:", err);
        // this.guest_documents = []; // In case of error, no documents
        // this.showDocumentUpload(); // Show document upload form
      }
    });
  }
  showExistingDocuments() {
    this.showProofInfo = false; // Disable document upload form
    this.showAddAnotherDoc = true; // Enable option to add another document
  }

  // Show the document upload form when no documents exist
  showDocumentUpload() {
    this.showProofInfo = true; // Enable document upload form
    this.showAddAnotherDoc = false; // Disable option to add another document
  }

  getRoomTypeById(catid: string): string {
    const room = this.room_category_list.find((r: { location_category_id: string; }) => r.location_category_id === catid);
    return room ? room.location_category_id : '';
  }

  getPlanNameById(planId: string): string {
    // console.log(this.room_plan_list)
    const plan = this.room_plan_list.find((p: { planid: string; }) => p.planid === planId); // Adjust `id` key accordingly
    return plan ? plan.id : '';
  }

  getRoomById(roomid: string): string {
    // console.log(this.rooms_list)
    const room = this.rooms_list.find((r: { roomid: string; }) => r.roomid === roomid);
    return room ? room.roomid : '';
  }

  patchGuestForm(guestData: any) {
    this.guest_form.patchValue({
      guest_details_location_id: guestData.guest_details_location_id || '',
      booking_from: guestData.booking_from || '',
      guest_honor: guestData.guest_honor || '',
      guest_name: guestData.guest_name || '',
      guest_lastname: guestData.guest_lastname || '',
      companyname: guestData.companyname || '',
      guest_mobile: guestData.guest_mobile || '',
      guest_email: guestData.guest_email || '',
      billing_to: guestData.billing_to || guestData.guest_name,
      nationality: guestData.nationality || 'INDIAN',
      guest_country: guestData.guest_country || 'INDIA',
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

  savedetails() {
    var post_obj = {
      "guest_name": this.guest_form.value.guest_name,
      "guest_lastname": this.guest_form.value.guest_lastname,
      "guest_email": this.guest_form.value.guest_email,
      "guest_mobile": this.guest_form.value.guest_mobile,
      "companyname": this.guest_form.value.companyname,
      "billing_to": this.guest_form.value.billing_to,
      "guest_country": this.guest_form.value.guest_country,
      "guest_state": this.guest_form.value.guest_state,
      "guest_city": this.guest_form.value.guest_city,
      "address": this.guest_form.value.address
    }
    // // console.log(this.post_obj)
    this._reservationService.update_reservation(this.selected_guest_info[0].booking_id, post_obj).subscribe(
      (res: any) => {
        // console.log("Guest saved successfully...!")
      })
  }


  addGuest() {
    if (this.guest_form.valid) {
      this.savedetails();
      this.toggleSection('room');
    } else {
      this.guest_form.markAllAsTouched();
    }
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
      // console.log(this.rooms_info_form.value)
      // // console.log(this.selected_guest_info)
      const formattedRooms = this.rooms_info_form.value.rooms.map((room: any) => {
        const plan = this.room_plan_list.find((p: any) => p.planid === room.plan);
        const type = this.room_category_list.find((t: any) => t.location_category_id === room.type);
        const roomDetails = this.rooms_list.find((r: any) => r.room_id === room.room_no);

        return {
          guest_master_id: this.selected_guest_info[0].guest_bookin_id,
          location_id: this.selected_guest_info[0].guest_booking_location_id,
          loged_user: 1,
          booking_id: this.selected_guest_info[0].booking_id,
          room_id: room.room_no,
          guest_name: this.selected_guest_info[0].guest_name,
          guest_mobile: this.selected_guest_info[0].guest_mobile,
          check_in: room.checkin_date,
          check_out: room.checkout_date,
          amount: room.price,
          booking_from: "Contactless Checkin",
          gci_room_stage: "checkin",
          gci_room_comment: "Early Checkin",
          number_of_nights: room.no_of_nights,
          adults: Number(room.adults),
          child: Number(room.children),
          room_plan_id: room.plan,
          room_type: room.type,
          plan_name: plan?.plan_name || '',
          room_type_name: type?.location_category_name || '',
          room_display_no: roomDetails?.room_name || ''
        };
      });


      //console.log(formattedRooms)

      this._reservationService.add_contactless_checkin(formattedRooms).subscribe({
        next: (data) => {
          // // console.log(data)
          // return false

          if (data.status) {
             this.checkin_id = data.checkin;
            this.roomBillingSummary = this.rooms.value.map(
              (room: { plan: string; no_of_nights: string | number; room_no: any }, index: number) => {


                const plan = (this.room_plan_list[index] || []).find((p: any) => p.planid == room.plan);
                const roomDetails = (this.rooms_list[index] || []).find((r: any) => r.room_id == room.room_no);
                // // console.log(roomDetails)

                const nights = +room.no_of_nights;
                const basePrice = +(plan?.plan_price || 0);
                const gstPercentage = +(plan?.gst_percentage || 0);
                const gstAmount = ((basePrice * gstPercentage) / 100) * nights;

                return {
                  roomNo: roomDetails?.room_name || 'N/A',
                  planName: plan?.plan_name || 'N/A',
                  nights,
                  basePrice,
                  gstPercentage,
                  gstAmount,
                  total: (basePrice * nights) + gstAmount
                };
              }
            );

            this.generateDocumentControls();
            this.toggleSection('proof');
          } else {
            alert("Error Occured, Please try Again")
          }
        },
        error(err) {
          // console.log("Error", +err)
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
    formData.append('guest_location_id', this.selected_guest_info[0].guest_details_location_id);
    formData.append('guest_room_id', this.rooms_info_form.value.rooms[0].room_no);
    formData.append('booking_id', this.selected_guest_info[0].booking_id);
    formData.append('checkin_id', this.selected_guest_info[0].checkin_id);

    this.documentFiles.forEach(file => {
      formData.append('guest_documents[]', file);
    });

    if (this.photoFile) {
      formData.append('guest_photo', this.photoFile);
    }

    // console.log(formData)
    // console.log(this.selected_guest_id)
    // this.toggleSection('payment');

    this.http.post(apiurl + '/upload_documents', formData).subscribe(data => {
    })
    this.toggleSection('payment')
  }

  onSubmit() {
    const obj = {
      guest_master_id: parseInt(this.selected_guest_info[0].guest_bookin_id),
      checkin_id: this.checkin_id,
      booking_id: this.selected_guest_info[0].booking_id,
      guest_room_id: 0,
      location_id: this.logininfo.location_id,
      payment_mode: this.payment_form.value.payment_type,
      amount_paid: this.payment_form.value.amount,
      amount_due: this.payment_form.value.due_amount,
      payment_status: "Success",
      payment_reference: this.payment_form.value.payment_reference,
      remarks: this.payment_form.value.payment_details,
      created_by: 1,
      rooms_info: this.roomBillingSummary,
      services_info: this.serviceEntries
    };
    // console.log("Submitting payment object:", obj);

    this._checkService.post_payment(obj).subscribe({
      next: (data) => {
        // console.log("API Response:", data);

        if (data?.status) {
          alert("Data Submitted Successfully..!");

          const receiptNo = data.receipt_no || '';
          this.router.navigate(['receipt'], {
            queryParams: {
              guest_id: this.checkin_id,
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
      amount: this.getRoomChargesTotal() + this.getServiceChargesTotal()
    })
    return this.getRoomChargesTotal() + this.getServiceChargesTotal();
  }

  getAvailableRooms(index: number) {
    if (this.rooms_list.length > 0) {
      // // console.log(this.rooms_list);
      const allRooms = this.rooms_list[index] || [];

      // collect all selected room IDs (except the current row)
      const selectedRoomIds = this.rooms.controls
        .map((ctrl, idx) => idx !== index ? ctrl.get('room_no')?.value : null)
        .filter((id) => !!id);

      // filter out already selected ones
      return allRooms.filter((room: any) => !selectedRoomIds.includes(room.room_id));
    }
    return [];
  }


  get_rooms_plan(event: any, index: number) {
    const selectedCategoryId = event.target.value;
    const category = this.room_category_list.find(
      (e: { location_category_id: any }) => e.location_category_id == selectedCategoryId
    );

    if (!category) {
      this.room_plan_list[index] = [];
      this.rooms_list[index] = [];
      return;
    }

    this._reservationService.rooms_plan(category.location_category_id).subscribe({
      next: (data) => {
        this.room_plan_list[index] = (data.status && Array.isArray(data.content)) ? data.content : [];
      },
      error: () => {
        this.room_plan_list[index] = [];
      }
    });

    this._reservationService.room_by_category(category.category_location_id, category.location_category_id).subscribe({
      next: (data) => {
        this.rooms_list[index] = (data.status && Array.isArray(data.content)) ? data.content : [];
      },
      error: () => {
        this.rooms_list[index] = [];
      }
    });
  }

  getPlanDetails(planName: string) {
    // // console.log(this.room_plan_list)
    return this.room_plan_list.find((plan: { planid: any; }) => plan.planid === planName);
  }

  onPlanSelected(event: any, index: number) {
    const selectedPlanId = event.target.value;

    // pick from the correct row's plan list
    const plansForRow = this.room_plan_list[index] || [];

    const selectedPlan = plansForRow.find(
      (room: { planid: any }) => room.planid == selectedPlanId
    );

    if (selectedPlan) {
      this.rooms.at(index).patchValue({
        price: selectedPlan.plan_price,
        gst: selectedPlan.gst_amount,
        pricetotal: (Number(selectedPlan.plan_price) + Number(selectedPlan.gst_amount)).toFixed(2)
      });
    } else {
      this.rooms.at(index).patchValue({
        price: '',
        gst: '',
        pricetotal: ''
      });
    }
    // // console.log(this.room_plan_list)
    // // console.log(this.rooms_list)
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

  get documentsControls() {
    return (this.document_form.get('documents') as FormArray).controls;
  }

  get rooms(): FormArray {
    return this.rooms_info_form.get('rooms') as FormArray;
  }

  createRoomGroup(): FormGroup {
    // // console.log(this.selected_guest_info[0])
    // // console.log(this.selected_guest_info[0].checkin_date)
    return this.fb.group({
      type: ['', Validators.required],
      plan: ['', Validators.required],
      room_no: ['', Validators.required],
      price: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      pricetotal: ['', [Validators.required]],
      adults: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      children: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      checkin_date: [this.selected_guest_info[0]?.checkin_date, Validators.required],
      no_of_nights: [this.selected_guest_info[0]?.no_of_nights, [Validators.required, Validators.min(1)]],
      checkout_date: [this.selected_guest_info[0]?.checkout_date, Validators.required],
      booking_status: ['confirmed', Validators.required],
      main_guest: ['', Validators.required]
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

  addDocument() {
    // Push a new control to the documents array for the new document
    // const documentsArray = this.document_form.get('documents') as FormArray;
    // // documentsArray.push(this.fb.control(null));

    // Update the form with the new document field
    this.generateDocumentControls();  // Refresh document fields
  }

  generateDocumentControls() {
    const documentsArray = this.fb.array([]);
    let totalGuests = 0;

    // Loop over rooms and count total guests
    this.rooms.controls.forEach((room) => {
      const adults = parseInt(room.get('adults')?.value || '0', 10);
      const children = parseInt(room.get('children')?.value || '0', 10);
      totalGuests += adults + children;
    });

    // Add a document control for each guest
    for (let i = 0; i < totalGuests; i++) {
      documentsArray.push(this.fb.control(null));  // Add an empty control for each guest
    }

    this.document_form.setControl('documents', documentsArray);
    // // console.log(this.document_form.value); // For debugging
  }


  toggleSection(section: 'guest' | 'room' | 'proof' | 'payment') {
    this.showGuestInfo = section === 'guest' ? !this.showGuestInfo : false;
    this.showRoomInfo = section === 'room' ? !this.showRoomInfo : false;
    this.showProofInfo = section === 'proof' ? !this.showProofInfo : false;
    this.showPaymentInfo = section === 'payment' ? !this.showPaymentInfo : false;
  }

  previous_tab(section: 'guest' | 'room' | 'proof' | 'payment') {
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

      // Convert base64 to File and assign to photoFile
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
