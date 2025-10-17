import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-frdashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public logininfo: any = [];
  newRequests = 0;
  requestsInProgress = 0;
  newOrders = 0;
  ordersInProgress = 0;
  orderComplaints = 0;
  orderEscalations = 0;
  dailyTasks = 0;
  finishedTasks = 0;
  allottedTask = 0;
  priorityTask = 0;
  roomsUnderClearance = 0;
  roomsInCleaning = 0;
  opsPosted = 0;
  opsReceived = 0;
  opsInProgress = 0;
  opsCcTasks = 0;
  opsEscalations = 0;
  guestComplaints = 0;
  guestFeedbacks = 0;
  guestRatings = 0;
  survey = 0;
  guest2wayMessaging = 0;
  requestComplaints = 0;
  requestEscalations = 0;
  totalComplaints = 0;
  totalEscalations = 0;
  blinkInterval: any = null;
  originalTitle: string = document.title;
  isTabActive: boolean = true;
  pollingSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,private _dashboardservice: DashboardService) { }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // Ask permission for notification
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Start polling
    this.fetchUnreadCount();
    this.pollingSubscription = interval(20000).subscribe(() => {
      this.fetchUnreadCount();
    });

    document.addEventListener("visibilitychange", () => {
      this.isTabActive = !document.hidden;
      if (this.isTabActive && this.blinkInterval) {
        this.stopTabBlinking();
      }
    });
  }

  fetchUnreadCount() {
    // replace with your real backend API URL
    var dt_obj={
    "user_id": 140,
    "location_id": this.logininfo.location_id,
    "department_id": 4
}

    this._dashboardservice.get_request(dt_obj).subscribe({
      next: (response) => {
        console.log(response.content.new_requests);

        this.newRequests = response.content.new_requests || 0;
        this.requestsInProgress = response.content.requests_in_progress || 0;
        this.newOrders = response.content.new_orders || 0;
        this.ordersInProgress = response.content.orders_in_progress || 0;
        this.orderComplaints = response.content.order_complaints || 0;
        this.orderEscalations = response.content.order_escalations || 0;
        this.dailyTasks = response.content.daily_tasks || 0;
        this.finishedTasks = response.content.finished_tasks || 0;
        this.allottedTask = response.content.allotted_task || 0;
        this.priorityTask = response.content.priority_task || 0;
        this.roomsUnderClearance = Number(response.content.rooms_under_clearance) || 0;
        this.roomsInCleaning = Number(response.content.rooms_in_cleaning) || 0;
        this.opsPosted = response.content.ops_posted || 0;
        this.opsReceived = response.content.ops_received || 0;
        this.opsInProgress = response.content.ops_inprogress || 0;
        this.opsCcTasks = response.content.ops_cc_tasks || 0;
        this.opsEscalations = response.content.ops_escalations || 0;
        this.guestComplaints = response.content.guest_complaints || 0;
        this.guestFeedbacks = response.content.guest_feedbacks || 0;
        this.guestRatings = response.content.guest_ratings || 0;
        this.survey = response.content.survay || 0;
        this.guest2wayMessaging = response.content.guest_2way_messageing || 0;
        this.requestComplaints = response.content.request_complaints || 0;
        this.requestEscalations = response.content.request_escalations || 0;

        this.totalComplaints = this.requestComplaints + this.orderComplaints;
        this.totalEscalations = this.requestEscalations + this.orderEscalations;



        if (this.newRequests > 0) {
          this.showNotification('New Requests', `You have ${this.newRequests} new request(s).`);
        }
        
         if (this.requestsInProgress > 0) {
          this.showNotification('Request in Progress', `You have ${this.requestsInProgress} request(s) in progress`);
        }
         if (this.orderEscalations > 0) {
          this.showNotification('Order Escalations', `You have ${this.orderEscalations} order escalation(s).`);
        }
         if (this.roomsUnderClearance > 0) {
          this.showNotification('Room Under Clearance', `You have ${this.roomsUnderClearance} room(s) under clearance.`);
        }
         if (this.guestComplaints > 0) {
          this.showNotification('Guest Complaint', `You have ${this.guestComplaints} guest complaint(s)..`);
        }
    
      },
      error: err => {
        console.error("Error fetching unread counts", err);
      }
    });
  }

  showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'assets/icons/rmslogo2.png'
      });
    }

    if (!this.isTabActive) {
      this.startTabBlinking(body);
    }
  }

  startTabBlinking(message: string) {
    if (this.blinkInterval) return;
    let toggle = false;
    this.blinkInterval = setInterval(() => {
      document.title = toggle ? message : this.originalTitle;
      toggle = !toggle;
    }, 100000000000000);
  }

  stopTabBlinking() {
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
    document.title = this.originalTitle;
  }

  get_request(type: any) {
    this.router.navigate(['frontdesk/request/'+type]);
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  gotoroomview(){
    location.href='#/frontdesk/allrooms/all';
  }
}
