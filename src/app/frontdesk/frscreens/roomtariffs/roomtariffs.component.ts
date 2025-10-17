import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { apiurl } from 'src/environments/environment.development';
import { FormsModule } from '@angular/forms';
import { CustomDatePipe } from 'src/app/utilities/custom-date.pipe';

@Component({
  selector: 'app-roomtariffs',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule,CustomDatePipe ],
  templateUrl: './roomtariffs.component.html',
  styleUrl: './roomtariffs.component.css'
})
export class RoomtariffsComponent implements OnInit, OnDestroy {

  reservation_datatable: any = {};
  dtTrigger: Subject<any> = new Subject();
  roomTariffs: any[] = [];
  roomTypes: any[] = [];
  occupancyCategories: any[] = [];
  logininfo: any = [];

  showForm: boolean = false;
  tariff: any = this.getEmptyTariff();
  editingId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo);

    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.loadTariffs();
    this.loadRoomTypes();
  }

  getEmptyTariff() {
    return {
      tariff_name: '',
      tariff_code: '',
      room_type: '',
      occupancy_category_id: '',
      start_date: '',
      end_date: '',
      base_price: '',
      tariff_gst: '',
      status: 'active'
    };
  }

  loadTariffs() {
    this.http.get<any>(apiurl + '/get_rooms_tariffs/'+this.logininfo.location_id).subscribe(response => {
      this.roomTariffs = response.content;
      setTimeout(() => {
        this.dtTrigger.next(true);
      });
    });
  }

  loadRoomTypes() {
    this.http.get<any>(apiurl + '/getroomcategory/'+this.logininfo.location_id).subscribe(response => {
      this.roomTypes = response.content || [];
    });
  }

  getOccupancyCategories() {
    this.http.get<any>(apiurl + '/occupancy_category_list/'+this.logininfo.location_id).subscribe(res => {
      this.occupancyCategories = res.status && res.data ? res.data : [];
    });
  }

  showAddForm() {
    this.showForm = true;
    this.getOccupancyCategories();
    this.tariff = this.getEmptyTariff();
    this.editingId = null;
  }

  showListView() {
    this.showForm = false;
    this.loadTariffs();
  }

  saveTariff() {
    const apiEndpoint = this.editingId
      ? `${apiurl}/update_rooms_tariff/${this.editingId}`
      : `${apiurl}/add_rooms_tariff`;

    const data = { ...this.tariff, tariff_location_id: this.logininfo.location_id };

    this.http.post(apiEndpoint, data).subscribe(() => {
      this.showListView();
    });
  }

  editTariff(t: any) {
    this.tariff = { ...t };
    this.editingId = t.id;
    this.showForm = true;
    this.getOccupancyCategories();
  }

  deleteTariff(id: number) {
    if (confirm('Are you sure to delete this tariff?')) {
      this.http.post(`${apiurl}/delete_rooms_tariff/${id}`, {}).subscribe(() => {
        this.loadTariffs();
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
