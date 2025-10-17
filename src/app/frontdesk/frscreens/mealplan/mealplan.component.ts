import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { apiurl } from 'src/environments/environment.development';

@Component({
  selector: 'app-mealplan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mealplan.component.html',
  styleUrl: './mealplan.component.css'
})
export class MealplanComponent implements OnInit, OnDestroy {
  meals: any[] = [];
  showForm = false;
  editingId: number | null = null;
  occupancyCategories: any[] = [];
  logininfo: any = [];

  meal: any = {
    location_id: this.logininfo.location_id,
    meal_name: '',
    meal_code: '',
    occupancy_category_id: '',
    price: '',
    gst_percentage: '',
    gst_amount: '',
    start_date: '',
    end_date: '',
    status: 'active'
  };

  mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);
    this.loadMeals();
  }

  loadMeals() {
    this.http.get<any>(`${apiurl}/get_meals/`+this.logininfo.location_id).subscribe(res => {
      this.meals = res.content || [];
    });
  }
  getOccupancyCategories() {
    this.http.get<any>(apiurl + '/occupancy_category_list/'+this.logininfo.location_id).subscribe(res => {
      console.log(res.data)
      this.occupancyCategories = res.status && res.data ? res.data : [];
    });
  }

  showAddForm() {
    this.showForm = true;
    this.clearForm();
    this.getOccupancyCategories();
  }

  showListView() {
    this.showForm = false;
    this.clearForm();
    this.loadMeals();
  }

updategstamount(){
  console.log(this.meal.gst_percentage)
  console.log(this.meal.price)
  this.meal.gst_amount = (this.meal.price*((100+this.meal.gst_percentage*1))/100)-this.meal.price;
}

  saveMeal() {
    const apiEndpoint = this.editingId
      ? `${apiurl}/update_meal/${this.editingId}`
      : `${apiurl}/add_meal`;

    this.http.post(apiEndpoint, this.meal).subscribe(() => {
      this.showListView();
    });
  }

  editMeal(m: any) {
    this.meal = { ...m };
    this.editingId = m.id;
    this.showForm = true;
  }

  deleteMeal(id: number) {
    if (confirm('Are you sure?')) {
      this.http.post(`${apiurl}/delete_meal/${id}`, {}).subscribe(() => {
        this.loadMeals();
      });
    }
  }

  clearForm() {
    this.meal = {
        location_id: this.logininfo.location_id,
        meal_name: '',
        meal_code: '',
        occupancy_category_id: '',
        price: '',
        gst_percentage: '',
        gst_amount: '',
        start_date: '',
        end_date: '',
        status: 'active'
    };
    this.editingId = null;
  }

  ngOnDestroy(): void {}
}
