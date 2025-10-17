import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckService } from 'src/app/core/services/checkin.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {

  public guest_id: any;
  public receipt_id: any;
  public payment_info: any = [];

  constructor(private _checkService: CheckService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.guest_id = params['guest_id'];
      this.receipt_id = params['rec_id'];
      // console.log(this.payment_id, this.receipt_id);
    });

    this._checkService.get_receipt(this.guest_id, this.receipt_id).subscribe({
      next: (data) => {
        console.log(data)
        if (data.status) {

          this.payment_info = data.content

        } else {
          alert("Error Occured, Please try again")
        }
      },
      error: () => {
        alert("Error Occured, Please try again")
        // this.rooms_list = [];
      }
    });
  }

  getTotalAmountPaid() {
    // Ensure all values are numbers and sum them up
    const total = this.payment_info.reduce((total: number, payment: { amount_paid: string; }) => {
      const amount = parseFloat(payment.amount_paid);
      return total + (isNaN(amount) ? 0 : amount); // If not a number, add 0 instead
    }, 0);

    return total.toFixed(2); // Format the result to 2 decimal places
  }

printReceipt() {
  const receiptElement = document.getElementById('receipt');
  if (!receiptElement) return;

  const printContents = receiptElement.innerHTML;
  const popupWin = window.open('', '_blank', 'width=1000,height=800');

  popupWin?.document.open();
  popupWin?.document.write(`
    <html>
      <head>
        <title>Payment Receipt</title>
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">

        <style>
          body {
            font-family: Arial, sans-serif;
            background: #fff;
            margin: 20px;
          }

          .receipt-card {
            max-width: 900px;
            margin: auto;
            border-radius: 15px;
            background: #fff;
            padding: 20px;
          }

          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }

          th, td {
            border: 1px solid #dee2e6 !important;
            padding: 6px !important;
          }

          .table-light {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .table-primary {
            background-color: #d9e9ff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .badge.bg-secondary {
            background-color: #6c757d !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="receipt-card shadow">
          ${printContents}
        </div>
      </body>
    </html>
  `);

  popupWin?.document.close();
}




}
