import {Component, OnInit} from '@angular/core';
import {GoogleMapsService} from '../../services/google-maps.service';
import {Router} from '@angular/router-deprecated';

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [GoogleMapsService],
  templateUrl: '../html-routes/near-me.component.html',
  styleUrls: ['../css/app.component.css'],
  pipes: []
})
export class NearMeComponent implements OnInit {
  
  constructor(private googleMapsService: GoogleMapsService,private router:Router) { }
  
  ngOnInit() {}

  backToSearch(){
      this.router.navigate(['SearchParking']);
  }
}