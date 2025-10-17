import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-guestratings',
  standalone: true,
      imports: [DataTablesModule],
  templateUrl: './guestratings.component.html',
  styleUrl: './guestratings.component.css'
})
export class GuestratingsComponent {


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

