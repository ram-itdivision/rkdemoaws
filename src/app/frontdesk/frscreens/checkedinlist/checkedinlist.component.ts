import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { CustomDatePipe } from 'src/app/utilities/custom-date.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkedinlist',
  standalone: true,
  imports: [DataTablesModule, NgForOf, NgIf, FormsModule, CommonModule, ReactiveFormsModule, CustomDatePipe],
  templateUrl: './checkedinlist.component.html',
  styleUrl: './checkedinlist.component.css'
})
export class CheckedinlistComponent implements OnInit, OnDestroy {

  reservation_datatable: any = {};
  booking_list: any = [];
  logininfo: any = [];
  selected_guest: any;

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

    this._reservationService.get_checkin_list(obj).subscribe({
      next: (data) => {
        console.log(data);
        this.booking_list = data.guests;
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


  view_details(row: any) {

    console.log(row)
    this._reservationService.view_guest_booking_info(row.gci_id).subscribe({
      next: (response: any) => {
        const content = response.content;

        this.selected_guest = {
          guest_details: content.booking_info?.[0] || {},
          checkin_info: content.checkin_info || [],
          identification_info: content.identification_info || [],
          payment_info: content.guest_mapped_payments_info || [],
          payment_history: content.payment_info || []
        };
        console.log(this.selected_guest)
      },
      error: (err) => {
        console.error("Error fetching guest details", err);
        this.selected_guest = null;
      }
    });
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
}
