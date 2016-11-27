import {Component, OnInit} from '@angular/core';
import {GoogleMapsService} from '../../services/google-maps.service';
import {Parking} from '../../supporting-files/parking';
import {QuickSearchComponent} from '../script/quick-search.component';

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [GoogleMapsService],
  templateUrl: '../html-routes/search-parking.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [QuickSearchComponent],
  pipes: []
})
export class SearchParkingComponent implements OnInit {
  
  constructor(private googleMapsService: GoogleMapsService) { }
  
  ngOnInit() {
    this.googleMapsService.addGoogleSearchBox('address-field');
  }
}