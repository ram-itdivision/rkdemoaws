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
  public selectedGuest: any = [];

  constructor(private _checkService: CheckService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo);

    var obj = {
      "location_id": this.logininfo.location_id
    }
    this._checkService.contactless_checkin(obj).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status && Array.isArray(data.content)) {
          this.checkin_list = data.content;
          setTimeout(() => {
            this.dtTrigger.next(true);
          }, 0);

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

    this.checkin_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  go_to_checkin(guest: any) {
    this.router.navigate(['/frontdesk/addclcheckin'], {
      relativeTo: this.route,
      queryParams: { guest_id: guest.booking_id }
    });
  }

  formatDateString(input: any): any {
    if (!input) return '';

    // Split to extract the date part only
    const datePart = input.split(' ')[0]; // "2025-07-24"
    const [year, month, day] = datePart.split('-');

    return `${year}-${month}-${day}`; // "24-07-2025"
  }

openDocsModal(guest: any) {
  this.selectedGuest = guest;

  if (!guest.booking_id) {
    console.warn("No booking_id found for guest");
    return;
  }

  console.log("Fetching documents for booking_id:", guest.booking_id);

  // Call API to get documents by booking_id
  var obj = { location_id:2, booking_id: guest.booking_id };
  this._checkService.getGuestDocuments(obj).subscribe({
    next: (response) => {
      if (response.status && Array.isArray(response.content)) {
        this.selectedGuest.docs = response.content;
      } else {
        this.selectedGuest.docs = [];
      }
    },
    error: (err) => {
      console.error("Failed to fetch documents:", err);
      this.selectedGuest.docs = [];
    }
  });
}


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }



// Delete file (frontend only — extend to call backend if needed)
deleteDocument(doc: any, index: number) {
  if (confirm('Are you sure you want to delete this document?')) {
    this.selectedGuest.docs.splice(index, 1);
    // TODO: Call API to delete from server using doc.guest_document_id
  }
}

// Add new file and preview
addDocument(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedGuest.docs.push({
        guest_document: reader.result,
        guest_document_id: 'new' + Date.now()
      });
    };
    reader.readAsDataURL(file);

    // TODO: Upload to server if needed
  }
}


}