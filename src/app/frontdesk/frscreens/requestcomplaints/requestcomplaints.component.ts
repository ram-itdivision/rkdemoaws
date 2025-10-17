import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-requestcomplaints',
  standalone: true,
      imports: [DataTablesModule],
  templateUrl: './requestcomplaints.component.html',
  styleUrl: './requestcomplaints.component.css'
})
export class RequestcomplaintsComponent {

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


