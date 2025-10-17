import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';

@Component({
  selector: 'app-couponmaster',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule, ReactiveFormsModule],
  templateUrl: './couponmaster.component.html',
  styleUrl: './couponmaster.component.css'
})
export class CouponmasterComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  coupons: any[] = [];
   public logininfo: any = [];

  couponForm!: FormGroup;
  showForm: boolean = false;
  editingId: number | null = null;

  rolesList = ['guest', 'corporate', 'admin'];
  roomTypes: any[] = [];
  mealTypes: any[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.loadCoupons();
    this.loadRoomTypes();
    this.loadMealTypes();

    this.couponForm = this.fb.group({
      location_id: [this.logininfo.location_id],
      coupon_code: [''],
      coupon_type: ['room'],
      subcategory: ['promotional'],
      discount_value: [''],
      max_discount_amount: [''],
      gift_description: [''],
      valid_from: [''],
      valid_to: [''],
      min_order_amount: [''],
      usage_limit: [''],
      applicable_roles: [[]],
      applicable_room_types: [[]],
      applicable_meal_types: [[]],
      status: ['active']
    });
  }

  loadCoupons() {
    this.http.get<any>(`${apiurl}/list_coupon/`+this.logininfo.location_id).subscribe(res => {
      this.coupons = res.data;
      setTimeout(() => this.dtTrigger.next(true));
    });
  }

  loadRoomTypes() {
    this.http.get<any>(`${apiurl}/getroomcategory/`+this.logininfo.location_id).subscribe(res => {
      this.roomTypes = res.content || [];
    });
  }

  loadMealTypes() {
    this.http.get<any>(`${apiurl}/get_meals/`+this.logininfo.location_id).subscribe(res => {
      this.mealTypes = res.content || [];
    });
  }

  showAddForm() {
    this.showForm = true;
    this.editingId = null;
    this.couponForm.reset({
      location_id: this.logininfo.location_id,
      coupon_type: 'room',
      subcategory: 'promotional',
      status: 'active',
      applicable_roles: [],
      applicable_room_types: [],
      applicable_meal_types: []
    });
  }

  editCoupon(coupon: any) {
    this.showForm = true;
    this.editingId = coupon.id;

    this.couponForm.patchValue({
      ...coupon,
      applicable_roles: coupon.applicable_roles?.split(',') || [],
      applicable_room_types: coupon.applicable_room_types?.split(',').map((x: any) => parseInt(x)),
      applicable_meal_types: coupon.applicable_meal_types?.split(',').map((x: any) => parseInt(x))
    });
  }

  deleteCoupon(id: number) {
    if (confirm("Are you sure?")) {
      this.http.post(`${apiurl}/delete_coupon`, { id }).subscribe(() => {
        this.loadCoupons();
      });
    }
  }

  saveCoupon() {
    const formValue = this.couponForm.value;
    const payload = {
      ...formValue,
      applicable_roles: formValue.applicable_roles.join(','),
      applicable_room_types: formValue.applicable_room_types.join(','),
      applicable_meal_types: formValue.applicable_meal_types.join(',')
    };

    const url = this.editingId
      ? `${apiurl}/update_coupon`
      : `${apiurl}/add_coupon`;

    if (this.editingId) {
      payload['id'] = this.editingId;
    }

    this.http.post(url, payload).subscribe(() => {
      this.showForm = false;
      this.loadCoupons();
    });
  }

  onCheckboxChange(event: any, key: string) {
    const formArray = this.couponForm.value[key] || [];
    const value = event.target.value;
    if (event.target.checked) {
      if (!formArray.includes(value)) formArray.push(value);
    } else {
      const index = formArray.indexOf(value);
      if (index > -1) formArray.splice(index, 1);
    }
    this.couponForm.patchValue({ [key]: formArray });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
