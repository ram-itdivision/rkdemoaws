import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CountryService } from 'src/app/core/services/country.service';

export interface Country {
  id?: number;
  country_name: string;
  country_code: string;      
  nationality: string;
  status: 'active' | 'inactive';
  location_id: number;      
}

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent implements OnInit {
  countries: Country[] = [];
  country: Country = {
    country_name: '',
    country_code: '',
    nationality: '',
    status: 'active',
    location_id: 2
  };
  editing = false;
  countries_list: any = []

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(res => {
      this.countries_list = res.data || []
      // this.countries = res.data || [];
    });
  }

  save() {
    if (
      !this.country.country_name ||
      !this.country.country_code ||
      !this.country.nationality ||
      !this.country.status
    ) return;

    const payload: Country = {
      ...this.country,
      location_id: 2
    };

    // console.log(payload)
    if (this.editing && this.country.id) {
      this.countryService.updateCountry(payload).subscribe(() => {
        alert('Updated successfully');
        this.loadCountries();
        this.reset();
      });
    } else {
      this.countryService.addCountry(payload).subscribe((res) => {
        // console.log(res)
        alert('Added successfully');
        this.loadCountries();
        this.reset();
      });
    }
  }

  edit(c: Country) {
    this.country = { ...c };
    this.editing = true;
  }

  delete(id: number) {
    if (confirm('Delete this country?')) {
      this.countryService.deleteCountry(id).subscribe(() => {
        alert('Deleted successfully');
        this.loadCountries();
      });
    }
  }

  reset() {
    this.country = {
      country_name: '',
      country_code: '',
      nationality: '',
      status: 'active',
      location_id: 2
    };
    this.editing = false;
  }
}
