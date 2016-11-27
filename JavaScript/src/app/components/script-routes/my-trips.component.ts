import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Trip} from '../../supporting-files/trip';
import {HistoryComponent} from '../script/history.component';
import {GoogleMapsComponent} from '../script/google-maps.component';
import {AccountService} from '../../services/account.service';

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [],
  templateUrl: '../html-routes/my-trips.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [HistoryComponent, GoogleMapsComponent],
  pipes: []
})
export class MyTripsComponent {
  newTrip = new Trip();
  
  constructor(private accountService: AccountService, private router: Router) {
    if (!accountService.isLoggedIn) {
      router.navigate(['Login']);
    }
  }
  
}
