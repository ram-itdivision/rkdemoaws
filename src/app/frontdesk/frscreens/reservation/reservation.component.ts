import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { CustomDatePipe } from 'src/app/utilities/custom-date.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [DataTablesModule, NgForOf, NgIf, FormsModule, CommonModule, ReactiveFormsModule, CustomDatePipe],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit, OnDestroy {

  reservation_datatable: any = {};
  booking_list: any = [];
  logininfo: any = [];
  selected_guest: any;
  isLoading = false;
  selected_bklist: any = [];

  public reservationform: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  constructor(private _reservationService: ReservationService, private fb: FormBuilder, private router: Router) {
    this.reservationform = this.fb.group({
      from_date: [''],
      to_date: [''],
      // status_type: []
    })
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // console.log(this.logininfo);


    var today_date = new Date();
    const formattedDate = today_date.toISOString().split('T')[0];
    this.reservationform.patchValue({
      from_date: formattedDate,
      to_date: formattedDate,
      // status_type: "confirmed"
    });

    this.get_list()

    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    // this.dtTrigger.next();
  }

  get_list() {
    this.booking_list = []
    var obj = {
      "location_id": this.logininfo.location_id,
      "booking_status": "all",
      "from_date": this.reservationform.value.from_date,
      "to_date": this.reservationform.value.to_date
    }

    this._reservationService.get_registration_list(obj).subscribe({
      next: (data) => {
        console.log(data);
        this.booking_list = data.guests.filter((e: { contactless: number; })=>e.contactless==0);
        setTimeout(() => {
          this.dtTrigger.next(true);
        }, 0);

      },
      error: (err) => {
        this.booking_list = [];
      }
    });
  }

  class_status(dt: any) {
    var dt_text = dt.toLowerCase();  // <- fix here
    if (dt_text === 'rsmguest website') {
      return 'btn-info';
    } else if (dt_text === 'contact less') {
      return 'btn-warning';
    } else if (dt_text === 'email') {
      return 'btn-danger';
    } else if (dt_text === 'walk in') {
      return 'btn-success';
    }
    else {
      return 'btn-blue'
    }
  }

  on_datechange() {
    // console.log(this.reservationform.value)
    this.get_list()
  }


  view_details(dt: any) {
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
      .join("<br>");  
  }

  go_to_reciept(rpt_dt: any) {
    this.router.navigate(['receipt'], {
      queryParams: {
        guest_id: rpt_dt.guest_master_id,
        rec_id: rpt_dt.receipt_no
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  formatToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
