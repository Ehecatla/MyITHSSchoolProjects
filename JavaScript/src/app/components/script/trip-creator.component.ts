import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {TripsService} from '../../services/trips.service';
import {ValidateService} from '../../services/validate.service';
import {Trip} from '../../supporting-files/trip';

@Component({
  moduleId: module.id,
  selector: 'trip-creator',
  providers: [ValidateService],
  templateUrl: '../html/trip-creator.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [ACCORDION_DIRECTIVES],
  pipes: []
})
export class TripCreatorComponent{
  tripId: string;
  count:number;

  constructor(private router: Router, private tripsService: TripsService, private validateService: ValidateService) { 
    if (tripsService.activeTrip.id) {
      this.tripId = tripsService.activeTrip.id;
    }
  }

  newDestination() {
    this.router.navigate(['../Destination', {index: -1}]);
  }

  deleteDestination() {
    this.tripsService.activeTrip.destinations.splice(this.count, 1);
    return false;
  }

  editDestination(index: number) {
    this.router.navigate(['../Destination', {index: index}]);
  }

  saveTrip() {
    if (!this.validateFormFields()) {
      return;
    }

    this.tripsService.addTrip(this.tripsService.activeTrip).then(done => {
      if (done) {        
        if(this.tripsService.activeTrip.id){
          /*this.tripsService.deleteTheTrip(this.tripsService.activeTrip).then((result)=>{
            this.router.navigate(['/MyTrips']);
          });*/
          this.tripsService.deleteTrip(this.tripId);
          this.router.navigate(['/MyTrips']);
        } else {
          this.router.navigate(['/MyTrips']);
        }
      }
    }); 
  }

  validateFormFields(): boolean{
    let nameElements: HTMLInputElement[] = Array.prototype.slice.call(<HTMLCollection>document.getElementsByClassName('name'));
   	return this.validateService.validateNameFields(nameElements);
  }

  setCount(index:number){
    this.count= index;
  }
}