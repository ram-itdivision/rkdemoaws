import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-restaurantorder',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './restaurantorder.component.html',
  styleUrl: './restaurantorder.component.css'
})
export class RestaurantorderComponent {

  orderId!: string;
  orderiteminfo: any;
  subtotal: number = 0;
  cgst: number = 0;
  sgst: number = 0;
  grand_total: number = 0;
  today: Date = new Date();

  constructor(private route: ActivatedRoute, private _reservationService: ReservationService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderid'];
      if (this.orderId) {
        this.fetchOrder(this.orderId);
      }
    });
  }

  fetchOrder(orderId: string) {
    const obj = { order_id: orderId };
    this._reservationService.get_restaurant_order_by_id(obj).subscribe((data: any) => {
      if (data?.content?.length > 0) {
        this.orderiteminfo = data.content[0];

        console.log(this.orderiteminfo)

        // Calculate totals dynamically
        this.subtotal = this.orderiteminfo.order_details.reduce((acc: number, item: any) => {
          const price = Number(item.order_item_price);
          const units = Number(item.order_item_units);
          return acc + price * units;
        }, 0);

        this.cgst = +(this.subtotal * 0.025).toFixed(2);
        this.sgst = +(this.subtotal * 0.025).toFixed(2);
        this.grand_total = +(this.subtotal + this.cgst + this.sgst).toFixed(2);

      }
    });
  }

  printReceipt() {
    const content = document.getElementById('print-area')!.innerHTML;
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow!.document.open();
    printWindow!.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: monospace, 'Courier New', sans-serif; font-size: 14px; }
            .dashed { border-top: 1px dashed #000; margin: 4px 0; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    printWindow!.document.close();
  }
}
