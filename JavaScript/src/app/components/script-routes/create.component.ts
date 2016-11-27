import {Component, OnInit} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, RouteParams} from '@angular/router-deprecated';
import {AccountService} from '../../services/account.service';
import {TripsService} from '../../services/trips.service';
import {Trip} from '../../supporting-files/trip';
import {TripCreatorComponent} from '../script/trip-creator.component';
import {DestinationCreatorComponent} from '../script/destination-creator.component';

@Component({
  moduleId: module.id,
  selector: 'create',
  providers: [],
  templateUrl: '../html-routes/create.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  {
    path: '/trip', 
    name: 'Trip', 
    component: TripCreatorComponent,
    useAsDefault: true
  },
  {
    path: '/destination/:index', 
    name: 'Destination', 
    component: DestinationCreatorComponent
  }
])
export class CreateComponent {
  
  constructor(private accountService: AccountService, private router: Router, private routeParams: RouteParams, private tripsService: TripsService) {
    if (!accountService.isLoggedIn) {
      router.navigate(['/Login']);
      return;
    }
    if (routeParams.get('tripStatus') === 'new') {
      this.tripsService.activeTrip = new Trip();
    }
    if (tripsService.activeTrip.id) {
      let t: Trip = new Trip();
      t.deepClone(tripsService.activeTrip);
      tripsService.activeTrip = t;
    }
  }
  
}
