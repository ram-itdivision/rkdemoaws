import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-guestfeedback',
  standalone: true,
    imports: [DataTablesModule],
  templateUrl: './guestfeedback.component.html',
  styleUrl: './guestfeedback.component.css'
})
export class GuestfeedbackComponent {

  reservation_datatable: any = {};
  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    this.reservation_datatable = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

