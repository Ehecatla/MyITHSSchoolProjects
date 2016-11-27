import {Component, OnInit} from '@angular/core';
import {GoogleMapsService} from '../../services/google-maps.service';
import {Parking} from '../../supporting-files/parking';
import {ParkingService} from '../../services/parking.service';
import {ValidateService} from '../../services/validate.service';
import {Destination} from '../../supporting-files/destination';
import {ParkingListComponent} from './parking-list.component';
import {ShowParkingsComponent} from './show-parkings.component';
import {PositionService} from '../../services/position.service';
import {Router} from '@angular/router-deprecated';
import {TripsService} from '../../services/trips.service';

declare var google: any;

@Component({
  moduleId: module.id,
  selector: 'quick-search',
  providers: [GoogleMapsService, ParkingService, PositionService, ValidateService],
  templateUrl: '../html/quick-search.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [],
  pipes: []
})
export class QuickSearchComponent implements OnInit {
  destination: Destination = new Destination();
  loadingParkings=false;
  
  constructor(private googleMapsService: GoogleMapsService, private parkingService: ParkingService,private positionService: PositionService,private router:Router, private tripsService: TripsService, private validateService: ValidateService) { }
  
  ngOnInit() {
    this.googleMapsService.addGoogleSearchBox('address');
  }
  
  quickFindParking() {
    if (!this.validateFormFields()) {
      return;
    }
    this.parkingService.findParking(this.destination).then(parkings => {
      this.tripsService.activeDestination = this.destination;
      this.destination.parking = parkings;
      this.router.navigate(['ShowParkings']);

      console.log(parkings);
    });
    this.tripsService.check = "new search";
    this.loadingParkings=true;
    //var inputField = document.getElementById('quickSearchInput');
    //this.googleMapsService.addGoogleSearchBox('address-field');
    //inputField.innerHTML = '';  
  }

   showParkingsOnMap() {
        this.positionService.getCurrentLocation().then((result1) => {
        let latitude = result1.coords.latitude; 
        let longitude = result1.coords.longitude;
        var d = new Destination();
        
        // gets current address from latlng
        this.googleMapsService.convertLatlng(latitude,longitude).then(address => {
            //console.log("got a converterad address? "+address);
            d.address = address;
            
            //gets parkings which are near to the current position
            this.parkingService.findParking(d).then(parkings => {
        
                this.googleMapsService.setPins(latitude,longitude,parkings);
             
            }); 
          });
        }); 
        this.router.navigate(['NearMe']); 
    }

    validateFormFields(): boolean{
    let addressElements: HTMLInputElement[] = Array.prototype.slice.call(<HTMLCollection>document.getElementsByClassName('address'));
   	return this.validateService.validateInputFields(addressElements);
  }
  
}
