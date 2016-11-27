import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {User} from '../../supporting-files/user';
import {AccountService} from '../../services/account.service';
import {TripsService} from '../../services/trips.service';
import {AccountFeedbackComponent} from '../script/account-feedback.component';

@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [],
  templateUrl: '../html-routes/register.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [AccountFeedbackComponent],
  pipes: []
})
export class RegisterComponent {
  userAccount: User = new User();
  feedback: string = '';
  
  constructor(private accountService: AccountService, private router: Router, private tripsService: TripsService) { }
 

 /**
  * If user clicks enter from any of input forms for registration then form will be
  * submited and an attempt to create account made.
  */
 enterHandler(eventKey){
   if(eventKey.keyCode === 13){
     this.createUser();
   }
 }


/**
 * createUser runs methods to create user account and displays feedback if needed
 * when account couldnt be created. 
 * If account was created with success user is logged in.
 */
 createUser(){
      this.feedback = 'Working...';
      this.accountService.createUser(this.userAccount).then(result =>{
        if(result === 'ok'){
          this.router.navigate(['SearchParking']);
          //this.tripsService.getTrips();
          //this.feedback='Account created! Check your email to validate account.';
          this.accountService.isUserLoggedIn();
          this.tripsService.getTrips();
        } else{
          this.feedback = result;
        }
      });
 }


 
}
