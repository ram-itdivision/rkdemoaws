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
  selector: 'app-checkinformupdate',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './checkinformupdate.component.html',
  styleUrl: './checkinformupdate.component.css'
})

export class CheckinformupdateComponent implements OnInit {

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
  public rooms_list: any[] = [];
  public user_mobile_no: any = '';
  public room_category_list: any = [];
  public room_plan_list: any[] = [];
  uniqueRoomProperties: string[] = [];
  selectedProperty: string = '';
  selected_guest_id: any = '';
  selected_guest_info: any = [];
  allRoomData: any[] = [];
  showGuestInfo: boolean = true;
  showRoomInfo: boolean = false;
  showProofInfo: boolean = false;
  showPaymentInfo: boolean = false;
  roomBillingSummary: any = [];
  rooms_booking: any = false
  selectedplanname: any;
  imagePreviews: string[] = [];
  checkin_id : any = null;

  documentFiles: File[] = [];
  photoFile: File | null = null;
  guest_documents: any[] = [];
  showAddAnotherDoc: any

  showCamera = false;
  photoCaptured = false;
  capturedImage: string | null = null;
  videoStream: MediaStream | null = null;

  webcamActive = false;
  idProofFile: File | null = null;
  guestPhotoFile: File | null = null;

  serviceList: any = [];
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
      billing_to: ['', Validators.required],
      nationality: ['INDIAN', Validators.required],
      guest_country: ['INDIA', Validators.required],
      guest_state: ['', Validators.required],
      guest_city: ['', Validators.required],
      address: ['', Validators.required],
      reservationid: [''],
      guestbooking_id: ['']
    });

    this.rooms_info_form = this.fb.group({
      rooms: this.fb.array([])
    });

    this.document_form = this.fb.group({
      documents: this.fb.array([])
    });

    this.payment_form = this.fb.group({
      totalamount: [0, Validators.required],
      payamount: [0, Validators.required],
      dueamount: [0, Validators.required],
      payment_type: ['', Validators.required],
      currency_type: ['INR', Validators.required], 
      payment_reference: [''],
      payment_details: ['']
    });
  }

  ngOnInit() {
    this.logininfo = JSON.parse(localStorage.getItem('logindata') || '{}');

    var location_id = this.logininfo.location_id;
    this._reservationService.room_category(location_id).subscribe({
      next: (rm_data) => {
        if (rm_data.status && Array.isArray(rm_data.content)) {
          this.room_category_list = rm_data.content;

          this.route.queryParams.subscribe(params => {
            var chid = params['chid'];

            if (chid) {
              this._reservationService.get_checkininfo(chid).subscribe((res: any) => {
                this.selected_guest_info = res.content;
                console.log('Selected Guest Info:', this.selected_guest_info);

                this.guest_form.patchValue({
                  guestbooking_id: chid || '',
                  reservationid: this.selected_guest_info.checkin_info?.[0]?.booking_id || ''
                });

                this.patchGuestForm(this.selected_guest_info);
                this.setRoomsFromGuestInfo(this.selected_guest_info);
                this.patchPaymentForm(this.selected_guest_info);
                this.get_booking_docs(chid);
                this.handleSectionVisibility(this.selected_guest_info);
              });
            } else {
              // If no chid, initialize with empty room
              this.addRoom();
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
      this.serviceList = data;
    });

    this.rooms.valueChanges.subscribe(() => {
      this.generateDocumentControls();
    });

    this.guest_form.get('reservationid')?.disable();
    this.guest_form.get('guestbooking_id')?.disable();

    this.payment_form.get('payamount')?.valueChanges.subscribe(val => {
      const total = this.getTotalRoomBilling();
      const pay = +val || 0;
      this.payment_form.patchValue(
        { dueamount: total - pay },
        { emitEvent: false }
      );
    });

    this.payment_form.get('dueamount')?.valueChanges.subscribe(val => {
      const total = this.getTotalRoomBilling();
      const due = +val || 0;
      this.payment_form.patchValue(
        { payamount: total - due },
        { emitEvent: false }
      );
    });
  }

  patchGuestForm(guestData: any) {
    if (guestData && guestData.checkin_info && guestData.checkin_info[0]) {
      const guestInfo = guestData.checkin_info[0];
      
      this.guest_form.patchValue({
        guest_details_location_id: guestInfo.gci_location_id || '',
        booking_from: guestInfo.booking_from || '',
        guest_honor: '',
        guest_name: guestInfo.guest_name || '',
        guest_lastname: '',
        companyname: '',
        guest_mobile: guestInfo.guest_mobile || '',
        guest_email: guestInfo.guest_email || '',
        billing_to: guestInfo.guest_name || '',
        nationality: guestInfo.nationality || 'INDIAN',
        guest_country: 'INDIA',
        guest_state: '',
        guest_city: '',
        address: guestInfo.address || '',
        reservationid: guestInfo.booking_id || '',
        guestbooking_id: guestInfo.booking_id || ''
      });
    }
  }

  patchPaymentForm(paymentData: any) {
    if (paymentData?.guest_mapped_payments_info && paymentData.guest_mapped_payments_info.length > 0) {
      const paymentInfo = paymentData.guest_mapped_payments_info[0];
      const paymentMode = paymentData.payment_info?.[0]?.payment_mode || '';
      
      const totalAmount = paymentData.guest_mapped_payments_info.reduce((sum: number, item: any) => 
        sum + parseFloat(item.total_amount || 0), 0);
      
      const totalPaid = paymentData.guest_mapped_payments_info.reduce((sum: number, item: any) => 
        sum + parseFloat(item.total_paid || 0), 0);
      
      const totalDue = paymentData.guest_mapped_payments_info.reduce((sum: number, item: any) => 
        sum + parseFloat(item.total_due || 0), 0);

      this.payment_form.patchValue({
        totalamount: totalAmount,
        payamount: totalPaid,
        dueamount: totalDue,
        payment_type: paymentMode,
        currency_type: 'INR',
        payment_reference: paymentInfo.payment_reference || '',
        payment_details: paymentInfo.remarks || ''
      });
    }
  }

  handleSectionVisibility(guestData: any) {
    this.toggleSection('guest');
    
    if (!guestData.identification_info) {
      this.showProofInfo = false;
    }
    
    if (guestData.guest_mapped_payments_info?.length > 0) {
      this.showPaymentInfo = false;
    }
  }

  async setRoomsFromGuestInfo(guestData: any) {
    this.rooms.clear();
    this.room_plan_list = [];
    this.rooms_list = [];

    if (guestData?.checkin_info && guestData.checkin_info.length > 0) {
      console.log('Setting rooms from guest info:', guestData.checkin_info);
      
      for (let i = 0; i < guestData.checkin_info.length; i++) {
        const guest = guestData.checkin_info[i];
        console.log(`Processing room ${i + 1}:`, guest);

        const category = this.room_category_list.find(
          (c: { location_category_id: any }) => c.location_category_id == guest.room_type
        );

        console.log('Found category:', category);

        if (category) {
          await this.get_rooms_plan_async(category.location_category_id, i);

          // Wait a bit for the data to load
          await new Promise(resolve => setTimeout(resolve, 500));

          const selectedPlan = this.room_plan_list[i]?.find(
            (p: { planid: any }) => p.planid == guest.room_plan_id
          );

          const selectedRoom = this.rooms_list[i]?.find(
            (r: { room_id: any }) => r.room_id == guest.gci_room_id
          );

          console.log('Selected Plan:', selectedPlan);
          console.log('Selected Room:', selectedRoom);
          console.log('Room Plan List for index', i, ':', this.room_plan_list[i]);
          console.log('Rooms List for index', i, ':', this.rooms_list[i]);

          const roomGroup = this.fb.group({
            type: [category.location_category_id, Validators.required],
            plan: [selectedPlan?.planid || guest.room_plan_id, Validators.required],
            room_no: [selectedRoom?.room_id || guest.gci_room_id, Validators.required],
            price: [guest.cost_of_night || guest.amount || '', Validators.required],
            gst: [this.calculateGSTAmount(guest.amount, guest.cost_of_night) || '', Validators.required],
            pricetotal: [guest.amount || '', Validators.required],
            adults: [guest.adults || '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
            children: [guest.child || '0', [Validators.required, Validators.pattern('^[0-9]+$')]],
            checkin_date: [guest.check_in?.split(' ')[0] || this.today, Validators.required],
            no_of_nights: [guest.number_of_nights || 1, [Validators.required, Validators.min(1)]],
            checkout_date: [guest.check_out?.split(' ')[0] || this.tomorrow, Validators.required],
            booking_status: ['confirmed', Validators.required],
            main_guest: [guest.guest_name || '', Validators.required]
          });

          this.rooms.push(roomGroup);
          console.log('Room group added:', roomGroup.value);
        } else {
          console.log('Category not found, adding default room');
          this.addRoom();
        }
      }
    } else {
      console.log('No checkin info found, adding default room');
      this.addRoom();
    }
    
    console.log('Final rooms array:', this.rooms.value);
    console.log('Final room_plan_list:', this.room_plan_list);
    console.log('Final rooms_list:', this.rooms_list);
  }

  calculateGSTAmount(totalAmount: string, baseAmount: string): string {
    if (!totalAmount || !baseAmount) return '0';
    const total = parseFloat(totalAmount);
    const base = parseFloat(baseAmount);
    return (total - base).toFixed(2);
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

      const plan$ = this._reservationService.rooms_plan(category.location_category_id);
      const room$ = this._reservationService.room_by_category(category.category_location_id, category.location_category_id);

      forkJoin([plan$, room$]).subscribe({
        next: ([planRes, roomRes]) => {
          this.room_plan_list[index] = (planRes.status && Array.isArray(planRes.content)) ? planRes.content : [];
          this.rooms_list[index] = (roomRes.status && Array.isArray(roomRes.content)) ? roomRes.content : [];
          console.log(`Fetched plans for index ${index}:`, this.room_plan_list[index]);
          console.log(`Fetched rooms for index ${index}:`, this.rooms_list[index]);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching rooms/plans:', error);
          this.room_plan_list[index] = [];
          this.rooms_list[index] = [];
          resolve();
        }
      });
    });
  }

  get_booking_docs(dt_chid: any) {
    const obj = { location_id: this.logininfo.location_id, booking_id: dt_chid };
    this._checkService.getGuestDocuments(obj).subscribe({
      next: (response) => {
        if (response.status && Array.isArray(response.content)) {
          this.guest_documents = response.content;

          if (this.guest_documents.length > 0) {
            this.showExistingDocuments();
          } else {
            this.generateDocumentControls();
            this.showDocumentUpload();
          }
        } else {
          this.guest_documents = [];
          this.showDocumentUpload();
        }
      },
      error: (err) => {
        console.error("Failed to fetch documents:", err);
      }
    });
  }

  showExistingDocuments() {
    this.showProofInfo = false;
    this.showAddAnotherDoc = true;
  }

  showDocumentUpload() {
    this.showProofInfo = false;
    this.showAddAnotherDoc = false;
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

    this._reservationService.update_reservation(this.selected_guest_info.checkin_info[0].booking_id, post_obj).subscribe(
      (res: any) => {
        console.log("Guest saved successfully...!")
      })
  }

  updateGuest() {
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
      const formattedRooms = this.rooms_info_form.value.rooms.map((room: any, index: number) => {
        const plan = (this.room_plan_list[index] || []).find((p: any) => p.planid === room.plan);
        const type = this.room_category_list.find((t: any) => t.location_category_id === room.type);
        const roomDetails = (this.rooms_list[index] || []).find((r: any) => r.room_id === room.room_no);

        return {
          guest_master_id: this.selected_guest_info.checkin_info[0].guest_master_id,
          loged_user: 1,
          location_id: this.selected_guest_info.checkin_info[0].gci_location_id,
          booking_id: this.selected_guest_info.checkin_info[0].booking_id,
          room_id: room.room_no,
          guest_name: room.main_guest,
          guest_mobile: this.selected_guest_info.checkin_info[0].guest_mobile,
          check_in: room.checkin_date,
          check_out: room.checkout_date,
          amount: room.price,
          booking_from: "Reservation",
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

      this._reservationService.add_reservation_checkin(formattedRooms).subscribe({
        next: (data) => {
          if (data.status) {
            this.checkin_id = data.checkin;
            
            this.updateRoomBillingSummary();
            this.toggleSection('proof');
          } else {
            alert("Error Occured, Please try Again")
          }
        },
        error(err) {
          alert("Error Occured, Please try Again")
        }
      })
    } else {
      console.warn("Some room fields are invalid. Please check the form.");
    }
  }

  updateRoomBillingSummary() {
    this.roomBillingSummary = this.rooms.value.map((room: any, index: number) => {
      const plan = (this.room_plan_list[index] || []).find((p: any) => p.planid == room.plan);
      const roomDetails = (this.rooms_list[index] || []).find((r: any) => r.room_id == room.room_no);

      const nights = +room.no_of_nights;
      const basePrice = +(room.price || 0);
      const gstAmount = +(room.gst || 0);
      const gstPercentage = basePrice > 0 ? (gstAmount / basePrice) * 100 : 0;

      return {
        roomNo: roomDetails?.room_name || 'N/A',
        planName: plan?.plan_name || 'N/A',
        nights,
        basePrice,
        gstPercentage,
        gstAmount,
        total: (basePrice * nights) + gstAmount
      };
    });
  }

  addIdentification() {
    const formData = new FormData();
    formData.append('guest_master_id', this.selected_guest_info.checkin_info[0].guest_master_id);
    formData.append('guest_location_id', this.selected_guest_info.checkin_info[0].gci_location_id);
    formData.append('guest_room_id', this.rooms_info_form.value.rooms[0].room_no);
    formData.append('booking_id', this.selected_guest_info.checkin_info[0].booking_id);
    formData.append('checkin_id', this.selected_guest_info.checkin_info[0].gci_id);

    this.documentFiles.forEach(file => {
      formData.append('guest_documents[]', file);
    });

    if (this.photoFile) {
      // formData.append('guest_photo', this.photoFile);
    }

    this.http.post(apiurl + '/upload_documents', formData).subscribe(data => {})
    this.toggleSection('payment')
  }

  onSubmit() {
    const total = +this.payment_form.value.totalamount || 0;
    const pay = +this.payment_form.value.payamount || 0;
    const due = +this.payment_form.value.dueamount || 0;

    let status = "No Paid";
    if (due === 0) {
      status = "Full Paid";
    } else if (due > 0 && due < total) {
      status = "Partial Paid";
    }

    const obj = {
      guest_master_id: parseInt(this.selected_guest_info.checkin_info[0].guest_master_id),
      checkin_id: this.checkin_id,
      booking_id: this.selected_guest_info.checkin_info[0].booking_id,
      guest_room_id: 0,
      location_id: this.logininfo.location_id,
      payment_mode: this.payment_form.value.payment_type,
      total_amount: this.payment_form.value.totalamount,
      amount_paid: this.payment_form.value.payamount,
      due_amount: this.payment_form.value.dueamount,
      payment_status: status,
      payment_reference: this.payment_form.value.payment_reference,
      remarks: this.payment_form.value.payment_details,
      created_by: 1,
      rooms_info: this.roomBillingSummary,
      services_info: this.serviceEntries
    };

    this._checkService.post_payment(obj).subscribe({
      next: (data) => {
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
    const total = this.getRoomChargesTotal() + this.getServiceChargesTotal();
    this.payment_form.patchValue(
      { totalamount: total },
      { emitEvent: false }
    );
    return total;
  }

  getAvailableRooms(index: number) {
    const allRooms = this.rooms_list[index] || [];
    const selectedRoomIds = this.rooms.controls
      .map((ctrl, idx) => idx !== index ? ctrl.get('room_no')?.value : null)
      .filter((id) => !!id);

    return allRooms.filter((room: any) => !selectedRoomIds.includes(room.room_id));
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

  onPlanSelected(event: any, index: number) {
    const selectedPlanId = event.target.value;
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
  }

  updateCheckoutDate(index: number) {
    const room = this.rooms.at(index);

    const checkinDateValue = room.get('checkin_date')?.value;
    const noOfNights = +room.get('no_of_nights')?.value || 0;

    if (checkinDateValue && noOfNights > 0) {
      const checkinDate = new Date(checkinDateValue);
      checkinDate.setHours(12, 0, 0);

      const checkoutDate = new Date(checkinDate);
      checkoutDate.setDate(checkoutDate.getDate() + noOfNights);
      checkoutDate.setHours(11, 0, 0);

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
    return this.fb.group({
      type: ['', Validators.required],
      plan: ['', Validators.required],
      room_no: ['', Validators.required],
      price: ['', [Validators.required]],
      gst: ['', [Validators.required]],
      pricetotal: ['', [Validators.required]],
      adults: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      children: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      checkin_date: [this.today, Validators.required],
      no_of_nights: [1, [Validators.required, Validators.min(1)]],
      checkout_date: [this.tomorrow, Validators.required],
      booking_status: ['confirmed', Validators.required],
      main_guest: ['', Validators.required]
    });
  }

  addRoom(): void {
    this.rooms.push(this.createRoomGroup());
    // Initialize arrays for the new room
    const newIndex = this.rooms.length - 1;
    this.room_plan_list[newIndex] = [];
    this.rooms_list[newIndex] = [];
    this.generateDocumentControls();
  }

  removeRoom(index: number): void {
    this.rooms.removeAt(index);
    this.room_plan_list.splice(index, 1);
    this.rooms_list.splice(index, 1);
    this.generateDocumentControls();
  }

  generateDocumentControls() {
    const documentsArray = this.fb.array([]);
    let totalGuests = 0;

    this.rooms.controls.forEach((room) => {
      const adults = parseInt(room.get('adults')?.value || '0', 10);
      const children = parseInt(room.get('children')?.value || '0', 10);
      totalGuests += adults + children;
    });

    for (let i = 0; i < totalGuests; i++) {
      documentsArray.push(this.fb.control(null));
    }

    this.document_form.setControl('documents', documentsArray);
  }

  toggleSection(section: 'guest' | 'room' | 'proof' | 'payment') {
    this.showGuestInfo = section === 'guest';
    this.showRoomInfo = section === 'room';
    this.showProofInfo = section === 'proof';
    this.showPaymentInfo = section === 'payment';
  }

  previous_tab(section: 'guest' | 'room' | 'proof' | 'payment') {
    if (section === 'guest') {
      this.toggleSection('guest');
    } else if (section === 'room') {
      this.toggleSection('guest');
    } else if (section === 'proof') {
      this.toggleSection('room');
    } else if (section === 'payment') {
      this.toggleSection('proof');
    }
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
    this.fileInputPhoto.nativeElement.value = '';
  }
  
  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }


  // Add this method to your TypeScript component
getRoomName(roomNo: string, index: number): string {
  if (!roomNo) return '';
  const room = (this.rooms_list[index] || []).find((r: any) => r.room_id == roomNo);
  return room ? room.room_name : '';
}

// Add this property to track if room is existing
isExistingRoom(roomNo: string, index: number): boolean {
  if (!roomNo) return false;
  const room = (this.rooms_list[index] || []).find((r: any) => r.room_id == roomNo);
  return !!room;
}

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}