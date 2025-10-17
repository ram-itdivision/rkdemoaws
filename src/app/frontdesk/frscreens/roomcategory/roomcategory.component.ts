import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roomcategory',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './roomcategory.component.html',
  styleUrl: './roomcategory.component.css'
})
export class RoomcategoryComponent implements OnInit, OnDestroy {

  reservation_datatable: any = {};
  dtTrigger: Subject<any> = new Subject();
  floorList: any[] = [];
  public logininfo: any = [];

  category_name = '';
  category_image: any = null;
  editingId: number | null = null;

  showForm: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any>(apiurl + '/getroomcategory/'+this.logininfo.location_id).subscribe(response => {
      this.floorList = response.content;
      setTimeout(() => {
        this.dtTrigger.next(true);
      });
    });
  }

  onImageChange(event: any) {
    this.category_image = event.target.files[0];
  }

  showAddForm() {
    this.showForm = true;
    this.clearForm();
  }

  showListView() {
    this.showForm = false;
    this.clearForm();
    this.loadCategories();
  }

  saveCategory() {
    const formData = new FormData();
    formData.append('location_category_name', this.category_name);
    if (this.category_image) {
      formData.append('location_category_image', this.category_image);
    }
    formData.append('location_id', this.logininfo.location_id);

    const apiEndpoint = this.editingId
      ? apiurl + `/updateroomcategory/${this.editingId}`
      : apiurl + '/addroomcategory';

    this.http.post(apiEndpoint, formData).subscribe(() => {
      this.showForm = false;
      this.clearForm();
      this.reloadTable();
    });
  }

  editCategory(cat: any) {
    this.category_name = cat.location_category_name;
    this.editingId = cat.location_category_id;
    this.showForm = true;
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure to delete this category?')) {
      this.http.post(apiurl + `/deleteroomcategory/${id}`, {}).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  reloadTable() {
    this.http.get<any>(apiurl + '/getroomcategory/'+this.logininfo.location_id).subscribe(res => {
      this.floorList = res.content;
    });
  }

  clearForm() {
    this.category_name = '';
    this.category_image = null;
    this.editingId = null;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
