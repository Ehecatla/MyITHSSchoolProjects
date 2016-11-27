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
  templateUrl: '../html-routes/login.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [AccountFeedbackComponent],
  pipes: []
})
export class LoginComponent {
  userAccount: User = new User();
  feedback: string = '';
  feedbackReset: string ='';
  resetEmail: string ='';
  showingResetForm: boolean = false;

  constructor(private accountService: AccountService, private router: Router, private tripsService: TripsService) { }
  
  /**Runs method that attempts to login user depending on given input this will either
   * succed or an appropiate feedback will be given.
   */
  loginUser() {
    this.feedback = 'Working...';
    this.accountService.logInUser(this.userAccount).then(result => {
      if (result === 'ok') {
        this.router.navigate(['SearchParking']);
        this.tripsService.getTrips();
      } else {
        this.feedback = result;
      }
    });
  }
  
  /**Enables enter key on keyboard to submit login form.*/
  enterHandler(keyPressed){
    if(keyPressed.keyCode === 13){
      this.loginUser();
    }
  }

  /**Shows or hides reset password form. */
  showResetForm(){
    this.showingResetForm = !this.showingResetForm;
  }

  /**Sends request to send reset password email to users given password
   * if possible. Gives feedback message that action succeded or failed.
   */
  resetPassword(){
    this.feedbackReset = 'Working...';
    this.accountService.sendResetEmail(this.resetEmail).then(result =>{
      if(result){
        this.feedbackReset = result;
      } else {
        this.feedbackReset = 'An error occured, please try later';
      }
    });
  }
  
}
