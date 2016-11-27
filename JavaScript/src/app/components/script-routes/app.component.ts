import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LoginComponent} from './login.component';
import {RegisterComponent} from './register.component';
import {SearchParkingComponent} from './search-parking.component';
import {CreateTripComponent} from './create-trip.component';
import {MyTripsComponent} from './my-trips.component';
import {AccountService} from '../../services/account.service';
import {SettingsComponent} from './settings-account.component';
import {NearMeComponent} from './near-me.component';
import {TripDetailsComponent} from './trip-details.component';
import {CreateComponent} from './create.component';
import {ShowParkingsComponent} from './../script/show-parkings.component';



@Component({
  moduleId: module.id,
  selector: 'find-parking-goteborg-app',
  providers: [],
  templateUrl: '../html-routes/app.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  {
    path: '/show-parkings', name: 'ShowParkings', component: ShowParkingsComponent
  },
  
  {
    path: '/search-parking', name: 'SearchParking', component: SearchParkingComponent, useAsDefault: true
  },
  {
    path: '/create-trip', name: 'CreateTrip', component: CreateTripComponent
  },
  {
    path: '/my-trips', name: 'MyTrips', component: MyTripsComponent 
  },
  {
    path: '/login', name: 'Login', component: LoginComponent
  },
  {
    path: '/register', name: 'Register', component: RegisterComponent
  },
  {
    path: '/settings', name: 'Settings', component: SettingsComponent
  },
  {
    path: '/near-me', name: 'NearMe', component: NearMeComponent
  },
  {
    path: '/trip-details', name: 'TripDetails', component: TripDetailsComponent
  },
  {
    path: '/create/:tripStatus/...', name: 'Create', component: CreateComponent
  }
])
export class AppComponent {
  constructor(private accountService: AccountService) { }
  
  logout() {
    this.accountService.logOutUser();
  }
}
