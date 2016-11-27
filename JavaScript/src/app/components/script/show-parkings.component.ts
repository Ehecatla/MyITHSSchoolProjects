import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {Parking} from '../../supporting-files/parking';
import {Destination} from '../../supporting-files/destination';
import {GoogleMapsComponent} from './google-maps.component';
import {Router} from '@angular/router-deprecated';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {TripsService} from '../../services/trips.service';

@Component({
  moduleId: module.id,
  selector: 'show-parkings',
  providers: [],
  templateUrl: '../html/show-parkings.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [GoogleMapsComponent, ACCORDION_DIRECTIVES],
  pipes: []
})
export class ShowParkingsComponent {
  destination:Destination = new Destination(); 
  parking: Parking;
  public backHidden = false;
  public newSearchHidden = false;

constructor(private tripsService: TripsService, private router: Router){
  this.destination = tripsService.activeDestination;
  if (!this.destination) {
    router.navigate(['/SearchParking']);
  }
  if(this.tripsService.check == "new search"){
      this.backHidden = true;
  }else if(this.tripsService.check == "back to details"){
      this.newSearchHidden = true;
  }
}

parkingClick(parking: Parking) {
  this.parking = parking;
}

newSearch(){
   this.router.navigate(['/SearchParking']);
}
backToDetails(){
   this.router.navigate(['/TripDetails']);
}
     
}