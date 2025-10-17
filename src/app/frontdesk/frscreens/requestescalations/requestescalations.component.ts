import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-requestescalations',
  standalone: true,
        imports: [DataTablesModule],
  templateUrl: './requestescalations.component.html',
  styleUrl: './requestescalations.component.css'
})
export class RequestescalationsComponent {


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