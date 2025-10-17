import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-twowaymsg',
  standalone: true,
  imports: [DataTablesModule],
  templateUrl: './twowaymsg.component.html',
  styleUrl: './twowaymsg.component.css'
})
export class TwowaymsgComponent {

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
