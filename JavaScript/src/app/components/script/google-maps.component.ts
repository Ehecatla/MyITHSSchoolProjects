import {Component, OnInit, Input} from '@angular/core';
import {Parking} from '../../supporting-files/parking';
import {PositionService} from '../../services/position.service';
import {GoogleMapsService} from '../../services/google-maps.service';

@Component({
  moduleId: module.id,
  selector: 'google-maps',
  providers: [PositionService, GoogleMapsService],
  templateUrl: '../html/google-maps.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [],
  pipes: []
})
export class GoogleMapsComponent implements OnInit {
  private _parking: Parking;
  
  constructor(private googleMapsService: GoogleMapsService, private positionService: PositionService) { }
  
  ngOnInit() {
    /*this.positionService.getCurrentLocation().then((result) => {
      let latitude = result.coords.latitude; 
      let longitude = result.coords.longitude;
      this.googleMapsService.getAdressName(latitude,longitude);
    });*/
  }
  
  @Input() set parking(parking: any) {
    if(!parking){
      return;
    }
    this.positionService.getCurrentLocation().then((result) => {
        let latitude = result.coords.latitude; 
        let longitude = result.coords.longitude;
        
        document.getElementById('map').setAttribute('src', "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCoO_vczIXw8qrrNgaLzZNqNus5YFU9GnQ&origin="+latitude+","+longitude+"&destination="+parking.name+",Göteborg");
    });
  }
  
}