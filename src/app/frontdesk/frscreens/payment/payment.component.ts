import { NgIf, NgFor, NgForOf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckService } from 'src/app/core/services/checkin.service';


@Component({
  selector: 'app-payment',
  standalone: true,
    imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  public logininfo: any = [];
  public checkin_info: any = [];
  
  cardForm: FormGroup;
  upiForm: FormGroup;
  netBankingForm: FormGroup;

  banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra'];

  constructor(private fb: FormBuilder, private _checkService: CheckService) { }

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      cardType: ['credit'],
      cardNumber: [''],
      expiryMonth: [''],
      expiryYear: [''],
      cvv: ['']
    });

    this.upiForm = this.fb.group({
      upiId: ['']
    });

    this.netBankingForm = this.fb.group({
      bank: ['']
    });

    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo)
  
    this.checkin_info = localStorage.getItem('user_checkin_info');
    this.checkin_info = JSON.parse(this.checkin_info)
    console.log(this.checkin_info);


    const parsed = this.checkin_info;
    const formData = this._checkService.getDocuments();

    if (!formData) {
      // handle case where documentFormData is null (e.g., page refresh)
      console.error('No document data found');
      return;
    }

    // Append JSON info to formData
    formData.append('checkininfo', JSON.stringify(parsed.checkininfo));
    formData.append('room_info', JSON.stringify(parsed.room_info));
    console.log(formData)

  }

  submitCardPayment() {
    console.log('Card Payment:', this.cardForm.value);
    alert('Payment submitted via card.');
    this.receipt_form()
  }

  submitUPIPayment() {
    console.log('UPI Payment:', this.upiForm.value);
    alert('Payment submitted via UPI.');
    this.receipt_form()
  }

  submitNetBanking() {
    console.log('Net Banking:', this.netBankingForm.value);
    alert('Redirecting to bank...');
    this.receipt_form()
  }

  markAsCashPaid() {
    console.log('Marked as paid by cash.');
    alert('Marked as paid by cash.');
    this.receipt_form()
  }

  receipt_form(){
    window.location.href = "#/frontdesk/receipt"
  }
}