// admin-property-policies.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiurl } from 'src/environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propertypolicy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propertypolicy.component.html',
  styleUrl: './propertypolicy.component.css'
})
export class PropertypolicyComponent implements OnInit {
  editMode = false;
  policyData: any[] = [];
  originalData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPolicyData();
  }

  loadPolicyData() {
    this.http.get(`${apiurl}/property_policies/get_all`)
      .subscribe((res: any) => {
        this.policyData = res.data;
        this.originalData = JSON.parse(JSON.stringify(res.data));
      });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.policyData = JSON.parse(JSON.stringify(this.originalData));
    }
  }

  addSection() {
    this.policyData.push({
      title: 'New Policy Section',
      icon: '',
      items: [this.newItem()]
    });
  }

  removeSection(index: number) {
    this.policyData.splice(index, 1);
  }

  addItem(sectionIndex: number) {
    this.policyData[sectionIndex].items.push(this.newItem());
  }

  removeItem(sectionIndex: number, itemIndex: number) {
    this.policyData[sectionIndex].items.splice(itemIndex, 1);
  }

  newItem() {
    return {
      text: '',
      status: 'info',
      icon: ''
    };
  }

  saveChanges() {
    this.http.post(`${apiurl}/property_policies/save_all`, {
      sections: this.policyData,
      reset_existing: true
    }).subscribe(() => {
      this.loadPolicyData();
      this.editMode = false;
    });
  }

  cancelEdit() {
    this.policyData = JSON.parse(JSON.stringify(this.originalData));
    this.editMode = false;
  }
}