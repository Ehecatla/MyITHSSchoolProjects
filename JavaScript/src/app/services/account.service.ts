import {Injectable, Inject} from '@angular/core';
import {FirebaseRef, FirebaseAuth, FirebaseAuthState, FirebaseAuthConfig} from 'angularfire2';
import {FirebaseListObservable} from 'angularfire2';
import {User} from '../supporting-files/user';

@Injectable()
export class AccountService {
  userid: string;
  user: User;
  isLoggedIn: boolean = false; //true if user extra data is loaded from DB
  
  constructor(@Inject(FirebaseRef) private _ref: any) {
    //this.loadUser();
    this.user = null;
    this.trackUserAuthentication();
    this.isUserLoggedIn();

   }
  




    /**
     * Function createUser takes User object as parameter and if the object satisfies
     * requirements of email and password length and if no such user exists already then
     * user is created and logged in. 
     * This function uses checkEmailAndPass and createUserInDB functions to fullfill its job.
     */
    createUser(account: User): Promise<string>{
      return new Promise(resolve =>{
        let fieldFeedback = this.checkEmailAndPass(account); //check if name, email and pass are ok
        if(fieldFeedback === 'ok'){
          this.createUserInDB(account).then(result =>{  //create user account in Firebase
            if(result === 'ok'){ 
              this.logInUserInDB(account).then(result =>{ //log in session for user
                if(result==='ok'){
                  let userIdKey = this._ref.getAuth().uid;
                  this.createExtraUserData(account, userIdKey).then(result =>{ //create necessary extra Firebase data for user
                    if(result==='ok'){
                      this.loadExtraUserData(account, userIdKey ).then(result =>{ //load in data
                        if(result){
                          resolve('ok');
                        } else{
                          resolve('Error');
                        }
                      });
                      
                    } else {
                      resolve('Error when creating user');
                    }
                  });
                } else {
                  resolve('An error occured when creating account, data corrupt');
                }
              });

              //resolve('ok'); //can just resolve result
            } else {
              resolve(result);
            }
          });
        } else {
          resolve(fieldFeedback);
        }
      }); 

    }


    /**
     * Function checkEmailAndPass checks if given User objects email and passwords
     * given for account creation fullfill given norms as length at least 8 letters
     * for password and at least 4 for email.
     */
    checkEmailAndPass(user: User):string{    
      let feedback = '';
      if(user.name && user.name.trim().length >0){ 
        if(user.email){
          if(user.logInPassword && user.logInPassword.trim().length >=8 ){
            if(user.logInPassword === user.repeatPassword){
              return 'ok';
            } else {
              return 'Passwords don\'t match';
            }
          } else {
            return 'Password is too short';
          }
        } else {
          return 'Fill user email';
        }
      } else {
        return 'User name is missing';
      }
 
    }

    /**
     * Function createUserInDB takes object of User type and creates user
     * account on Firebase database with objects properties name and password
     * where name is to be users email.
     */
    createUserInDB(user: User):Promise<string>{
      return new Promise(resolve =>{
      this._ref.createUser({
          email: user.email,
          password: user.logInPassword
        }, function(err, user) {
          if (!err) {
            //console.log('User created with id', user.uid);
            resolve('ok');
          } else { //check why user wasnt created
            resolve(err.message);
          }
        });

      });        
    }

    //authenticates user with name and password with use of firebase DB,
    //
    logInUserInDB(user: User):Promise<string>{
      this.logOutUser();
      return new Promise(resolve =>{
        this._ref.authWithPassword({  //login firebase user if data correct
          'email': user.email,
          'password': user.logInPassword
        }, function(error, authData) {
          if (error) {
            //console.log('Login Failed!', error);
            resolve(error.message);
          } else {
            //console.log('Authenticated successfully with payload:', authData);
            resolve('ok');
          }
        })

      });

    }

    /**
     * Function logOutUser unauthorizes user, logs out user.
     */
    logOutUser(){
      this._ref.unauth();
      this.userid = null;
      this.user = null;
      this.isLoggedIn = false;
    }

    /**Function isUserLoggedIn returns true if user is logged in otherwise false. */
    isUserLoggedIn(){
       var authData = this._ref.getAuth();
      if (authData) {
        // User is signed in.

        return true;
      } else {
        // No user is signed in.
        return false;
      }
    }

    /**
     * Function trackUserAuthentication sets up observer that fires off event 
     * when authentication status changes so when user logs in or logs out.
     */
    trackUserAuthentication(){
      this._ref.onAuth(function(authData) {
        if (authData) {
          //console.log('EEE Authenticated with uid:', authData.uid);
        } else {
          //console.log('EEE Client unauthenticated.');
          
        }
      });
    }

   

    /**
     * Function logInUser is used when user fills form to log in and has
     * given email and password information. 
     */
    logInUser(user: User): Promise<string>{
      return new Promise(resolve => {
        if(!user.email || !user.logInPassword){ //log in only if both name and pass are given!
          return resolve('Fill name and password');
        }
        
        this.logInUserInDB(user).then(result =>{ //if user logged in Firebase, log in
          if(result==='ok'){
             let userIdKey = this._ref.getAuth().uid;
              this.loadExtraUserData(user, userIdKey ).then(result =>{ //load in data
                if(result){
                  resolve('ok');
                } else{
                  resolve('Error');
                }
              });
          } else {
            resolve(result);      //return info that login failed
          }
        });
      });
    }


    /**Used to load user data if session is actual, not doing it at the moment.
     */
   loadUser(): Promise<any> {
      return new Promise(resolve => {
        if(this.isUserLoggedIn && this.isLoggedIn){ //both active session and user data loaded from DB
          // else if (this.isUserLoggedIn){} //-in active session only case could load in extra data and log in user
        } else {
          resolve('error');
        }
        
      });
    }

    //creates reference to be used with firebase things for user with given uid,
    // saves user name, uid in new post with own key, USE ONCE AT REGISTRATION ONLY
    createExtraUserData(user: User, uidKey: string):Promise<any>{
      return new Promise(resolve =>{
        this._ref.child('/userAccounts').orderByChild('uidKey').equalTo(uidKey).once('value', (databaseUsers) => {
          if (!databaseUsers.exists()) {
            let userCreated = this._ref.child('/userAccounts').push({
              name: user.name,
              uidKey: uidKey
            });
    
            userCreated.then(() => {
                resolve('ok');
              
            });  
          } else {
            resolve('error');
          }  
          });
        }); 
    }

    //loads all extra user data from firebase for given user with given uid
    loadExtraUserData(user:User, uidKey: string):Promise<string>{
      return new Promise(resolve =>{
        this._ref.child('/userAccounts').orderByChild('uidKey').equalTo(uidKey).on('value', (userAccounts) => {        
          userAccounts.forEach((aUser) => {  //should be only ONE with such uidkey
                user.name = (aUser.child('name').val());
                user.userKey = aUser.key(); //needed to load trips          
          });  

          if(user.userKey){ //if any was loaded then it got key now to load trips with
            this.userid = user.userKey;
            this.user = user;
            this.isLoggedIn = true;
            resolve('ok');
          } else {
            resolve('Incorrect name or password');
          }
      }); 
    });

    }

    /**
     * Method sendResetEmail takes input string as input and sends request
     * to database to send user password reset email. Then it resolves 
     * appropiate feedback message depending on outcome.
     */
    sendResetEmail(email:string):Promise<string>{
      return new Promise(resolve =>{
        if(!email){
          resolve('No email found.');
        } else {
          this._ref.resetPassword({
            email : email
          }, function(error) {
            if (error === null) {
              resolve('Password reset email sent successfully');
            } else {
              resolve( error);
            }
          });
        }

      });
    }

    /**
     * Changes email of user if requirements are met: a session must be active,
     * oldEmail argument must be existing one. Resolves feedback which is either
     * success or not.
     * 
     */
    changeUserEmail(oldEmail:string, newEmail:string):Promise<string>{
      return new Promise(resolve =>{
        if(oldEmail && newEmail){
          if(this._ref.getAuth()){ //need active session to change email
            this._ref.changeEmail({
              oldEmail : oldEmail,
              newEmail : newEmail,
              password : this.user.logInPassword //should be available after user logged in
            }, function(error) {
              if (error === null) {
                //sconsole.log('Email changed successfully');
                resolve('ok');
              } else {
                console.log('Error changing email:', error);
                resolve(error);
              }
            });
          } else { //shouldnt happen 
            resolve('Error, please relog, session expired.');
          }
        } else {
          resolve('Error. Couldn\'t change email.');
        }

      });
    }

    //1. check if both input given
    //2. check if session is active
    //3. check if oldpassword is correct? does method do that itself?
    changeUserPassword(oldPassword:string, newPassword:string):Promise<string>{
      return new Promise(resolve =>{
        if(oldPassword && newPassword){
          if(newPassword.trim().length >=8){

            this._ref.changePassword({
              email       : this.user.email,
              oldPassword : oldPassword,
              newPassword : newPassword
            }, function(error) {
              if (error === null) {
                resolve('ok');
              } else {
                resolve(error.message);    
              }
            });

          } else {
            resolve('New password is too short.');
          }
        } else {
          resolve('An unkown error occured.');
        }
      });
    }

}


    