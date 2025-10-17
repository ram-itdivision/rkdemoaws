import { NgIf, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CleaningService } from 'src/app/core/services/cleaning.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-underclearance',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  templateUrl: './underclearance.component.html',
  styleUrl: './underclearance.component.css'
})
export class UnderclearanceComponent {

  public logininfo: any = [];
  public cleaning_info: any = [];
  public status_type: any;
  public loading: boolean = false;
  public hasError: boolean = false;

  public cleaning_status: any = '';
  public cleaning_remarks: any = '';
  public cleanig_file_upload: any;
  public selected_room: any;

  constructor(private _cleaningService: CleaningService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // console.log(this.logininfo);

    if (this.route.snapshot.params['type'] == 1) {
      this.status_type = "under clearance";
    } else {
      this.status_type = "cleaning required";
    }

    var obj = {
      "location_id": this.logininfo.location_id,
      "user_id": 53,
      "status": this.status_type
    }


    this._cleaningService.get_cleaninglist(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status && Array.isArray(data.content)) {
          this.cleaning_info = data.content;
          this.hasError = false;
        } else {
          this.cleaning_info = [];
          this.hasError = true;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error("Request failed", err);
        this.cleaning_info = [];
        this.hasError = true;
        this.loading = false;
      }
    });
  }

  on_roomselect(dt: any) {
    this.selected_room = dt;
    console.log(dt)
  }

  on_clearence() {
    var obj = {
      "room_id": this.selected_room.room_id,
      "location_id": this.logininfo.location_id,
      "loged_user": 53,
      "cr_id": this.selected_room.room_cr_id,
      "clearence": this.cleaning_status || '',
      "remarks": this.cleaning_remarks || ''
    }
    console.log(obj)
    if (confirm("Are you sure, Do you you want to update..?")) {

      this._cleaningService.cleaning_status_chg(obj).subscribe({
        next: (data) => {
          console.log("Data Updated Successfully...!")
          location.reload()
        },
        error: (err) => {
          console.error("Request failed", err);
          alert("Error Updating, Please try again..!")
          location.reload()
        }
      })
    }
  }

  on_finish_cleaning() {
    var obj = {
      "room_id": this.selected_room.room_id,
      "location_id": this.logininfo.location_id,
      "loged_user": 53,
      "cr_id": this.selected_room.room_cr_id,
      "clearence": this.cleaning_status || '',
      "remarks": this.cleaning_remarks || ''
    }

    const formData = new FormData();

    formData.append('location_id', this.logininfo.location_id);
    formData.append('room_id', this.selected_room.room_id);
    formData.append('loged_user', "53");
    formData.append('image', this.cleanig_file_upload.files[0]);
    console.log(obj)
    if (confirm("Are you sure, Do you you want to update..?")) {

      this._cleaningService.cleaning_finished(formData).subscribe({
        next: (data) => {
          console.log("Data Updated Successfully...!")
          location.reload()
        },
        error: (err) => {
          console.error("Request failed", err);
          alert("Error Updating, Please try again..!")
          location.reload()
        }
      })
    }
  }

  formate_date(dateString: string): string {
    if (!dateString) return '';

    const parts = dateString.split(' ')[0].split('-'); // ["04", "06", "2025"]
    const day = parts[0];
    const month = parseInt(parts[1], 10);
    const year = parts[2];

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return `${day}-${monthNames[month - 1]}-${year}`;
  }

}
