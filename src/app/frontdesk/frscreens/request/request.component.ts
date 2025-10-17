import { Component } from '@angular/core';
import { RequestService } from 'src/app/core/services/request.service';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export class RequestComponent {

  public reportlabel: any = [];
  public logininfo: any = [];
  public request_list: any = [];
  public today_date: any;
  public total_info: any;
  public department_list: any;
  public view_info: any = [];
  public selected_order: any;
  // public to_date: any;
  // public status_type: any = 'all';
  public loading: boolean = false;
  public hasError: boolean = false;

  public rejected_reason: any = '';
  public tranfer_from: any = '';
  public tranfer_to: any = '';
  public chat_remarks: any = '';

  public request_form: FormGroup;
  constructor(private _requestService: RequestService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.request_form = this.fb.group({
      from_date: [''],
      to_date: [''],
      status_type: []
    })
  }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    console.log(this.logininfo);

    if (this.route.snapshot.params['type'] == 'new') {
      this.reportlabel = 'New Requests';
    } else if (this.route.snapshot.params['type'] == 'accepted') {
      this.reportlabel = 'In Progress Requests';
    } else {
      this.reportlabel = 'Finishe Requests';
    }

    var today_date = new Date();
    const formattedDate = today_date.toISOString().split('T')[0];
    this.request_form.patchValue({
      from_date: formattedDate,
      to_date: formattedDate,
      status_type: this.route.snapshot.params['type'] || 'all'
    });

    this.request_form.get('status_type')?.valueChanges.subscribe(val => {
      // console.log('Status changed to:', val);
      this.on_datechange();
    });

    this._requestService.departmentlist().subscribe({
      next: (data) => {
        // console.log(data);
        if (data.status && Array.isArray(data.content)) {
          this.department_list = data.content;
        } else {
          this.department_list = [];
        }

      },
      error: (err) => {
        console.error("Request failed", err);
        this.department_list = [];
      }
    });

    var post_obj = {
      "location_id": this.logininfo.location_id,
      "department_id": "4",
      "user_id": 53,
      "from_date": this.request_form.value.from_date,
      "to_date": this.request_form.value.to_date,
      "status": this.request_form.value.status_type
    }
    this.get_list(post_obj)
  }

  on_datechange() {
    console.log(this.request_form.value)
    var post_obj = {
      "location_id": this.logininfo.location_id,
      "department_id": "4",
      "user_id": 53,
      "from_date": this.request_form.value.from_date,
      "to_date": this.request_form.value.to_date,
      "status": this.request_form.value.status_type
    }
    this.get_list(post_obj)
  }

  get_list(dt_obj: any) {
    // this.loading = true;
    this.hasError = false;
    this.request_list = [];
    this.total_info = {};
    this._requestService.get_request(dt_obj).subscribe({
      next: (data) => {
        // console.log(data);
        if (data.status && data.total > 0 && Array.isArray(data.content)) {
          this.total_info = data;
          this.request_list = data.content;
          this.hasError = false;
        } else {
          this.request_list = [];
          this.hasError = true;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error("Request failed", err);
        this.request_list = [];
        this.hasError = true;
        this.loading = false;
      }
    });
  }

  view_order(dt: any) {
    console.log(dt)
    var obj = {
      "order_id": dt.request_id,
      "location_id": dt.location_id
    }

    this._requestService.view_orders(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          this.view_info = data.content;
        } else {
          this.view_info = [];
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        this.view_info = [];
      }
    });
  }

  sts_accept(dt: any) {
    console.log(dt)
    var obj = {
      "request_id": dt.request_id,
      "user_id": 52
    }

    this._requestService.req_accept(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          alert('Order Updated successfully');
          this.on_datechange()
        } else {
          alert("Error Occured, Please try again.!")
          this.on_datechange();
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        alert("Error Occured, Please try again.!")
        this.on_datechange();
      }
    });
  }

  sts_change(dt: any) {
    console.log(dt)
    var obj = {
      "request_id": dt.request_id,
      "user_id": 52
    }

    this._requestService.req_cls_or_reject(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          alert('Order Updated successfully');
          this.on_datechange()
        } else {
          alert("Error Occured, Please try again.!")
          this.on_datechange();
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        alert("Error Occured, Please try again.!")
        this.on_datechange();
      }
    });
  }

  on_reject(dt: any){
    console.log(dt)
    var obj = {
			reason: "rejection_reason",
			request_id: dt.request_id,
			location_id: dt.location_id,
			user_id:  53,
		};
    
    this._requestService.req_rejected(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          alert('Order Rejected successfully');
          this.on_datechange()
        } else {
          alert("Error Occured, Please try again.!")
          this.on_datechange();
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        alert("Error Occured, Please try again.!")
        this.on_datechange();
      }
    });

  }

  on_trnasfer(dt: any){
    console.log(dt)
    var obj = {
        "request_id": dt.request_id,
        "user_id": 52,
        "reason": "requestreason",
        "from_department": this.tranfer_from,
        "to_department": this.tranfer_to
    };    
    this._requestService.transfer_dep(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          alert('Order Transfered successfully');
          this.on_datechange()
        } else {
          alert("Error Occured, Please try again.!")
          this.on_datechange();
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        alert("Error Occured, Please try again.!")
        this.on_datechange();
      }
    });
  }

  on_footerselect(dt: any){
    this.selected_order = dt
    this.tranfer_from = this.selected_order.department_name
  }

  getFormattedTime(requestDateStr: string): string {
    // Expected format: "12-06-2025 00:03:03"
    const [day, month, yearAndTime] = requestDateStr.split('-');
    const [year, time] = yearAndTime.split(' ');
    const formattedDate = `${year}-${month}-${day}T${time}`;
    const dateObj = new Date(formattedDate);

    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
  }

  getMinutesSinceRequest(requestDateStr: string): number {
    // Convert "12-06-2025 00:03:03" to a valid Date
    const [day, month, yearAndTime] = requestDateStr.split('-');
    const [year, time] = yearAndTime.split(' ');
    const formatted = `${year}-${month}-${day}T${time}`;

    const requestDate = new Date(formatted);
    const now = new Date();

    const diffMs = now.getTime() - requestDate.getTime();
    const diffMins = Math.floor(diffMs / 60000); // 1000ms * 60 = 1 minute

    return diffMins;
  }

}