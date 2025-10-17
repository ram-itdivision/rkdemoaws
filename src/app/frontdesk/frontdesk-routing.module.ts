import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrscreensComponent } from './frscreens/frscreens.component';
import { DashboardComponent } from './frscreens/dashboard/dashboard.component';
import { ReservationComponent } from './frscreens/reservation/reservation.component';
import { BookingsComponent } from './frscreens/bookings/bookings.component';
import { AllroomsComponent } from './frscreens/allrooms/allrooms.component';
import { RequestComponent } from './frscreens/request/request.component';
import { OngoingcleaningComponent } from './frscreens/ongoingcleaning/ongoingcleaning.component';
import { FinishcleaningComponent } from './frscreens/finishcleaning/finishcleaning.component';
import { UnderclearanceComponent } from './frscreens/underclearance/underclearance.component';
import { CleaningrequiredComponent } from './frscreens/cleaningrequired/cleaningrequired.component';
import { PostedoperationsComponent } from './frscreens/postedoperations/postedoperations.component';
import { ReceivedoperationsComponent } from './frscreens/receivedoperations/receivedoperations.component';
import { InprogressoperationsComponent } from './frscreens/inprogressoperations/inprogressoperations.component';
import { FinishedoperationsComponent } from './frscreens/finishedoperations/finishedoperations.component';
import { CascadeusersComponent } from './frscreens/cascadeusers/cascadeusers.component';
import { EscalatedtasksComponent } from './frscreens/escalatedtasks/escalatedtasks.component';
import { RequestescalationsComponent } from './frscreens/requestescalations/requestescalations.component';
import { RequestcomplaintsComponent } from './frscreens/requestcomplaints/requestcomplaints.component';
import { ContactlessComponent } from './frscreens/contactless/contactless.component';
import { CheckinhistoryComponent } from './frscreens/checkinhistory/checkinhistory.component';
import { TwowaymsgComponent } from './frscreens/twowaymsg/twowaymsg.component';
import { BroadcastmsgComponent } from './frscreens/broadcastmsg/broadcastmsg.component';
import { GuestcomplaintsComponent } from './frscreens/guestcomplaints/guestcomplaints.component';
import { GuestfeedbackComponent } from './frscreens/guestfeedback/guestfeedback.component';
import { GuestratingsComponent } from './frscreens/guestratings/guestratings.component';
import { BookingcalendarComponent } from './frscreens/bookingcalendar/bookingcalendar.component';
import { AddreservationComponent } from './frscreens/addreservation/addreservation.component';
import { CheckinComponent } from './frscreens/checkin/checkin.component';
import { PaymentComponent } from './frscreens/payment/payment.component';
import { ReceiptComponent } from './frscreens/receipt/receipt.component';
import { FloorsComponent } from './frscreens/floors/floors.component';
import { RoomcategoryComponent } from './frscreens/roomcategory/roomcategory.component';
import { RoomconfigComponent } from './frscreens/roomconfig/roomconfig.component';
import { RoomfeaturesComponent } from './frscreens/roomfeatures/roomfeatures.component';
import { RoomqrcodeComponent } from './frscreens/roomqrcode/roomqrcode.component';
import { RoomplannerComponent } from './frscreens/roomplanner/roomplanner.component';
import { RoomtariffsComponent } from './frscreens/roomtariffs/roomtariffs.component';
import { CouponmasterComponent } from './frscreens/couponmaster/couponmaster.component';
import { RoomsettingsComponent } from './frscreens/roomsettings/roomsettings.component';
import { MealplanComponent } from './frscreens/mealplan/mealplan.component';
import { CountryComponent } from './frscreens/country/country.component';
import { OccupancycatComponent } from './frscreens/occupancycat/occupancycat.component';
import { LoyaltypointsComponent } from './frscreens/loyaltypoints/loyaltypoints.component';
import { LocationconfigComponent } from './frscreens/locationconfig/locationconfig.component';
import { StateComponent } from './frscreens/state/state.component';
import { BookingDetailsComponent } from './frscreens/booking-details/booking-details.component';
import { RoomservicesComponent } from './frscreens/roomservices/roomservices.component';
import { CalendarregComponent } from './frscreens/calendarreg/calendarreg.component';
import { CheckedinlistComponent } from './frscreens/checkedinlist/checkedinlist.component';
import { CheckinformComponent } from './frscreens/checkinform/checkinform.component';
import { AddclcheckinComponent } from './frscreens/addclcheckin/addclcheckin.component';
import { RoomcheckinComponent } from './frscreens/roomcheckin/roomcheckin.component';
import { PropertypolicyComponent } from './frscreens/propertypolicy/propertypolicy.component';
import { CancellationpolicyComponent } from './frscreens/cancellationpolicy/cancellationpolicy.component';
import { GuestappconfigComponent } from './frscreens/guestappconfig/guestappconfig.component';
import { RestaurantorderComponent } from './frscreens/restaurantorder/restaurantorder.component';
import { CheckinformupdateComponent } from './frscreens/checkinformupdate/checkinformupdate.component';

const routes: Routes = [
  {
    path:'',
    component: FrscreensComponent,
    children:[
      {
        path:'',
        component: AllroomsComponent
      },
      {
        path:'dashboard',
        component: DashboardComponent
      }
      ,
      {
        path:'reservation',
        component: ReservationComponent
      }
      ,
      {
        path:'bookingcalendar',
        component: BookingcalendarComponent
      }
      ,
      {
        path:'allrooms/:type',
        component: AllroomsComponent
      },
      {
        path:'request/:type',
        component: RequestComponent
      },
      {
        path:'ongoingcleaning',
        component: OngoingcleaningComponent
      },
      {
        path:'finishcleaning',
        component: FinishcleaningComponent
      },
      {
        path:'underclearance/:type',
        component: UnderclearanceComponent
      },
      {
        path:'cleaningrequired',
        component: CleaningrequiredComponent
      },
      {
        path:'postedoperations',
        component: PostedoperationsComponent
      },
      {
        path:'receivedoperations',
        component: ReceivedoperationsComponent
      },
      {
        path:'inprogressoperations',
        component: InprogressoperationsComponent
      },
      {
        path:'finishedoperations',
        component: FinishedoperationsComponent
      },
      {
        path:'cascadeusers',
        component: CascadeusersComponent
      },
      {
        path:'escalatedtasks',
        component: EscalatedtasksComponent
      },
      {
        path:'requestescalations',
        component: RequestescalationsComponent
      },
      {
        path:'requestcomplaints',
        component: RequestcomplaintsComponent
      },
      {
        path:'contactless',
        component: ContactlessComponent
      },
      {
        path:'checkinhistory',
        component: CheckinhistoryComponent
      },
      {
        path:'twowaymsg',
        component: TwowaymsgComponent
      },
      {
        path:'broadcastmsg',
        component: BroadcastmsgComponent
      },
      {
        path:'guestcomplaints',
        component: GuestcomplaintsComponent
      },
      {
        path:'guestfeedback',
        component: GuestfeedbackComponent
      },
      {
        path:'guestratings',
        component: GuestratingsComponent
      },
      {
        path:'allrooms',
        component: AllroomsComponent
      },
      {
        path:'allrooms',
        component: AllroomsComponent
      },
      {
        path:'addreservation',
        component: AddreservationComponent
      },
      {
        path:'checkin',
        component: CheckinComponent
      },
      {
        path:'payment',
        component: PaymentComponent
      },
      {
        path:'receipt',
        component: ReceiptComponent
      },
      {
        path:'floors',
        component: FloorsComponent
      },
      {
        path:'floors',
        component: FloorsComponent
      },
      {
        path:'roomcategory',
        component: RoomcategoryComponent
      },
      {
        path:'roomconfig',
        component: RoomconfigComponent
      },
      {
        path:'roomfeatures',
        component: RoomfeaturesComponent
      },
      {
        path:'roomqrcode',
        component:RoomqrcodeComponent
      },
      {
        path:'roomplanner',
        component: RoomplannerComponent
      },
      {
        path: 'roomtariffs',
        component: RoomtariffsComponent
      },
      {
        path : 'couponmaster',
        component: CouponmasterComponent
      },
      {
        path: 'roomsettings',
        component: RoomsettingsComponent
      },
      {
        path: 'mealplan',
        component: MealplanComponent
      },
      {
        path: 'country',
        component: CountryComponent
      },
      {
        path: 'state',
        component: StateComponent
      },
      {
        path:'occupancycat',
        component:OccupancycatComponent
      },
      {
        path: 'loyaltypoints',
        component: LoyaltypointsComponent
      },
      {
        path: 'locationconfig',
        component: LocationconfigComponent
      },
      {
        path:'booking-details',
        component : BookingDetailsComponent
      },
      {
        path:'roomservices',
        component: RoomservicesComponent
      },
      {
        path: 'calendarreg',
        component: CalendarregComponent
      },
      {
        path: 'checkedinlist',
        component: CheckedinlistComponent
      },
      {
        path: 'checkinform',
        component: CheckinformComponent
      },
      {
        path:'addclcheckin',
        component: AddclcheckinComponent
      },
      {
        path: 'roomcheckin',
        component: RoomcheckinComponent
      },
      {
        path: 'propertypolicy',
        component: PropertypolicyComponent
      },
      {
        path: 'cancellationpolicy',
        component: CancellationpolicyComponent
      },{
        path : 'guestappconfig',
        component : GuestappconfigComponent
      },
      {
        path: 'restaurantorder',
        component: RestaurantorderComponent
      },
      {
        path: 'checkinformupdate',
        component: CheckinformupdateComponent
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontdeskRoutingModule { }
