import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {FirebaseRef} from 'angularfire2';
import {AccountService} from '../../services/account.service';
import {Trip} from '../../supporting-files/trip';
import {Parking} from '../../supporting-files/parking';
import {HistoryComponent} from '../script/history.component';
import {NewTripComponent} from '../script/new-trip.component';
import {GoogleMapsComponent} from '../script/google-maps.component';

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [],
  templateUrl: '../html-routes/create-trip.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [HistoryComponent, NewTripComponent, GoogleMapsComponent],
  pipes: []
})
export class CreateTripComponent {
  newTrip: Trip = new Trip();
  //parking: Parking = new Parking('', 0, '0', '');
  
  constructor(private accountService: AccountService, private router: Router) {
    if (!accountService.isLoggedIn) {
      router.navigate(['Login']);
    }
  }
  
  /*parkingEvent(parking) {
    this.parking = parking;
  }*/
  
  tripEvent(trip) {
    this.newTrip = trip;
  }
}
