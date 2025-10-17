import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { CheckService } from 'src/app/core/services/checkin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contactless',
  standalone: true,
  imports: [DataTablesModule, NgForOf, NgIf, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contactless.component.html',
  styleUrl: './contactless.component.css'
})
export class ContactlessComponent {

  checkin_datatable: any = {};
  dtTrigger: Subject<any> = new Subject();

  public logininfo: any = [];
  public checkin_list: any = [];
  public room_table_list: any = [];
  public selectedRoom: any;


  constructor(private _checkService: CheckService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo);



    var obj = {
      "location_id": this.logininfo.location_id
    }
    this._checkService.get_roomlist(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status && Array.isArray(data.content)) {
          this.checkin_list = data.content;

          // Flattening all rooms across all floors
          this.room_table_list = [];
          data.content.forEach((floor: { rooms: any[]; floor_name: any; }) => {
            floor.rooms.forEach((room: any) => {
              this.room_table_list.push({
                ...room,
                floor_name: floor.floor_name
              });
            });
            this.checkin_datatable = {
              pagingType: 'full_numbers',
              processing: true,
              lengthMenu: [10, 25, 50, 75, 100],
              dom: 'Bfrtip',
              buttons: [
                'csv', 'excel', 'print'
              ]
            };
          });


        } else {
          this.checkin_list = [];
          this.room_table_list = [];
        }
      },
      error: (err) => {
        console.error("Request failed", err);
        this.checkin_list = [];
        this.room_table_list = [];
      }
    });

  }


  formatDateString(input: any): any {
  if (!input) return '';

  // Split to extract the date part only
  const datePart = input.split(' ')[0]; // "2025-07-24"
  const [year, month, day] = datePart.split('-');

  return `${year}-${month}-${day}`; // "24-07-2025"
}

  gotocheckin(dt: any) {
    this.router.navigate(['/frontdesk/addreservation'], {
      relativeTo: this.route,
      queryParams: { id: dt.guest_id_upload }
    });

  }

  deleteRoom(room: any) {
    if (confirm(`Are you sure to delete room ${room.room_name}?`)) {
      // Your delete logic here
      console.log("Deleting", room);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}