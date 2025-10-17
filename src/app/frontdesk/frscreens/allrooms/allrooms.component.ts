import { AfterViewInit, Component } from '@angular/core';
import { CheckService } from 'src/app/core/services/checkin.service';
import { NgForOf, NgIf, NgClass, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestregistrationComponent } from "../guestregistration/guestregistration.component";
import { CalendarregComponent } from "../calendarreg/calendarreg.component";
import { ReservationService } from 'src/app/core/services/reservation.service';
interface ServiceEntry {
  selectedService: any;
  amount: number;
  gst_percent: number;
}

@Component({
  selector: 'app-allrooms',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, ReactiveFormsModule, FormsModule, CommonModule, GuestregistrationComponent, CalendarregComponent],
  templateUrl: './allrooms.component.html',
  styleUrl: './allrooms.component.css'
})


export class AllroomsComponent implements AfterViewInit {

  public logininfo: any = [];
  public rooms_list: any = [];
  public loading: boolean = false;
  public hasError: boolean = false;
  public selected_room: any;

  public selectedProperty: string = '';
  serviceEntries: ServiceEntry[] = [];

  public vacant_form: FormGroup;

  public modalInstance: any;
  showAddService = false;

  public currentStatus: string = 'all';
  public uniqueProperties: any = [];
  selectedPropertyId: string = '';
  selected_guest: any;
  serviceList: any = [];
  selectedServices: any[] = [];
  complaintList : any = [];
  feedbackList : any = [];
  duepaymentlist : any = [];
  ordersList: any = [];
  groupedOrders: any[] = [];

  serviceForm = {
    service_id: '',
    price: ''
  };
  addedServices: any;
  availableServices: { id: number; name: string; }[];
  filteredData: any;
  allData: any;

  constructor(private _checkService: CheckService, private _reservationService: ReservationService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.vacant_form = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      wifi_pass: ['', Validators.required],
      no_of_nights: ['', Validators.required],
      guest_priority: ['', Validators.required],
      special_checkin: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    console.log(this.logininfo.location_id)
    this.fetchRooms(this.currentStatus);
    this.currentStatus = this.currentStatus;

  }

  filterRooms(status: string) {
    this.currentStatus = status;
    this.fetchRooms(status);

  }

  fetchRooms(status_type: string) {
    console.log(this.logininfo)
    const obj = {
      location_id: this.logininfo.location_id,
      user_id: 140,
      status: status_type
    };

    this.loading = true;
    this._checkService.get_roomlist(obj).subscribe({
      next: (data) => {
        this.rooms_list = [];
        const uniquePropertiesSet = new Set<string>();

        if (data.status && Array.isArray(data.content)) {
          for (let floor of data.content) {
            if (Array.isArray(floor.rooms)) {
              // Collect all properties_name from all rooms
              for (let room of floor.rooms) {
                if (Array.isArray(room.properties)) {
                  for (let prop of room.properties) {
                    uniquePropertiesSet.add(prop.properties_name);
                  }
                }
              }
              this.uniqueProperties = Array.from(uniquePropertiesSet.entries()).map(([id, name]) => ({
                id,
                name
              }));
              //this.uniqueProperties = JSON.parse(this.uniqueProperties)
              // console.log(this.uniqueProperties)
              // Filter rooms by status (as before)
              const filtered_rooms = floor.rooms.filter(
                (room: any) => status_type === 'all' || room.room_status === status_type
              );

              if (filtered_rooms.length > 0) {
                this.rooms_list.push({
                  floor_name: floor.floor_name,
                  rooms: filtered_rooms
                });
              }
            }
          }

          this.hasError = this.rooms_list.length === 0;

          // Convert Set to Array and store
          const uniqueProperties = Array.from(uniquePropertiesSet);
          console.log(uniqueProperties);
          // You can save this list to a component property if needed
          // this.uniqueProperties = uniqueProperties;

        } else {
          this.rooms_list = [];
          this.hasError = true;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error("Request failed", err);
        this.rooms_list = [];
        this.hasError = true;
        this.loading = false;
      }
    });

  }

  view_details(guest_details_id: any) {
    console.log(guest_details_id.gci_id)
    this._reservationService.view_guest_booking_info(guest_details_id.gci_id).subscribe({
      next: (response: any) => {
        const content = response.content;
        this.selected_guest = {
          guest_details: content.booking_info?.[0] || {},
          checkin_info: content.checkin_info || [],
          identification_info: content.identification_info || [],
          payment_info: content.payment_history || [],
          guest_mapped_payments_info: content.guest_mapped_payments_info,
          payment_history: content.payment_info || []
        };
        // console.log(this.selected_guest)

        let latestPayment = null;

        if (!content.payment_history || content.payment_history.length == 0) {
          latestPayment = content.payment_info.reduce((latest: { created_at: string | number | Date; }, current: { created_at: string | number | Date; }) => {
            return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
          });
          // console.log(latestPayment)
          this.selected_guest.payment_info = [latestPayment];
        }
        console.log(this.selected_guest)
      },
      error: (err) => {
        console.error("Error fetching guest details", err);
        this.selected_guest = null;
      }
    });
  }

  recalculate(index: number) {
    const item = this.selectedServices[index];
    const amount = parseFloat(item.amount) || 0;
    const gstPercent = parseFloat(item?.selectedService?.gst_percent) || 0;

    const gstAmount = +(amount * gstPercent / 100).toFixed(2);
    const totalAmount = +(amount + gstAmount).toFixed(2);

    item.gst_amount = gstAmount;
    item.total_amount = totalAmount;
  }


  ngAfterViewInit() {
    const modalEl = document.getElementById('roomInfoModal');
    if (modalEl) {
      this.modalInstance = new (window as any).bootstrap.Modal(modalEl);
    }
  }
  onselect(sl_dt: any) {
    this.selected_room = sl_dt;

    // Reset search state
    this.searchText = '';
    this.guestList = [];

    console.log(sl_dt);
    if (this.modalInstance) {
      this.modalInstance.show();
    }

    // If the room has a guest name, auto-load the details
    if (sl_dt.guest_name) {
      this.view_details(this.selected_room);
    }
  }


  checkoutGuest(cg: any): void {
    if (!confirm('Are you sure you want to checkout this guest?')) {
      return; // User cancelled
    }

    const obj = {
      room_id: cg.room_id,
      location_id: this.logininfo.location_id,
      loged_user: 1
    };

    console.log('Checkout Request:', obj);

    this._reservationService.checkoutroom(obj).subscribe({
      next: (response: any) => {
        alert('Checkout successful: ' + (response.message || 'Guest checked out successfully.'));
        console.log('Checkout successful', response);
      },
      error: (err) => {
        alert('Checkout failed: ' + (err.error?.message || 'Something went wrong.'));
        console.error('Checkout failed', err);
      }
    });
  }

  searchText: string = '';
  guestList: any[] = [];
  searchTriggered = false;

  search_guest_data() {
    this.searchTriggered = true;

    this._reservationService.search_guest(this.searchText.trim()).subscribe({
      next: (response: any) => {
        if (response.content && response.content.length > 0) {
          this.guestList = response.content;
          console.log('Guests found:', response.content);
        } else {
          this.guestList = [];
          console.log('No guests found.');
        }
      },
      error: (err) => {
        alert('Search failed: ' + (err.error?.message || 'Something went wrong.'));
        console.error('Search failed', err);
        this.guestList = [];
      }
    });
  }


  onServiceChange(index: number) {
    this.recalculate(index);
    const entry = this.selectedServices[index];
    if (!entry || !entry.selectedService) return;

    const selected = entry.selectedService;

    entry.amount = selected.amount;
    entry.gst_percent = selected.gst_percent;
  }



  onPropertyChange(propertyId: string): void {
    // console.log(propertyId)
    // console.log(this.rooms_list)
    if (propertyId) {
      this.filteredData = this.rooms_list.filter((item: { property: string; }) => item.property === propertyId);
    } else {
      this.filteredData = [...this.rooms_list]; // show all data if no filter
    }
  }


  restuarant_order_list() {
    this._reservationService.get_restaurant_order(2,this.selected_guest.guest_details.guests_id).subscribe((data: any) => {
      this.ordersList = data.content;
      this.groupOrders();
    });
  }

  groupOrders() {
    const map = new Map<string, any>();

    this.ordersList.forEach((order: { order_id: string; room_id: any; date: any; status: any; special_instructions: any; item: any; units: any; price: any; variant_name: any; }) => {
      if (!map.has(order.order_id)) {
        map.set(order.order_id, {
          order_id: order.order_id,
          room_id: order.room_id,
          date: order.date,
          status: order.status,
          special_instructions: order.special_instructions,
          items: []
        });
      }
      map.get(order.order_id).items.push({
        item: order.item,
        units: order.units,
        price: order.price,
        variant: order.variant_name
      });
    });

    this.groupedOrders = Array.from(map.values());
  }

  services_list() {
    this._reservationService.get_addservice(2).subscribe((data: any) => {
      console.log("Service List:", data);
      this.serviceList = data;
    });
  }

  addService() {
    this.selectedServices.push({
      selectedService: null,
      amount: '',
      gst_percent: ''
    });
  }

  removeService(index: number) {
    this.selectedServices.splice(index, 1);
  }



  submitServices() {
      const payload = this.selectedServices.map(item => {
      const gstAmount = (item.amount * item.gst_percent) / 100;
      const totalAmount = item.amount + gstAmount;

      return {
        location_id: this.logininfo.location_id,
        guest_master_id: this.selected_guest.guest_details.guests_id,
        checkin_id: this.selected_guest.guest_details.guests_guest_checkin_id,
        booking_id: this.selected_guest.guest_details.booking_id,
        source_type: 'service',
        source_id: item.selectedService?.id,
        description: item.selectedService?.service_name,
        base_amount: item.amount,
        amount_paid: 0,
        gst_percent: item.gst_percent,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        total_due: totalAmount
      };
    });


    // Call your API
    this._reservationService.post_selected_services(payload).subscribe(res => {
      console.log("API Response:", res);
      location.reload();
      // Show toast or success message here
    });
  }

  gotodashboard() {
    location.href = '#/frontdesk/dashboard';
  }


    complaints_list() {

      var location_id = this.logininfo.location_id;
      var guest_id = this.selected_guest.guest_details.guests_id;

    this._reservationService.get_guest_complaints(location_id,guest_id).subscribe((data: any) => {
      console.log("Comments List:", data.content);
      this.complaintList = data.content;
    });
  }

    feedback_list() {
    
      var location_id = this.logininfo.location_id;
      var guest_id = this.selected_guest.guest_details.guests_id;

    this._reservationService.get_guest_feedbacks(location_id,guest_id).subscribe((data: any) => {
      console.log("Feedback List:", data.content);
      this.feedbackList = data.content;
    });
  }


  goToRoomCheckIn(roomId: any, guestId: any) {
    console.log(this.selected_room)
    console.log(roomId, guestId)
    // return false
    // if (roomId && guestId) {
      if (this.modalInstance) {
        this.modalInstance.hide(); // or .close()
      }
      this.router.navigate(['/frontdesk/checkinform'], {
        queryParams: {
          gid: guestId,
          rid: roomId
        }
      });
    // } else {
    //   alert('Missing room or guest information');
    // }
  }


  get_due_payments(guest_checkin_id: any) {
    console.log(guest_checkin_id)  
     this._reservationService.get_checkout_payment_due(guest_checkin_id).subscribe((data: any) => {
      console.log("Due payment List:", data.content);
      this.duepaymentlist = data.content;
    }); 
  }

  paydueamount(duepaymentlist: any) {
  console.log(duepaymentlist);

  this._reservationService.checkout_due_pay_now(duepaymentlist).subscribe((data: any) => {
    console.log("Due payment List:", data);

    if (data.receipt_no) {
      const guestId = duepaymentlist[0].checkin_id; // or guest_master_id
      const recId   = data.receipt_no;

      // Open in a new tab
      window.open(`/#/receipt?guest_id=${guestId}&rec_id=${recId}`, '_blank');
    }
  });
}



getTotal(type: string): number {
  if (!this.duepaymentlist) return 0;

  switch (type) {
    case 'base':
      return this.duepaymentlist.reduce((sum: number, item: { base_amount: any; }) => sum + Number(item.base_amount || 0), 0);
    case 'gst':
      return this.duepaymentlist.reduce((sum: number, item: { gst_amount: any; }) => sum + Number(item.gst_amount || 0), 0);
    case 'total':
      return this.duepaymentlist.reduce((sum: number, item: { total_amount: any; }) => sum + Number(item.total_amount || 0), 0);
    case 'paid':
      return this.duepaymentlist.reduce((sum: number, item: { total_paid: any; }) => sum + Number(item.total_paid || 0), 0);
    case 'due':
      return this.duepaymentlist.reduce((sum: number, item: { total_amount: any; total_paid: any; }) => sum + (Number(item.total_amount || 0) - Number(item.total_paid || 0)), 0);
    default:
      return 0;
  }
}


// Returns true if there is any pending due
hasPendingDue(): boolean {
  if (!this.duepaymentlist || this.duepaymentlist.length === 0) return false;

  return this.duepaymentlist.some(
    (    item: { total_amount: any; total_paid: any; }) => (Number(item.total_amount || 0) - Number(item.total_paid || 0)) > 0
  );
}


   mark_as_cleared(cg: any): void {
    if (!confirm('Are you sure you want to Mark as Cleared this guest?')) {
      return; // User cancelled
    }

    
  }


  viewReceipt(order: any) {
    console.log(order)
    // Navigate to receipt component and pass order id
    this.router.navigate(['#/frontdesk/restaurantorder', order.order_id]);
  }
}