import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {AccountService} from '../../services/account.service';
import {User} from '../../supporting-files/user';
import {AccountFeedbackComponent} from '../script/account-feedback.component';


@Component({
  moduleId: module.id,
  selector: 'router-outlet',
  providers: [],
  templateUrl: '../html-routes/settings-account.component.html',
  styleUrls: ['../css/app.component.css'],
  directives: [AccountFeedbackComponent],
  pipes: []
})
export class SettingsComponent implements OnInit {
  _userAccount: User;
  _formPassword: string ='';
  _formNewPassword: string = '';
  _formOldEmail: string = '';
  _formNewEmail: string = '';
  _feedbackEmail:string ='';
  _feedbackPass:string='';

  
  constructor(private accountService: AccountService, private router: Router) {
    if (!accountService.isLoggedIn) {
      router.navigate(['Login']);
    } else {
      //console.log('user is logged in - show info');
    }
  }
  
  ngOnInit(){
    this._userAccount = this.accountService.user;
    this._formOldEmail = this._userAccount.email;
  }

  /** updateAccountEmail updates users email if new one is given and if 
   * new one is given and users session is active.
  */
  updateAccountEmail(){
    this._feedbackEmail = 'Working...';
    if(this._formNewEmail && this._userAccount.email){
      let theNewEmail = this._formNewEmail;
      this.accountService.changeUserEmail(this._userAccount.email, this._formNewEmail).then(result=>{
        if(result){
          if(result==='ok'){
            this._formOldEmail = theNewEmail; //temporary solution? otherwise it doesnt autoupdate as email is not fetched from DB but onlogin from form field as of now. 
            this._userAccount.email = theNewEmail;
            this._formNewEmail = ''; //clear field
            this._feedbackEmail = 'Email changed successfully.';
          } else {
            this._feedbackEmail = result;
          }
        } else {
          this._feedbackEmail = '';
        } 
      });
    } else if(this._formNewEmail) { //this error shouldnt happen
      this._feedbackEmail = 'Error, data corrupt.';
    } else if (this._userAccount.email){ //input field for email is empty
       this._feedbackEmail = ('Aborted, fill new email first.');
    }
  }

  /** 
   * Updates users password if user has given correct old and new password, if 
   * new password has correct length and session is active.
  */
  updateAccountPassword(){
    this._feedbackPass = 'Working...';
    if(this._formPassword && this._formNewPassword){
      let newPass = this._formNewPassword;
      let oldPass = this._formPassword;
      this.accountService.changeUserPassword(this._formPassword, this._formNewPassword).then(result=>{
        if(result){
          if(result==='ok'){
            this._userAccount.changePassword(newPass, oldPass);
            this._formNewPassword = '';
            this._formPassword ='';
            this._feedbackPass = 'Password changed successfully.';
          } else {
            this._feedbackPass = result;
          }
        } else {
          this._feedbackPass='An unknown error occured, please relog.';
        }
      });
    } else {
      this._feedbackPass = 'Must fill both old and new password.';
    }
  }


  
}