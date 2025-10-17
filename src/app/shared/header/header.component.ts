import { Component, OnInit, AfterViewInit, computed, signal } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule, AbstractControl } from '@angular/forms';
import { NgIf, NgFor, NgForOf, NgClass, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from 'src/app/core/services/reservation.service';


declare var $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor, NgForOf, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe]
})
export class HeaderComponent implements AfterViewInit {
  public logininfo: any = [];
  public stdprograminfo: any = [];
  public togglevalue: Number = 0;
  public errorimg: any = String;
  booking_list: any = []
  today_date: any;
  selectmobilemenu: number;
  searchText = signal('');
  guestList = signal<any[]>([]);
  searchTriggered = false;


  guests = signal([
    {
      guest_id: 1,
      resid: "GUEST1001",
      bookingid: "BOOK5001",
      mobile: "9876543210",
      name: "John Doe"
    },
    {
      guest_id: 2,
      resid: "GUEST1002",
      bookingid: "BOOK5002",
      mobile: "9123456789",
      name: "Jane Smith"
    },
    {
      guest_id: 3,
      resid: "GUEST1003",
      bookingid: "BOOK5003",
      mobile: "9012345678",
      name: "Michael Scott"
    }
  ]);


  constructor(private _authenticationService: AuthenticationService, private _reservationService: ReservationService) { }

  ngAfterViewInit(): void {
    $('#menu').metisMenu();
    $('select').niceSelect();
  }

  // filteredGuests = computed(() => {
  //   const q = this.searchText().toLowerCase().trim();
  //   if (!q) return [];

  //   return this.guests().filter(g =>
  //     g.resid.toLowerCase().includes(q) ||
  //     g.bookingid.toLowerCase().includes(q) ||
  //     g.name.toLowerCase().includes(q) ||
  //     g.mobile.includes(q)
  //   );
  // });


  ngOnInit() {
    this.selectmobilemenu = 0
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.errorimg = "assets/img/profile.jpg";

    this.today_date = new Date();
    const formattedDate = this.today_date.toISOString().split('T')[0];

    var obj = {
      "location_id": this.logininfo.location_id,
      "booking_status": "all",
      "from_date": formattedDate,
      "to_date": formattedDate
    }

    this._reservationService.get_registration_list(obj).subscribe({
      next: (data) => {
        this.booking_list = data.guests;
      }
    })
  }

  filteredGuests = computed(() => this.guestList());

  onSearchInput(event: any) {
    const query = event.target.value.trim();
    this.searchText.set(query);
    this.searchTriggered = true;

    if (!query) {
      this.guestList.set([]); // clear if empty
      return;
    }

    this._reservationService.search_guest(query).subscribe({
      next: (response: any) => {
        if (response.content && response.content.length > 0) {
          this.guestList.set(response.content);
        } else {
          this.guestList.set([]);
        }
      },
      error: (err) => {
        alert('Search failed: ' + (err.error?.message || 'Something went wrong.'));
        console.error('Search failed', err);
        this.guestList.set([]);
      }
    });
  }


  menuchange() {
    const box = document.getElementById('appbody');

    if (this.togglevalue == 0) {
      box?.classList.add('toggle-sidebar');
      this.togglevalue = 1;
    } else {
      box?.classList.remove('toggle-sidebar');
      this.togglevalue = 0;
    }
  }  

  get_unique_roomtype(dt: any) {
    if (!dt) return "";

    const rooms = dt.split(",").map((r: string) => r.trim());
    const counts: { [key: string]: number } = {};

    rooms.forEach((room: string | number) => {
      counts[room] = (counts[room] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([room, count]) => `${room} - ${count}`)
      .join("<br>");  // use <br> for line break
  }

  formatDate(date: Date): string {
    if (!date) return '';

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-GB', options).replace(/ /g, '-');
  }

  gotomenu(x: number) {
    this.selectmobilemenu = x
  }

  logout(): void {
    this._authenticationService.logout();
  }
}
