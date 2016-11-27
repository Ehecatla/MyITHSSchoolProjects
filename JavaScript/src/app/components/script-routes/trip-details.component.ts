import {Component, OnInit,Input} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {AccountService} from '../../services/account.service';
import {Destination} from '../../supporting-files/destination';
import {Trip} from '../../supporting-files/trip';
import {TripsService} from '../../services/trips.service';
import {Comment} from '../../supporting-files/comment';
import {Parking} from '../../supporting-files/parking'
import {ParkingService} from '../../services/parking.service'

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [ParkingService],
  templateUrl: '../html-routes/trip-details.component.html',
  styleUrls: ['../css/app.component.css'],
  pipes: []
})
export class TripDetailsComponent implements OnInit {
    
  chosenTrip: Trip = new Trip();
  loadingMap=false;
  
  constructor(private router:Router,private tripsService:TripsService, private accountService: AccountService, private parkingService:ParkingService) {
    if (!accountService.isLoggedIn) {
        router.navigate(['/Login']);
    }
  }
  
  ngOnInit() {
      this.chosenTrip = this.tripsService.activeTrip;
      this.tripsService.getDestinations(this.chosenTrip).then(result => this.chosenTrip.destinations = result);
  }
  /*
  backToSearch(){
      this.router.navigate(['SearchParking']);
  }*/

  setTrip(aTrip) {
      this.tripsService.getDestinations(aTrip).then((destinations) => {
           
            this.chosenTrip.destinations = destinations;
      });
  }

  showParking(destination:Destination){
      this.parkingService.findParking(destination).then(parkings => {
          this.tripsService.activeDestination = destination;
          destination.parking = parkings;
          this.router.navigate(['/ShowParkings']);
      });
      this.tripsService.check="back to details";
      this.loadingMap = true;
  }
  
  editTrip(){
     this.router.navigate(['/Create', {tripStatus:'old'}]);
  }

  backToMyTrip(){
      this.router.navigate(['/MyTrips']);
  }
}