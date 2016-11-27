import {Component, OnInit, Inject, Input, Output, EventEmitter} from '@angular/core';
import {Parking} from '../../supporting-files/parking';
import {Destination} from '../../supporting-files/destination';
import {GoogleMapsComponent} from './google-maps.component';

@Component({
  moduleId: module.id,
  selector: 'parking-list',
  providers: [],
  templateUrl: '../html/parking-list.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [GoogleMapsComponent],
  pipes: []
})
export class ParkingListComponent {
  @Input() destination: Destination;
  parking: Parking;
  
  constructor() {} 
  
  parkingClick(parking: Parking) {
    this.parking = parking;
  }         
              
}