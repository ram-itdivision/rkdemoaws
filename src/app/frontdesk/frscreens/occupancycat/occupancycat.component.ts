import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OccupancyService } from 'src/app/core/services/occupancy.service';
import { CommonModule } from '@angular/common';
import { NgIf, NgForOf } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

interface OccupancyCat {
   id?: number;  
  occupancy_cat: string;
  occupancy_code: string;
  num_adults:number;
  num_children:number;
  children_age: number;
  location_id: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-occupancycat',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgIf, NgForOf, DataTablesModule],
  templateUrl: './occupancycat.component.html',
  styleUrl: './occupancycat.component.css'
})
export class OccupancycatComponent implements OnInit {
  occupancytable: any = {};
  dtTrigger: Subject<any> = new Subject();
  occupancies: OccupancyCat[] = [];
  form!: FormGroup;
  editing = false;
  showForm: number = 1;
  logininfo: any = [];

  constructor(private fb: FormBuilder, private _OccupancyService: OccupancyService) { }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);

    this.buildForm();
    this.getList();
  }

  buildForm() {
    this.form = this.fb.group({
      id: [null], 
      occupancy_cat: ['', Validators.required],
      occupancy_code: ['', Validators.required],
      num_adults:['', Validators.required],
      num_children:['', Validators.required],
      children_age: ['', Validators.required],
      location_id: [this.logininfo.location_id, Validators.required], // static for now
      status: ['active', Validators.required]
    });
  }

  getList() {
    this.occupancytable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this._OccupancyService.get_occupancylist(this.logininfo.location_id).subscribe(res => {
      // console.log(res.data)
      this.occupancies = res.data || [];

      setTimeout(() => {
        this.dtTrigger.next(true);
      }, 0);
    });
  }

  save() {
    if (this.form.invalid) return;

    const formData = this.form.value;

    

    if (this.editing && this.form.value.id) {
      this._OccupancyService.update_occupancy(formData).subscribe((res) => {
        // console.log(res)
        alert('Updated successfully');
        // this.getList();
        // this.reset();
        location.reload()
      });
    } else {
      this._OccupancyService.add_occupancy(formData).subscribe((res) => {
        // console.log(res)
        alert('Added successfully');
        // this.getList();
        // this.reset();
        location.reload()
      });
    }
  }

  addNew() {
  this.reset();
  this.showForm = 2; // Show form
  }
  edit(data: OccupancyCat) {
  this.form.patchValue(data);
  this.editing = true;
  this.showForm = 2; // Ensure form becomes visible while editing
  }

  delete(dt: any) {
    if (confirm('Are you sure to delete?')) {
      this._OccupancyService.del_occupancy(dt).subscribe(() => {
        alert('Deleted successfully');
        location.reload()
      });
    }
  }

  reset() {
    this.editing = false;
    this.form.reset({
      occupancy_cat: '',
      occupancy_code: '',
      num_adults:'',
      num_children:'',
      children_age: '',
      location_id: this.logininfo.location_id,
      status: 'active'
    });
  }
}
