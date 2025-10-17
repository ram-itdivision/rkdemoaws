import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { EventService } from '../core/services/eventlog.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ipAddress: string;
  device_info: any;

  useremail: string = '';
  userpassword: string = '';
  ngOnInit() {
    // if (localStorage.getItem('logindata')) {
    //       this.router.navigate(['student']);
    // }
    this.IPAddress_get()
  }


  public show_log_error = '';

  logdata: FormGroup;
  constructor(private fb: FormBuilder, private _authenticationService: AuthenticationService, private router: Router, private _eventservice: EventService) {
    this.logdata = this.fb.group({
      stdMobileNo: ['', [Validators.required]],
      stdPwd: ['', [Validators.required]],
    });
  }
 onloginnow() {
  // Simple validation
  if (!this.useremail || !this.userpassword) {
    alert("Please enter both email and password.");
    return;
  }

  const obj = {
    username: this.useremail,
    password: this.userpassword,
    token: "",
    device: ""
  };

  this._authenticationService.post_login(obj).subscribe({
    next: (data: any) => {
      if (data.status === false) {
        this.show_log_error = data.message;
      } else {
        localStorage.setItem('logindata', JSON.stringify(data.content));
        let deptName = data.content.department_name.toLowerCase().replace(/\s+/g, '');
        if(deptName=='frontdesk'){
        window.location.href = '#/'+deptName;
        }else{
          alert("Only Front desk users allowed!");
        }
      }
    },
    error: (err: any) => {
      if (err.status === 404) {
        this.show_log_error = "Invalid Email or Password!";
      } else if (err.status === 0) {
        this.show_log_error = "Unable to connect to server. Please try again later.";
      } else {
        this.show_log_error = "An error occurred: " + err.message;
      }

      console.error("Login error:", err);
    }
  });
}



  clearfunction() {
    this.show_log_error = '';
  }

  gotoForgot() {
    window.location.href = '#/forgetpassword'
  }

  IPAddress_get() {
    this._authenticationService.getIpAddress().subscribe(data => {
      this.ipAddress = data.ip;
      // console.log('User IP Address:', this.ipAddress);
      this.getLocation()
    })
  }

  getLocation() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const browserName = navigator.appName;
    const browserVersion = navigator.appVersion;
    const platform = navigator.platform;
    const language = navigator.language;
    var device_address: any = {}
    // console.log(navigator.geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Reverse geocoding using Nominatim
          const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          // console.log(nominatimApiUrl)

          fetch(nominatimApiUrl)
            .then(response => response.json())
            .then(data => {
              data.address.latitude = latitude
              data.address.longitude = longitude
              device_address.address = data.address;
              // Parse the address as needed for your application logic.
            })
            .catch(error => {
              console.error("Error fetching address information:", error);
            });
        },
        (error) => {
          // Handle geolocation errors as before.
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    device_address.browserinfo = {
      "userAgent": userAgent,
      "BrowserName": browserName,
      "BrowserVersion": browserVersion,
      "Platform": platform,
      "Language": language,
      "ScreenSize": screenWidth + "x" + screenHeight,
    }
    device_address.ip_Address = this.ipAddress
    this.device_info = device_address
    // console.log(device_address)

  }

  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logdata.valid) {
      this.onloginnow();
    }
  }

}


