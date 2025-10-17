import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';

@Component({
  selector: 'app-roomplanner',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './roomplanner.component.html',
  styleUrl: './roomplanner.component.css',
})
export class RoomplannerComponent implements OnInit, OnDestroy {
  planners: any[] = [];
  roomTypes: any[] = [];
  mealPlans: any[] = [];
  plantotalprice:any;
  showForm = false;
  editingId: number | null = null;
  selectedtariffprice = 0;
  selectedmealprice = 0;
  selectedgstpercent=0;
  selectedgstamount=0;
  public logininfo: any = [];

  planner: any = {
    location_id: this.logininfo.location_id,
    plan_name: '',
    plan_code: '',
    room_tariff_id: '',
    meal_id: '',
    plan_price:'',
    gst_percentage: '',
    gst_amount:'',
    plan_from_date: '',
    plan_to_date: '',
    status: 'active'
  };

  constructor(private http: HttpClient) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);

    this.loadPlanners();
    this.loadRoomTypes();
    this.loadMealPlans();
  }

  loadPlanners() {
  this.http.get<any>(`${apiurl}/get_room_planners/`+this.logininfo.location_id).subscribe(res => {
    if (res.data && Array.isArray(res.data)) {
      this.planners = res.data
    } else {
      this.planners = [];
    }
    
  });
}


  loadRoomTypes() {
    this.http.get<any>(`${apiurl}/get_rooms_tariffs/`+this.logininfo.location_id).subscribe(res => {
      console.log(res.content)
      this.roomTypes = res.content;
    });
  }

  loadMealPlans() {
    this.http.get<any>(`${apiurl}/get_meals/`+this.logininfo.location_id).subscribe(res => {
      this.mealPlans = res.content;
    });
  }

  toggleMeal(id: number) {
    const idx = this.planner.meal_ids.indexOf(id);
    if (idx >= 0) {
      this.planner.meal_ids.splice(idx, 1);
    } else {
      this.planner.meal_ids.push(id);
    }
  }

  showAddForm() {
    this.showForm = true;
    this.editingId = null;
    this.planner = {
        location_id: this.logininfo.location_id,
        plan_name: '',
        plan_code: '',
        room_tariff_id: '',
        meal_id: '',
        plan_price:'',
        gst_percentage: '',
        gst_amount:'',
        plan_from_date: '',
        plan_to_date: '',
        status: 'active'
    };
  }

  showListView() {
    this.showForm = false;
    this.loadPlanners();
  }

getTariffPrice() {
  const tariff = this.roomTypes.find(e => e.id == this.planner.room_tariff_id);
  this.selectedtariffprice = tariff ? tariff.base_price : 0;
  this.selectedgstpercent = tariff ? tariff.tariff_gst : 0;
  this.updateTotalPrice();
}

getPlanPrice() {
  const meal = this.mealPlans.find(e => e.id == this.planner.meal_id);
  this.selectedmealprice = meal ? meal.price : 0;
  this.updateTotalPrice();
}

updateTotalPrice() {
  console.log(this.selectedtariffprice)
  console.log(this.selectedmealprice)
  this.planner.plan_price = (this.selectedtariffprice || 0)*1 + (this.selectedmealprice || 0)*1;
  this.planner.gst_percentage = this.selectedgstpercent;
  this.planner.gst_amount = (this.planner.plan_price*((100+this.selectedgstpercent*1))/100)-this.planner.plan_price;
}


  savePlanner() {
    const url = this.editingId
      ? `${apiurl}/update_room_planner/${this.editingId}`
      : `${apiurl}/add_room_planner`;

    this.http.post(url, this.planner).subscribe(() => {
      this.showListView();
    });
  }

  editPlanner(planner: any) {
    this.showForm = true;
    this.editingId = planner.id;
    this.planner = {
      ...planner,
    };
  }

  deletePlanner(id: number) {
    if (confirm('Are you sure to delete this room planner?')) {
      this.http.post(`${apiurl}/delete_room_planner/${id}`, {}).subscribe(() => {
        this.loadPlanners();
      });
    }
  }
}