import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {FirebaseRef} from 'angularfire2';
import { Destination } from '../../supporting-files/destination';
import { Trip } from '../../supporting-files/trip';
import { Comment } from '../../supporting-files/comment';
import { Parking } from '../../supporting-files/parking';
import { ApiService } from '../../services/api.service';
import {TripsService} from '../../services/trips.service';
import {PositionService} from '../../services/position.service';
import {GoogleMapsService} from '../../services/google-maps.service';
import { User } from '../../supporting-files/user';
import {Router} from '@angular/router-deprecated';
import { TripDetailsComponent } from './../script-routes/trip-details.component';

@Component({
  moduleId: module.id,
  selector: 'trip-history',
  providers: [PositionService, GoogleMapsService],
  templateUrl: '../html/history.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [],
  pipes: []
})
export class HistoryComponent {
  @Output() tripEvent = new EventEmitter();
  
  constructor(private tripsService: TripsService, private router:Router) { }
  
  /**
   * showTrip displays given trip for editing purposes.
   */
  showTrip (trip: Trip) {
    this.tripsService.getDestinations(trip).then(destinations => {
      trip.destinations = destinations;
      this.tripEvent.emit(trip);
    });
  }
  
  /**
   * When table row representing specific trip is clicked then this function shows 
   * trip for editing purposes.
   */
  tripClicked (trip: Trip) {
   
    this.tripsService.activeTrip = trip;    
    this.router.navigate(['TripDetails']);
  
  }

  deleteTheTrip(){
    this.tripsService.deleteTrip(this.tripsService.activeTrip.id);
    this.router.navigate(['/MyTrips']);

  }

  setTrip(trip){
    this.tripsService.activeTrip = trip; 
  }


}