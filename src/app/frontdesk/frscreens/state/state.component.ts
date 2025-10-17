import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CountryService } from 'src/app/core/services/country.service';
import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent implements OnInit {
  countries: any[] = [];
  states: any[] = [];
  state: any = {
    state_name: '',
    state_code: '',
    country_id: 0,
    status: 'active',
    location_id: 2
  };
  editing = false;

  constructor(
    private countryService: CountryService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.loadCountries();
    this.loadStates();
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(res => {
      this.countries = res.data || [];
    });
  }

  loadStates() {
    this.stateService.getStates().subscribe(res => {
      this.states = res.data || [];
    });
  }

  save() {
    if (
      !this.state.state_name ||
      !this.state.state_code ||
      !this.state.country_id
    ) return;

    const payload = {
      ...this.state,
      location_id: 2
    };

    if (this.editing && this.state.id) {
      this.stateService.updateState(payload).subscribe(() => {
        alert('Updated successfully');
        this.loadStates();
        this.reset();
      });
    } else {
      this.stateService.addState(payload).subscribe(() => {
        alert('Added successfully');
        this.loadStates();
        this.reset();
      });
    }
  }

  edit(st: any) {
    this.state = { ...st };
    this.editing = true;
  }

  delete(id: number) {
    if (confirm('Delete this state?')) {
      this.stateService.deleteState(id).subscribe(() => {
        alert('Deleted successfully');
        this.loadStates();
      });
    }
  }

  reset() {
    this.state = {
      state_name: '',
      state_code: '',
      country_id: 0,
      status: 'active',
      location_id: 2
    };
    this.editing = false;
  }
}
